import { describe, expect, it } from 'vitest';
import { X509Certificate } from 'node:crypto';
import { createSecureContext } from 'node:tls';
import { getDatabaseConnection, getMigrationCredentials } from '../lib/database-config';
import { hasCloudConfiguration } from '../lib/cloud';
import { supabaseRootCertificates } from '../lib/supabase-ca';

const transaction =
  'postgres://test_user:test_password@pooler.example.test:6543/postgres?sslmode=require&supa=base-pooler.x&pgbouncer=true';
const session =
  'postgres://test_user:test_password@pooler.example.test:5432/postgres?sslmode=require';
const auth = {
  AUTH_SECRET: 'unit-test-session-secret',
  AUTH_GOOGLE_ID: 'unit-test-client',
  AUTH_GOOGLE_SECRET: 'unit-test-client-secret',
};

describe('Supabase and Vercel database configuration', () => {
  it('accepts the injected POSTGRES_URL without requiring a duplicate DATABASE_URL', () => {
    expect(getDatabaseConnection({ POSTGRES_URL: transaction })?.url).toContain(
      'pooler.example.test:6543',
    );
    expect(hasCloudConfiguration({ POSTGRES_URL: transaction, ...auth })).toBe(true);
  });
  it('does not mistake Supabase API keys for Google sign-in configuration', () => {
    expect(
      hasCloudConfiguration({
        POSTGRES_URL: transaction,
        SUPABASE_PUBLISHABLE_KEY: 'test-publishable-key',
      }),
    ).toBe(false);
    expect(hasCloudConfiguration(auth)).toBe(false);
  });
  it('removes provider and Prisma flags instead of sending unsupported startup parameters', () => {
    const url = new URL(
      getDatabaseConnection({
        POSTGRES_PRISMA_URL:
          transaction +
          '&schema=public&connection_limit=1&pool_timeout=10&application_name=Mellowoof',
      })!.url,
    );
    for (const key of [
      'supa',
      'pgbouncer',
      'schema',
      'connection_limit',
      'pool_timeout',
      'sslmode',
    ])
      expect(url.searchParams.has(key)).toBe(false);
    expect(url.searchParams.get('application_name')).toBe('Mellowoof');
  });
  it('preserves certificate verification for remote sslmode=require and disable URLs', () => {
    expect(getDatabaseConnection({ POSTGRES_URL: transaction })!.ssl).toEqual({
      rejectUnauthorized: true,
    });
    expect(
      getDatabaseConnection({
        POSTGRES_URL: transaction.replace('sslmode=require', 'sslmode=disable'),
      })!.ssl,
    ).toEqual({ rejectUnauthorized: true });
  });
  it('uses a configured trusted CA without disabling verification', () => {
    expect(
      getDatabaseConnection({
        POSTGRES_URL: transaction,
        DATABASE_SSL_CA: 'BEGIN\\ntrusted-certificate\\nEND',
      })!.ssl,
    ).toEqual({ rejectUnauthorized: true, ca: 'BEGIN\ntrusted-certificate\nEND' });
  });
  it.each(['aws-0-eu-central-2.pooler.supabase.com', 'db.example-project.supabase.co'])(
    'trusts the official production roots for the Supabase database host %s',
    (host) => {
      const environment = { POSTGRES_URL: transaction.replace('pooler.example.test', host) };
      const expected = { rejectUnauthorized: true, ca: supabaseRootCertificates };
      expect(getDatabaseConnection(environment)!.ssl).toEqual(expected);
      expect(getMigrationCredentials(environment)).toMatchObject({ ssl: expected });
    },
  );
  it.each([
    'aws-0-eu-central-2.pooler.supabase.com.attacker.test',
    'db.project.supabase.co.attacker.test',
    'evilpooler.supabase.com',
    'other.supabase.co',
  ])('does not extend Supabase certificate trust to %s', (host) => {
    expect(
      getDatabaseConnection({ POSTGRES_URL: transaction.replace('pooler.example.test', host) })!
        .ssl,
    ).toEqual({ rejectUnauthorized: true });
  });
  it('allows an explicit CA to override the bundled Supabase trust', () => {
    const environment = {
      POSTGRES_URL: transaction.replace('pooler.example.test', 'aws-0-test.pooler.supabase.com'),
      DATABASE_SSL_CA: '  BEGIN\\ncustom-certificate\\nEND\n',
    };
    const expected = { rejectUnauthorized: true, ca: 'BEGIN\ncustom-certificate\nEND' };
    expect(getDatabaseConnection(environment)!.ssl).toEqual(expected);
    expect(getMigrationCredentials(environment)).toMatchObject({ ssl: expected });
    expect(getDatabaseConnection({ ...environment, DATABASE_SSL_CA: '  ' })!.ssl).toEqual({
      rejectUnauthorized: true,
      ca: supabaseRootCertificates,
    });
  });
  it('bundles the intact official 2021 and 2025 production CA certificates', () => {
    const certificates = supabaseRootCertificates.match(
      /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g,
    )!;
    expect(certificates).toHaveLength(2);
    const roots = certificates.map((pem) => new X509Certificate(pem));
    expect(roots.map((root) => root.fingerprint256)).toEqual([
      '80:70:25:AD:50:D4:ED:21:9D:2C:9C:7D:29:9C:00:4F:82:4E:B0:0C:F7:F6:5A:FE:F6:07:D0:7B:72:E6:CA:FA',
      '5F:9B:77:95:1A:7A:A1:30:3F:9B:58:EE:A9:BF:A8:9E:35:8C:FD:C1:5F:97:86:FF:10:D4:93:0A:72:2C:9A:E2',
    ]);
    for (const root of roots) {
      expect(root.ca).toBe(true);
      expect(root.verify(root.publicKey)).toBe(true);
    }
    expect(() => createSecureContext({ ca: supabaseRootCertificates })).not.toThrow();
  });
  it('allows local development without TLS', () => {
    expect(
      getDatabaseConnection({ DATABASE_URL: 'postgres://test_user@localhost:5432/test' })!.ssl,
    ).toBe(false);
  });
  it('selects session pooling for migrations and transaction pooling for requests', () => {
    const environment = { POSTGRES_URL: transaction, POSTGRES_URL_NON_POOLING: session };
    expect(new URL(getDatabaseConnection(environment)!.url).port).toBe('6543');
    expect(getMigrationCredentials(environment)).toMatchObject({
      port: 5432,
      host: 'pooler.example.test',
      database: 'postgres',
      ssl: { rejectUnauthorized: true },
    });
  });
  it('keeps an explicit application database override consistent with migrations', () => {
    const override = 'postgres://test_user@override.example.test:5432/application';
    expect(
      getMigrationCredentials({ DATABASE_URL: override, POSTGRES_URL_NON_POOLING: session }),
    ).toMatchObject({ host: 'override.example.test', database: 'application' });
    expect(
      getMigrationCredentials({ DATABASE_URL: transaction, DATABASE_MIGRATION_URL: session }),
    ).toMatchObject({ port: 5432 });
  });
  it('decodes escaped credentials for the migration client', () => {
    expect(
      getMigrationCredentials({
        DATABASE_URL: 'postgres://test_user:p%40ss%3Aword@pooler.example.test/database',
      }),
    ).toMatchObject({ user: 'test_user', password: 'p@ss:word' });
  });
  it('reports invalid configuration without including a credential value', () => {
    const bad = 'private-test-password-not-a-url';
    try {
      getDatabaseConnection({ DATABASE_URL: bad });
      throw new Error('Expected validation failure');
    } catch (error) {
      expect(String(error)).toContain('Invalid PostgreSQL connection string');
      expect(String(error)).not.toContain(bad);
    }
    expect(() => getDatabaseConnection({ DATABASE_URL: 'https://example.test/database' })).toThrow(
      'Invalid PostgreSQL',
    );
  });
  it('keeps account access unavailable without database configuration', () => {
    expect(getDatabaseConnection({})).toBeNull();
    expect(getMigrationCredentials({})).toEqual({ url: '' });
    expect(hasCloudConfiguration({})).toBe(false);
  });
});
