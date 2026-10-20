import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { sql } from 'drizzle-orm';
const identity = vi.hoisted(() => ({ user: null as string | null }));
vi.mock('@/auth', () => ({
  auth: async () => (identity.user ? { user: { id: identity.user } } : null),
}));
vi.mock('@/lib/cloud', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../lib/cloud')>()),
  cloudConfigured: true,
}));
vi.mock('@/db', async () => {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  return { db: drizzle(new PGlite()) };
});
import { db } from '@/db';
import { users, userData } from '@/db/schema';
import { GET, PUT } from '@/app/api/state/route';
import { sampleState } from './fixtures';
const request = (state = sampleState(), revision = 0, extra = {}) =>
  new Request('http://localhost:3000/api/state', {
    method: 'PUT',
    headers: { origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
    body: JSON.stringify({ state, revision, ...extra }),
  });
beforeAll(async () => {
  const migration = readFileSync('db/migrations/0000_friendly_ironclad.sql', 'utf8');
  for (const statement of migration.split('--> statement-breakpoint'))
    if (statement.trim()) await db!.execute(sql.raw(statement));
  await db!.insert(users).values([
    { id: 'alice', email: 'alice@example.test' },
    { id: 'bob', email: 'bob@example.test' },
  ]);
}, 30000);
beforeEach(async () => {
  identity.user = null;
  await db!.delete(userData);
});
describe('cloud API with a real embedded PostgreSQL engine and mocked session identities', () => {
  it('denies anonymous reads and writes', async () => {
    expect((await GET()).status).toBe(401);
    expect((await PUT(request())).status).toBe(401);
  });
  it('saves only under the server session, ignoring an injected owner', async () => {
    identity.user = 'alice';
    expect((await PUT(request(sampleState(), 0, { userId: 'bob' }))).status).toBe(200);
    identity.user = 'bob';
    const bob = await (await GET()).json();
    expect(bob.state.dogs).toEqual([]);
    identity.user = 'alice';
    const alice = await (await GET()).json();
    expect(alice.state.dogs[0].name).toBe('Maple');
  });
  it('keeps identically named dog ids isolated between accounts', async () => {
    identity.user = 'alice';
    await PUT(request());
    identity.user = 'bob';
    const state = sampleState();
    state.dogs[0].name = 'Poppy';
    await PUT(request(state));
    identity.user = 'alice';
    expect((await (await GET()).json()).state.dogs[0].name).toBe('Maple');
  });
  it('rejects stale revisions instead of overwriting another tab', async () => {
    identity.user = 'alice';
    expect((await PUT(request())).status).toBe(200);
    expect((await PUT(request())).status).toBe(409);
    expect((await PUT(request(sampleState(), 1))).status).toBe(200);
  });
  it('rejects cross-origin and malformed writes', async () => {
    identity.user = 'alice';
    const foreign = request();
    foreign.headers.set('origin', 'https://untrusted.example');
    expect((await PUT(foreign)).status).toBe(403);
    const invalid = new Request('http://localhost:3000/api/state', {
      method: 'PUT',
      headers: { origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
      body: '{}',
    });
    expect((await PUT(invalid)).status).toBe(400);
  });
});
