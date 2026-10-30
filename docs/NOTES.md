# Circle — build notes & decisions

Decisions made while the owner is away (SPEC B0/B8). Newest at the bottom of each section.

## Session setup
- **Repository mix-up.** This session was attached to `Sayeh-01/High_level_calc` (a desktop accounting app). The spec lives in
  `Sayeh-01/Circle` (`main` holds only `docs/SPEC.md`). Push access to `Sayeh-01/Circle` was refused for this session, so the
  work is pushed to the designated branch `claude/circle-mobile-app-zm3gcj` of `High_level_calc`. The branch is **based on
  Circle's `main` commit `1d6fcc4` ("Create SPEC.md")**, so it shares history with `Sayeh-01/Circle` and can be pushed there
  and opened as a PR into `main` as-is (see REPORT → "Move the branch").
- `docs/SPEC.md` is the owner's file, unchanged (B1 "save it word for word" is satisfied by building on that commit).

## Stack decisions
- **Expo SDK 58** (latest; spec asks for 56+). `create-expo-app@latest` produced React 19.3 / RN 0.88.
- **pnpm with `node-linker=hoisted`** so Metro resolves workspace packages without symlink issues.
- **`@circle/shared` is consumed as TypeScript source** by Metro, tsx and Vitest (no build step).
- **No `@hono/zod-openapi`.** Routes go through one small helper (`apps/server/src/http.ts`) that applies auth, the
  membership guard, body/query zod validation and records route metadata. The OpenAPI doc (v6.3) is generated from that
  registry with zod 4's built-in `z.toJSONSchema`. Reason: less type machinery, one choke point for authorization.
- **No typed `hc` client in the app.** Importing the server's app type into the mobile package would pull server code into
  the mobile typecheck. The app uses a thin `fetch` client and shared zod types instead.
- **Jobs: own Postgres `jobs` table, not pg-boss.** pg-boss needs a TCP Postgres connection and can't run on in-process
  PGlite, but B1/B3 require the whole suite to run on PGlite. The jobs table gives the same semantics (absolute `run_at`
  computed in the group's timezone, retries with backoff, dead-lettering, dedupe keys). A `setInterval` loop runs it in the
  server. *Brief defect:* B3 (pg-boss) contradicts B1/B3 (suite runs on PGlite without Docker); took the simpler reading.
- **Push: Expo push HTTP API directly, not `expo-server-sdk`.** Same API, chunks of 100, ticket + receipt pruning;
  a plain injectable `fetch` makes B9 #11 ("unit test with mocked fetch") straightforward and avoids a dependency.
- **Recurrence: own RRULE subset** (`packages/shared/src/recurrence.ts`): FREQ D/W/M/Y, INTERVAL, COUNT, UNTIL, BYDAY
  (with ordinals for monthly), BYMONTHDAY. Expanded on local wall time in the IANA zone with `Intl` only. Reason: the
  `rrule` package's timezone handling is the classic source of B7 #3; no tz library needed.
- **Recurring events are materialized** into concrete occurrence rows (35-day horizon, refreshed lazily and by a daily
  job) so RSVPs, capacity and the waitlist work per date. Master rows carry the RRULE and are never listed.
- **Money as `bigint` with Drizzle `mode: 'number'`** — exact up to 2^53 minor units (90 trillion EGP), simpler than BigInt
  in JSON.
- **IDs are text UUIDs** (Better Auth uses text ids too).
- **Realtime auth uses a 60-second signed ticket** (`POST /api/ws-ticket` → `/api/ws?ticket=…`) so web, native and test
  clients authenticate the same way (React Native and Node WebSockets can't reliably send cookies).
- **Files: presigned PUT to `/api/uploads/:token`** (HMAC-signed, 10 min) with a disk driver in dev and memory in tests;
  the R2 driver plugs into the same `FileStorage` interface.

## Product decisions
- Account deletion (B9 #10): owned groups go to the oldest **Admin**; if there is none, to the oldest Manager, then the
  oldest adult Member; a group with nobody else is deleted. The brief only covers "oldest admin" and "nobody else";
  passing to a member avoids deleting other people's data.
- Expenses are never edited, only **reversed** (A14 audit rule); balances skip reversed expenses and rejected settlements.
- A switched-off module's routes answer 404.
- Members may invite by default (`membersCanInvite: true`); admins can turn it off.

## Dependencies added (one line each, B8)
- `hono`, `@hono/node-server`, `@hono/node-ws` — API server + WebSocket (B3).
- `drizzle-orm`, `drizzle-kit`, `@electric-sql/pglite`, `pg` — DB, migrations, in-process Postgres for tests, real Postgres driver (B3).
- `better-auth`, `@better-auth/expo` — auth with Email OTP, Expo client (B3).
- `zod` — shared schemas.
- `nodemailer` — SMTP mailer (B3).
- `tsx`, `vitest`, `typescript` — run/test TS.
- Mobile: `@tanstack/react-query` (+ persist client, async-storage persister, `@react-native-async-storage/async-storage`) — server data cache persisted (B3);
  `i18next`, `react-i18next`, `expo-localization` — i18n (B3); `expo-secure-store` — Better Auth session on native (B7 #7);
  `expo-image-picker` — photos for chat/proof; `expo-clipboard` — copy invite code; `expo-notifications` — push;
  `expo-print`, `expo-sharing` — PDFs (B3); `qrcode-generator` — invite QR rendered with plain Views (no native SVG needed);
  `@playwright/test@1.63.0` — E2E, pinned to the preinstalled browser build.
