import { describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { createSupabaseSetupSql } from '../scripts/create-supabase-setup.mjs';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';

describe('Supabase SQL Editor setup', () => {
  it('matches the current migration files', () => {
    expect(readFileSync('docs/SUPABASE_SETUP.sql', 'utf8')).toBe(createSupabaseSetupSql());
  });
  it('preserves records on repeat runs and blocks public API roles, including service-role bypass', async () => {
    const pg = new PGlite();
    try {
      await pg.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;`);
      const setup = readFileSync('docs/SUPABASE_SETUP.sql', 'utf8');
      await pg.exec(setup);
      await pg.exec(
        "INSERT INTO public.users (id, name) VALUES ('setup-test', 'Synthetic test owner')",
      );
      await pg.exec(setup);
      // The official CLI/ORM migrator must recognize SQL Editor-applied migrations.
      await migrate(drizzle(pg), { migrationsFolder: './db/migrations' });
      expect((await pg.query('SELECT id FROM public.users')).rows).toEqual([{ id: 'setup-test' }]);
      expect(
        (await pg.query('SELECT count(*)::int AS count FROM drizzle.__drizzle_migrations')).rows,
      ).toEqual([{ count: 2 }]);
      const security = await pg.query<{ relname: string; relrowsecurity: boolean }>(
        `SELECT relname, relrowsecurity FROM pg_class WHERE oid IN ('public.users'::regclass, 'public.accounts'::regclass, 'public.auth_sessions'::regclass, 'public.verification_tokens'::regclass, 'public.user_data'::regclass)`,
      );
      expect(security.rows).toHaveLength(5);
      expect(security.rows.every((row) => row.relrowsecurity)).toBe(true);
      for (const role of ['anon', 'authenticated', 'service_role']) {
        const permissions = await pg.query<{ allowed: boolean }>(
          `SELECT has_table_privilege($1, table_name, 'SELECT') OR has_table_privilege($1, table_name, 'INSERT') OR has_table_privilege($1, table_name, 'UPDATE') OR has_table_privilege($1, table_name, 'DELETE') AS allowed FROM unnest(ARRAY['public.users','public.accounts','public.auth_sessions','public.verification_tokens','public.user_data']) AS table_name`,
          [role],
        );
        expect(permissions.rows.every((row) => !row.allowed)).toBe(true);
        await pg.exec(`SET ROLE ${role}`);
        try {
          await expect(pg.query('SELECT state FROM public.user_data')).rejects.toThrow(
            /permission denied/,
          );
        } finally {
          await pg.exec('RESET ROLE');
        }
      }
    } finally {
      await pg.close();
    }
  }, 30000);
});
