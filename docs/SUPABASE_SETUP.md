# Supabase with Vercel

Supabase supplies Mellowoof's PostgreSQL database. Keep the existing Vercel integration: the app reads its `POSTGRES_URL` automatically. No Neon database, Vercel Storage bucket, Supabase Auth setup, or Supabase API keys are needed. Dog photos are compressed into the app's stored state.

## Create the database tables

Open your Supabase project's **SQL Editor**, create a query, paste the entire contents of [SUPABASE_SETUP.sql](SUPABASE_SETUP.sql), and run it as the default `postgres` role. This creates the five application tables and the migration journal in one transaction, enables row-level security, and removes Supabase Data API access to the application tables. The server continues to access them through its PostgreSQL connection.

The script can be run again without deleting application rows. It also recognizes migrations already applied by Drizzle. Unexpected untracked table names or conflicting migration checksums cause a rollback instead of replacing tables. If that happens, inspect the existing schema and journal before continuing. Do not run this file concurrently with another migration command.

Alternatively, with exported private database environment variables, run `npm run db:migrate`. The app uses the transaction pooler on port 6543 at runtime; migrations should use `POSTGRES_URL_NON_POOLING` with the session pooler on port 5432, or a reachable direct connection. `DATABASE_MIGRATION_URL` can explicitly select an administrative connection to the same database. An explicit `DATABASE_URL` overrides integration bindings for both runtime and migrations. See [deployment](DEPLOYMENT.md) for TLS and environment-file handling.

For future schema changes, generate and review migrations, then run `npm run db:setup-sql` to refresh the SQL Editor file before committing. The generated file contains schema SQL and migration hashes, never credentials.

## Enable Google sign-in

In the Google Cloud console, create a Google OAuth **Web application** client and register this production callback exactly:

```text
https://doggofixxo.vercel.app/api/auth/callback/google
```

Configure the Google consent screen and test users if the client is in testing. In the Vercel project's environment settings, add these settings for the production environment:

| Name                 | Value source                                                                       |
| -------------------- | ---------------------------------------------------------------------------------- |
| `AUTH_SECRET`        | Generate a random app secret privately, for example with `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID`     | Google OAuth web client ID                                                         |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret                                                         |

The integration's existing `POSTGRES_URL` supplies database access. Supabase publishable/anonymous keys, JWT secrets and service-role keys cannot substitute for these three Auth.js settings. Keep all secret values in private environment settings. Optional `AUTH_URL` can set the canonical origin to `https://doggofixxo.vercel.app`.

Redeploy after the GitHub update and environment changes. Verify Google sign-in, create a cloud dog, reload to confirm persistence, sign out, and use a second Google account to check isolation. Demo records remain separate; transfer them explicitly with Profile export/import if needed.

Local tests verify migrations and authorization using embedded PostgreSQL. They do not apply these tables to your Supabase project or verify the deployed Google flow.
