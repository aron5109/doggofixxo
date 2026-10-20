import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../app/api/setup-status/route';

beforeEach(() => {
  for (const name of [
    'DATABASE_URL',
    'POSTGRES_URL',
    'POSTGRES_PRISMA_URL',
    'POSTGRES_URL_NON_POOLING',
    'AUTH_SECRET',
    'AUTH_GOOGLE_ID',
    'AUTH_GOOGLE_SECRET',
  ])
    vi.stubEnv(name, '');
  vi.stubEnv('VERCEL_ENV', 'production');
  vi.stubEnv('VERCEL_GIT_COMMIT_SHA', '1234567890abcdef1234567890abcdef12345678');
});
afterEach(() => vi.unstubAllEnvs());

describe('safe deployment configuration diagnostics', () => {
  it('reports each missing binding and identifies the deployed environment without disclosing values', async () => {
    const response = GET();
    expect(response.status).toBe(503);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({
      status: 'configuration_needed',
      environment: 'production',
      commit: '1234567',
      missing: [
        'POSTGRES_URL (or DATABASE_URL)',
        'AUTH_SECRET',
        'AUTH_GOOGLE_ID',
        'AUTH_GOOGLE_SECRET',
      ],
      invalid: [],
    });
  });
  it('identifies a single unavailable secret even when the other production bindings exist', async () => {
    vi.stubEnv('POSTGRES_URL', 'postgres://test:test-password@pooler.example.test:6543/postgres');
    vi.stubEnv('AUTH_GOOGLE_ID', 'test-client-id');
    vi.stubEnv('AUTH_GOOGLE_SECRET', 'test-client-secret');
    vi.stubEnv('AUTH_SECRET', '   ');
    expect((await GET().json()).missing).toEqual(['AUTH_SECRET']);
  });
  it('reports configuration readiness without echoing credentials or claiming a live connection', async () => {
    vi.stubEnv('POSTGRES_URL', 'postgres://test:test-password@pooler.example.test:6543/postgres');
    vi.stubEnv('AUTH_SECRET', 'test-session-secret');
    vi.stubEnv('AUTH_GOOGLE_ID', 'test-client-id');
    vi.stubEnv('AUTH_GOOGLE_SECRET', 'test-client-secret');
    const response = GET();
    expect(response.status).toBe(200);
    const result = await response.text();
    expect(JSON.parse(result)).toMatchObject({
      status: 'configuration_ready',
      missing: [],
      invalid: [],
    });
    for (const value of [
      'test-password',
      'test-session-secret',
      'test-client-id',
      'test-client-secret',
      'pooler.example.test',
    ])
      expect(result).not.toContain(value);
  });
  it('redacts malformed database URLs rather than returning the parser error', async () => {
    vi.stubEnv('POSTGRES_URL', 'malformed-private-test-credential');
    const response = GET();
    expect(response.status).toBe(503);
    const result = await response.text();
    expect(JSON.parse(result).invalid).toEqual(['POSTGRES_URL (or DATABASE_URL)']);
    expect(result).not.toContain('malformed-private-test-credential');
  });
});
