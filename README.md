# Mellowoof 🐾

**Little steps. Happier tails.** A mobile-first app for kind, reward-based dog training.

## Features

- Confirm-or-cancel onboarding, eight original illustrated avatars, optional photos, editable profiles and multiple dogs.
- Thirty-five complete lessons: fifteen foundation, ten intermediate and ten advanced, across nine topics. Level/topic filters, behavioral readiness and linked prerequisites help choose the next skill. Every lesson includes preparation, safety, timers, success criteria, adjustments, rewards and references.
- Start/pause/resume/skip/early-finish timers, session feedback and notes. Practice progress follows observed success over separate days; maintenance and observations stay distinct.
- Month/week/agenda calendar, appointment CRUD, recurring reminders, lesson scheduling and automatic completed-session entries.
- One hundred sixty searchable tips in sixteen categories, favorites, and a daily dashboard tip. Trainer reading links cover Zak George, Victoria Stilwell, Brandon McMillan, Grisha Stewart and Cesar Millan; exercises use original wording and reward-based methods.
- Google sign-in, server-side database sessions, private PostgreSQL records, and validated JSON backup export/import.
- Responsive navigation, accessible dialogs and forms, reduced motion, bundled Nunito fonts and installable PWA with an offline reconnect screen.

## Local setup

Use Node **24** (22+ supported) and npm in this existing checkout. Cloud tasks are isolated; do not create a Git worktree unless explicitly requested.

```sh
npm ci
npm run dev
```

The app runs on port 3000 and requires Google sign-in before onboarding or viewing personal records. Configure PostgreSQL and Auth.js as described below to use an account. Without those settings, the app displays a sign-in unavailable screen. No browser-local account or storage fallback is provided.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm start
```

Browser tests check the production build’s access gate and exercise authenticated desktop/mobile journeys in an isolated Vite harness using the actual app components and mocked API responses. The harness is outside Next.js routes and provides no production authentication bypass. Use system Chromium, `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. Tests include persistence across reloads, Google redirect initiation, save failures, expired sessions, sign-out and axe scans. Database/API tests use embedded PostgreSQL with mocked session identities; a live Google account is still required to verify provider consent.

## Cloud configuration

Copy `.env.example` to `.env.local`, supply values privately, and restart Next.js:

| Variable                         | Purpose                               |
| -------------------------------- | ------------------------------------- |
| `DATABASE_URL` or `POSTGRES_URL` | Server-side PostgreSQL connection URL |
| `AUTH_SECRET`                    | Strong random application secret      |
| `AUTH_GOOGLE_ID`                 | Google OAuth web client ID            |
| `AUTH_GOOGLE_SECRET`             | Google OAuth client secret            |

A database URL and all three Auth.js settings must be present to enable account access. Supabase's Vercel integration supplies `POSTGRES_URL` automatically; there is no need to duplicate it as `DATABASE_URL`. Supabase API keys do not replace the Google/Auth.js settings. Use `openssl rand -base64 32` to generate an application secret. Never commit secrets or backups.

For Supabase, follow [the setup guide](docs/SUPABASE_SETUP.md), including the SQL Editor option. For command-line migrations, Drizzle reads exported process variables, not `.env.local` automatically. In a private shell, load them with `set -a; . ./.env.local; set +a` (without shell tracing), then run `npm run db:migrate`. Migrations prefer `POSTGRES_URL_NON_POOLING` over the integration's transaction pooler. An explicit `DATABASE_URL` overrides integration variables for both runtime and migrations; `DATABASE_MIGRATION_URL` can select a separate administrative connection to that same database. Remote connections verify TLS; `DATABASE_SSL_CA` can supply a trusted provider root certificate when required.

Register the exact Google callback: `http://localhost:3000/api/auth/callback/google` locally and `https://YOUR_DOMAIN/api/auth/callback/google` in production. Optional `AUTH_URL` sets a canonical origin. On non-Vercel proxies, configure Auth.js trusted-host handling according to its documentation.

Signed-out visitors see the Google sign-in page. Authenticated accounts start empty; every dog, session and appointment is loaded and saved through the authenticated API. Sign-out removes the server session and returns to sign-in. Personal data is never persisted in localStorage. Failed loads block editing, and failed saves pause further writes while allowing an export of unsaved changes.

## Vercel

Import **aron5109/doggofixxo** as a Next.js project, select Node 24, install with `npm ci` and build with `npm run build`. Configure the database connection and three Auth.js settings, apply the database migrations, register the production Google callback and deploy. Missing settings leave sign-in unavailable; the application never falls back to browser-local records. Supabase provides PostgreSQL; no additional Neon database or Vercel Storage is required. A local build does not establish a successful deployment.

See [deployment](docs/DEPLOYMENT.md), [architecture](docs/ARCHITECTURE.md), [training research](docs/TRAINING_RESEARCH.md) and [brand guide](docs/BRAND_GUIDE.md).

## Limits

Mellowoof is educational and does not replace veterinary care. Each practice milestone needs two reported comfortable successes on separate days, with at most one credit per day across a lesson. This is a transparent product heuristic, not a clinically validated recovery threshold or proof of readiness for an advanced exercise. A 100% practice record starts optional maintenance and does not mean permanent resolution. The intermediate and advanced exercises are original educational adaptations; trainer references are further reading, not endorsements or claims to reproduce their protocols. Primary trainer pages could not be fetched from this workspace; current page content was not independently verified. See the research notes for scope and source-access limits.

Recurring reminders are in-app entries, not push notifications. They repeat in the browser’s current time zone; travelling changes their displayed base time. Month-end repeats clamp without drifting future months. Cloud conflicts pause saving; export unsaved changes before reloading. An internet connection is required to load and save records. Offline navigation shows a reconnect page; personal records are never cached for offline use. Automated accessibility scans do not certify full WCAG compliance.
