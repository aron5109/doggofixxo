# Architecture

Next.js App Router serves React/TypeScript, Tailwind CSS, shadcn-style primitives using CVA and Radix, Lucide icons and Motion. Nunito is local. The root client owns navigation; onboarding, calendar and the lesson player are separate components. Typed content is in `lib/lessons.ts`, `lib/tips.ts` and `lib/references.ts`. `lib/model.ts` holds validation, progress, recurrence and timer calculations.

## Identity and persistence

The version-1 Zod state document contains dog profiles, each with sessions and appointments, plus active selection and favorite IDs. The server requires a valid Auth.js session before rendering the authenticated application. Signed-out visitors see Google sign-in; missing configuration shows a temporary-unavailability screen. There is no browser-local store or authentication bypass. Imports are validated, limited to 8 MB and require confirmation before replacing data. Photos are compressed and restricted to raster image data URLs. Deleting a dog requires confirmation and removes its associated records.

Auth.js Google uses the Drizzle adapter and database sessions. The server obtains the owner from the authenticated HTTP-only session cookie. Both API methods scope every query/update to that owner, never a client-submitted owner or dog ID. PUT requires same-origin JSON and a matching revision. Transactional conditional updates prevent silent concurrent overwrites. Cloud saves queue sequentially, show pending/error states and pause after failure. Export unsaved changes before reload. Service workers never cache APIs or private HTML.

PostgreSQL tables: `users`, `accounts`, `auth_sessions`, `verification_tokens`, `user_data`. The last table has one JSONB state document per user with a primary/foreign key, revision and update timestamp. Dogs, sessions and appointments are linked by containment under that owner and dog. This MVP favors atomic backups over normalized per-session tables. Limits: 12 dogs, 1,000 observations and 300 appointments per dog; 8 MB requests. Larger installations should normalize records and add pagination/retention.

These five tables have row-level security enabled with no public API policies. Migrations revoke table privileges from `PUBLIC` and, when present, Supabase's `anon`, `authenticated` and `service_role` roles. This prevents access through Supabase's Data API, including its service-role RLS bypass. Auth.js and app queries use the server's table-owner connection; the authenticated Next.js API enforces per-account access. Supabase supplies PostgreSQL here, while Auth.js handles Google sign-in. The app does not use Supabase Auth, its browser API keys, or a separate object-storage bucket; compressed dog photos live inside the state document.

`lib/database-config.ts` selects the explicit `DATABASE_URL` or Vercel integration aliases, removes client-only URL flags, and supplies verified TLS settings to the PostgreSQL driver. Migrations can use a session-pooler URL separately from runtime's transaction pooler. `docs/SUPABASE_SETUP.sql` is generated from the same migration files and records their checksums in Drizzle's journal so later CLI migrations recognize them.

Account records stay in React memory rather than localStorage and are fetched from the authenticated API on each reload. Failed loads block editing. Save failures pause subsequent writes and preserve the unsaved in-memory state for export; expired sessions offer sign-in again. Signing out removes the server session and returns to the Google sign-in screen.

## Training model

Sessions have a UUID, lesson, timestamps, observed local day, active timer duration, outcome, criterion observation, milestone, notes and computed progress snapshot. UUIDs make feedback recording idempotent. Absolute deadlines survive background-tab throttling; intervals only render the display. Expiry never advances the exercise or implies success. Untimed and skipped intervals do not add active duration.

Three milestones correspond to explicit success criteria. Each needs two Great results with the criterion observed on separate days. Only one success per local day receives credit across that lesson. Duplicates, out-of-order milestones, partial results and difficulty do not advance progress. Six credited days give 100%; later observations are maintenance and retain 100%. This is a product heuristic, not a validated treatment outcome.

Next-session suggestions: one day for ordinary practice, two days after difficulty with rest/easier-step guidance, seven days for optional maintenance. Scheduling requires user action. Weekly reinforcement is a recurring series.

## Calendar and PWA

Appointments store ISO instants and the creation time-zone name. Input/display use the current browser time zone. Weekly repeats preserve local wall-clock time across DST; month/year repeats derive from the original date, clamping short months without drifting. A time-zone change shifts the base display; subsequent repeats follow that browser-local display. Edits/deletes affect the entire series. Completed sessions are derived into the calendar with outcome, duration, notes and progress snapshot.

The manifest and icons support installation. The worker caches public static assets and a reconnect page only. Loading and saving personal records requires connectivity. No push notifications, offline cloud cache or background cloud sync is implied.

## Tests and remaining integration work

Vitest covers records, progress, timers, recurrence, database configuration and API authorization. API tests apply the committed migrations in PGlite and mock authenticated identities/configuration while exercising actual PostgreSQL queries. SQL setup tests also check repeatability, data preservation and Supabase API-role denial. Playwright checks the production access gate separately from authenticated UI journeys. An isolated Vite harness outside Next.js routes renders the actual components with synthetic account props and mocked API responses; it never ships a production authentication bypass. Tests cover desktop/mobile journeys, save failures, session expiry, sign-out, backups and reloads; axe scans check automatable accessibility rules. OAuth consent, real remote database connectivity and published Vercel deployment need external access and are not proven by these tests.
