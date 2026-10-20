import { supabaseRootCertificates } from './supabase-ca';

type Environment = Record<string, string | undefined>;
type DatabasePurpose = 'runtime' | 'migration';

export function getDatabaseConnection(
  environment: Environment = process.env,
  purpose: DatabasePurpose = 'runtime',
) {
  // An explicit application override must never migrate a different integration database.
  const names =
    purpose === 'migration'
      ? [
          'DATABASE_MIGRATION_URL',
          'DATABASE_URL',
          'POSTGRES_URL_NON_POOLING',
          'POSTGRES_URL',
          'POSTGRES_PRISMA_URL',
        ]
      : ['DATABASE_URL', 'POSTGRES_URL', 'POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING'];
  const value = names.map((name) => environment[name]?.trim()).find(Boolean);
  if (!value) return null;

  let parsed: URL;
  try {
    parsed = new URL(value);
    if (
      !['postgres:', 'postgresql:'].includes(parsed.protocol) ||
      !parsed.hostname ||
      parsed.pathname.length < 2
    )
      throw new Error();
  } catch {
    // URL parser errors can include the complete URL and password. Never propagate them.
    throw new Error(
      'Invalid PostgreSQL connection string. Check the server-side database settings.',
    );
  }
  const local = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(parsed.hostname);
  const mode = parsed.searchParams.get('sslmode') ?? parsed.searchParams.get('ssl');
  // Supabase's production roots are not part of Node's public CA store. Scope
  // that trust to its documented database hosts, with an explicit CA override.
  const supabase = /^(?:db\.[a-z0-9-]+\.supabase\.co|[a-z0-9-]+\.pooler\.supabase\.com)$/i.test(
    parsed.hostname,
  );
  const ca =
    environment.DATABASE_SSL_CA?.trim().replace(/\\n/g, '\n') ||
    (supabase ? supabaseRootCertificates : undefined);
  const ssl =
    local && (!mode || mode === 'disable' || mode === 'false')
      ? (false as const)
      : { rejectUnauthorized: true as const, ...(ca ? { ca } : {}) };

  // These belong to Prisma/provider clients, not PostgreSQL startup parameters.
  for (const key of [
    'pgbouncer',
    'supa',
    'connection_limit',
    'pool_timeout',
    'schema',
    'ssl',
    'sslmode',
    'sslrootcert',
    'sslcert',
    'sslkey',
  ])
    parsed.searchParams.delete(key);

  return { url: parsed.toString(), ssl };
}

export function getMigrationCredentials(environment: Environment = process.env) {
  const connection = getDatabaseConnection(environment, 'migration');
  if (!connection) return { url: '' };
  const parsed = new URL(connection.url);
  try {
    return {
      host: parsed.hostname.replace(/^\[|\]$/g, ''),
      port: Number(parsed.port || 5432),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: decodeURIComponent(parsed.pathname.slice(1)),
      ssl: connection.ssl,
    };
  } catch {
    throw new Error(
      'Invalid PostgreSQL credential encoding. Check the server-side database settings.',
    );
  }
}
