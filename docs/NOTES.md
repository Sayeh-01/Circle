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

## v1.0 plan (B10)
1. pnpm workspace, shared package (money, rotation, recurrence, permissions, templates, zod schemas) — tests first.
2. Drizzle schema + first migration; PGlite test harness with real OTP sign-in.
3. Route helper = single authorization choke point; route sweep + cross-group tests from day one.
4. Groups/templates/invites → tasks/lists/events/Today → expenses/polls/chat/activity/realtime → push + account deletion.
5. Expo app: tabs (Today · Groups · + · Inbox · Me), group home + module tabs, all module screens, Arabic/RTL.
6. Playwright against the exported web build served by the API (same origin → cookie sessions just work).

## v1.0 review pass (1 round)
- Found: WebSocket route registered after the `/api/*` 404 catch-all → never connected (caught by E2E). Fixed: realtime
  registers inside `createApp` before catch-alls; real-socket test added.
- Found: persisted query cache restored as "fresh" after reload → stale screens. Fixed: invalidate after restore and on
  every socket (re)connect.
- Found: Arabic plural forms missing (fell back to English). Fixed with `_zero/_one/_two/_few/_many/_other`.
- Found: group `photo` accepted any id; dev origin trusted in production. Fixed.
- Left as is: profile photos (`/api/photos/:id`) are readable by any signed-in user who has the id (ids are only shown to
  people who share a group). API routes have no rate limiting outside Better Auth until v6.3.
- Native RTL switch needs an app restart (B7 #5). In dev the app reloads itself (`DevSettings.reload`); in production
  builds we ask the user to reopen the app instead of adding `expo-updates` just for `reloadAsync`. Owner device check #5.
- Date/time input uses day chips + an HH:MM field instead of a native picker (no extra native module, works on web).
- Quiet hours / daily digest (A9) have no version in B5; not built.

## v1.1 plan
1. Guest links as data (`guest_links`: group, token, entity, entity id, revoked_at); one resolver = the guest form of the
   membership guard (unknown/revoked token or other item id → 404).
2. Server-rendered guest pages (no JS) with OG tags for WhatsApp cards; JSON API for the same actions.
3. ICS feed per user with a revocable token; universal-link files from env.
4. Phone OTP via Better Auth plugin + SMS adapter; Google/Apple from env vars.

## v1.1 decisions
- Guest pages live at `/p/:token` because the app already uses `/g/:groupId`.
- Guest RSVPs are rows in `event_rsvps` with `user_id = guest:<uuid>` (uuid kept in an httpOnly cookie) and `guest_name`,
  so capacity and the waitlist count guests with no special cases. `notify()` skips `guest:` ids.
- "See what they owe / confirm payment" through a guest link (A9) needs non-members inside expense splits; not in the B5
  v1.1 row's must-prove list, so guests get event RSVP + list view only (feature stop rule: simplest form).
- The install prompt shows from the third guest visit ("after their second interaction"), counted in a cookie.
- Phone sign-up creates a placeholder email `<digits>@phone.circle.invalid` (Better Auth requires an email).
- Found in review: the creator's socket did not subscribe to a newly created group → creating a group emits a membership
  event to the creator.

## v1.2 plan
1. Points as a ledger table (task / redeem / refund / adjust), balance = SUM; redemption locks the member row first.
2. Streaks and fairness as pure functions in shared (group timezone), tested there.
3. Child accounts = real users with `is_child`, `managed_by`, PIN hash; sign-in via a Better Auth plugin endpoint so the
   session cookie is Better Auth's own (works with the Expo plugin on native).
4. Chore approval for Children (setting `childApproval`, default on).
5. Voice notes: `expo-audio` recorder on native, `<audio>` on web; messages get `audio_file_id`, `audio_ms`.

## v1.2 decisions
- A Child's completion is `pending` until an approver approves; points are added on approval (A6 "parent approval").
- "No links outside the family" is enforced server-side: Children can't create groups, preview/join invites or create guest
  links. AI is not built yet; when it is (v1.4), Child accounts get no AI routes.
- **React Compiler turned off** (`experiments.reactCompiler: false`). It was on in the SDK 58 template; it produced a
  render-time crash (reads `obj.prop` used only inside an event handler). Stability over a small render optimisation.
- Kids home lists every open chore assigned to the child (dated or not), unlike adult Today (7-day window per spec).
- The fairness meter counts chore points earned this calendar month (group timezone); the spec doesn't define the window
  beyond "this month".
- `expo-audio` — voice notes record/play (v1.2, B3 Expo SDK module).
- `expo-haptics` — success haptic on completing a chore (A13 design).

## v1.3 plan
1. Pure logic first: exact balancer (DP over size × skill sum) + SM-2, each checked against independent tests.
2. Sport tables: skills, match votes (PK event+voter), carpool offers/riders. Study tables: focus sessions, countdowns,
   decks/cards/per-member reviews, pages.
3. Presence reuses the v1.0 WebSocket rooms; REST focus sessions give minutes/streaks.

## v1.3 decisions
- Sport features (balancer, MOTM, attendance, carpool) live in one module `teams` ("Team builder" in A7) so a template
  switches them on with one entry. Exam countdowns live in the `focus` module.
- MOTM votes can't be changed (strict reading of "one vote per player per match"); voting opens at kick-off.
- Attendance = RSVP "going" for past, non-cancelled events (no separate check-in); a no-show marker can be added later.
- A focus session counts at most 3 hours if the app never sent "stop".
- Home-screen widgets: Skip per B5 (owner's list in REPORT).

## v1.4 plan
1. `mergeIngredients` in shared (tested), meals + memories tables, to-list merges into open list lines.
2. Yearly book = server HTML with embedded photos → expo-print on device.
3. One `AiModel` interface: Claude (official SDK; Haiku 5.5 structured output for parsing, Sonnet 5.5 for summaries),
   recorded fake for tests, rule-based fake behind `AI_FAKE=1` for E2E. Every AI route returns drafts; ids in a model's
   answer are re-checked against what the user can see.

## v1.4 decisions
- Model ids follow the spec (A10): `claude-haiku-5-5` for parsing, `claude-sonnet-5-5` for summaries/assistant. Parsing runs
  at effort `low` (cheap, fast); the Sonnet call opts into the server-side refusal fallback (`fallbacks: "default"`, beta
  `server-side-fallback-2026-07-01`) per the Claude API guidance.
- The model only ever sees groups where the user may create items, with member display names (no emails/phones).
- `@anthropic-ai/sdk` added (server only) — official SDK for Claude (B4 ai module).
- Grocery merge does not convert between units (500 g + 1 kg stay two lines) — no silent unit maths.
- Web "yearly book" uses the browser print dialog (expo-print's PDF file + share sheet is native-only).
