# Mellowoof 🐾

**Little steps. Happier tails.** A mobile-first app for kind, reward-based dog training.

## Features

- Confirm-or-cancel onboarding, eight original illustrated avatars, optional photos, editable profiles and multiple dogs.
- Fifteen complete lessons across barking, separation worries, chewing, walking and bathing, with equipment, preparation, safety, step timers, success criteria, adjustments, rewards and references.
- Start/pause/resume/skip/early-finish timers, session feedback and notes. Foundation progress follows observed success over separate days; maintenance and observations stay distinct.
- Month/week/agenda calendar, appointment CRUD, recurring reminders, lesson scheduling and automatic completed-session entries.
- Seventy searchable tips in ten categories, favorites, and a daily dashboard tip.
- Persistent browser-local demo and validated JSON export/import. Cloud mode integrates Google OAuth, server-side database sessions and account-scoped PostgreSQL storage.
- Responsive navigation, accessible dialogs and forms, reduced motion, bundled Nunito fonts and installable PWA with an offline reconnect screen.

## Local setup

Use Node **24** (22+ supported) and npm in this existing checkout. Cloud tasks are isolated; do not create a Git worktree unless explicitly requested.

```sh
npm ci
npm run dev
```

The app runs on port 3000. No credentials are needed. The banner states **Local demo · saved only in this browser**. No fake cloud synchronisation or personal seed records are shipped. Clearing browser storage removes demo records; export a backup from Profile.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm start
```

Browser tests run against the production build. Use system Chromium, `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. Tests include desktop/mobile journeys and axe scans. Database/API tests use embedded PostgreSQL and mocked session identities, not a live Google account.

## Cloud configuration

Copy `.env.example` to `.env.local`, supply values privately, and restart Next.js:

| Variable             | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `DATABASE_URL`       | PostgreSQL URL with your provider’s TLS settings |
| `AUTH_SECRET`        | Strong random application secret                 |
| `AUTH_GOOGLE_ID`     | Google OAuth web client ID                       |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret                       |

All four must be present to enable cloud mode. Use `openssl rand -base64 32` to generate a secret. Never commit secrets or backups. Drizzle reads exported process variables, not `.env.local` automatically. In a private shell, load them with `set -a; . ./.env.local; set +a` (without shell tracing), then run `npm run db:migrate` to apply the committed migration.

Register the exact Google callback: `http://localhost:3000/api/auth/callback/google` locally and `https://YOUR_DOMAIN/api/auth/callback/google` in production. Optional `AUTH_URL` sets a canonical origin. On non-Vercel proxies, configure Auth.js trusted-host handling according to its documentation.

Sign-in is available from the demo banner and Profile when cloud mode is configured. Cloud records start empty and remain separate from demo records; transfer them explicitly with export/import. Sign-out removes the server session. Cloud data is never written into local demo storage.

## Vercel

Import **aron5109/doggofixxo** as a Next.js project, select Node 24, install with `npm ci` and build with `npm run build`. No cloud secrets are needed for a deployed local demo. For cloud accounts, configure the four variables, apply the database migration, register the production callback and redeploy. A local build does not establish a successful deployment.

See [deployment](docs/DEPLOYMENT.md), [architecture](docs/ARCHITECTURE.md), [training research](docs/TRAINING_RESEARCH.md) and [brand guide](docs/BRAND_GUIDE.md).

## Limits

Mellowoof is educational and does not replace veterinary care. Each foundation milestone needs two reported comfortable successes on separate days, with at most one credit per day across a lesson. This is a transparent product heuristic, not a clinically validated recovery threshold. A 100% foundation starts optional maintenance and does not mean permanent resolution.

Recurring reminders are in-app entries, not push notifications. They repeat in the browser’s current time zone; travelling changes their displayed base time. Month-end repeats clamp without drifting future months. Cloud conflicts pause saving; export unsaved changes before reloading. Demo storage uses last-write-wins across tabs, is not encrypted and needs manual backup. Offline navigation shows a reconnect page; already-loaded demo functions work, but full offline app reload is not supported. Automated accessibility scans do not certify full WCAG compliance.
