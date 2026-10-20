# Deployment

## Validate first

The source repository is https://github.com/aron5109/doggofixxo. CI installs the lockfile, lints, checks TypeScript, tests, builds and runs desktop/mobile smoke tests. Local success does not establish GitHub Actions or Vercel success.

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

## Vercel

1. Import the existing repository into an authorized Vercel account/team.
2. Choose Next.js, repository root, Node 24, `npm ci`, `npm run build`, default output. A deployment without cloud credentials runs local demo mode.
3. Enable GitHub integration for `main`. Preview domains need their own Google callback or should remain demo-only.
4. Keep secrets in Vercel environment settings, never Git. Apply the database migration and configure Google before enabling cloud accounts.

## PostgreSQL

Provision PostgreSQL with the provider’s TLS verification enabled. Use a serverless-compatible pooled connection where advised. Prepared statements are disabled for pooler compatibility and each process uses at most three connections; instances multiply usage, so monitor provider limits.

Supply `DATABASE_URL` privately as a process environment variable, or use the `POSTGRES_URL` binding supplied by the Supabase/Vercel integration. Run `npm run db:migrate` with a session pooler/direct administrative connection: by default the migration command prefers `POSTGRES_URL_NON_POOLING` over integration transaction-pooler URLs. An explicit `DATABASE_URL` overrides integration bindings in both modes; `DATABASE_MIGRATION_URL` can override migration access to that same database. Never point these overrides at different databases.

Drizzle does not automatically load Next.js `.env.local`. In a trusted private shell use `set -a; . ./.env.local; set +a` without tracing, or a secret manager. The committed migrations create auth tables and per-user data, enable row-level security, and revoke Supabase API-role access to these server-managed tables. The server connects as the table owner (the default Supabase `postgres` connection), or a deliberately configured role with RLS bypass and the necessary table privileges. Account isolation is enforced by the app's authenticated API. Migration is an explicit release step, never a per-request action. Do not use destructive schema pushes in production.

Remote TLS certificates are verified, including when a provider URL contains `sslmode=require`. Set `DATABASE_SSL_CA` to the provider's trusted root certificate in PEM format if the system trust store needs it. Literal `\n` in that variable is supported. Supabase/Prisma client-only URL flags are removed before connecting to PostgreSQL.

For Supabase SQL Editor setup without command-line database access, use [the Supabase guide](SUPABASE_SETUP.md) and its generated SQL file. No Supabase Auth or Storage configuration is needed for this app.

## Google and Auth.js

Create a Google OAuth **Web application** client. Configure the consent screen and test users if still in testing. Authorized callbacks:

- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://YOUR_DOMAIN/api/auth/callback/google`

| Variable                         | Requirement                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `DATABASE_URL` or `POSTGRES_URL` | PostgreSQL connection string                                                       |
| `AUTH_SECRET`                    | Random application secret, e.g. generated privately with `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID`                 | OAuth client ID                                                                    |
| `AUTH_GOOGLE_SECRET`             | OAuth client secret                                                                |
| `AUTH_URL` (optional)            | Canonical origin if automatic detection is unsuitable                              |

A database URL and all three Auth.js values must exist to enable cloud mode. Supabase publishable, anonymous, secret and service-role API keys are not used by this app and do not replace them. Leave the Auth.js settings absent for demo-only deployments. Do not use dummy values to claim readiness. Vercel host handling is supported automatically by Auth.js; other reverse proxies require documented trust configuration. Never log tokens or credentials. Restrict database roles and configure backups.

Outbound runtime access: PostgreSQL host/port and Google discovery/token/user-info endpoints, including `accounts.google.com`, `oauth2.googleapis.com`, `openidconnect.googleapis.com`. Setup needs `registry.npmjs.org`. Supporting welfare links open in the user’s browser; the application does not fetch them at runtime.

## Verify the deployed app

After actual deployment, test onboarding, backup, reload, Google consent, cloud dog creation, session/calendar persistence, sign-out, and a second Google account to confirm isolation. Check mobile navigation, import confirmation, private caching, connection failure reporting and database pooling. Inspect logs without printing credentials.

The repository can be built and demo mode exercised without external credentials. Local tests do not establish that remote migrations have run or that Vercel environment settings and Google OAuth consent work. Verify those operations against the actual deployment before declaring cloud accounts ready.
