# Lotus Rewards — Production Migration Plan

Goal: turn the current single-user, `localStorage`-only prototype into a real
multi-user app, using free/cheap infrastructure, with the Gemini AI dependency
removed (per decision — not required for this app).

---

## 1. Stack decision

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend hosting | **Cloudflare Pages** (free `*.pages.dev` subdomain) | Unlimited bandwidth/requests for static assets on the free tier, deploys straight from this Vite repo. No custom domain for now. |
| Auth + Database + Storage | **Supabase** (Postgres) | One free product gives auth, a relational DB, row-level security, and file storage — this app's data (users, tasks, submissions, claims) is inherently relational. |
| Points/approval logic | **Postgres functions (RPC) via Supabase**, not client writes | Prevents a user from editing their own point balance from the browser. |

### Alternatives checked (2026)

- **Firebase** — generous free tier, no time-based pausing, but Firestore is
  NoSQL. This app's data (a task has many submissions, a submission belongs to
  a user and a task, status transitions, points ledger) is a natural
  relational model — you'd be fighting the document model for reporting
  ("total approved this month", "pending queue") that's a one-liner in SQL.
  Good fallback if you outgrow Supabase's free tier.
- **Appwrite** — open-source, feature set close to Supabase (DB, auth,
  storage, functions), cloud pricing now tracks Supabase closely. Reasonable
  1:1 swap if Supabase ever becomes a blocker, but no clear advantage today.
- **PocketBase** — completely free, single-binary, SQLite-backed. Cheapest
  possible option, but you host and operate it yourself (a VPS, backups,
  updates), and its own docs say it isn't recommended for
  production-critical apps pre-v1.0. Skip unless the $0-forever angle matters
  more than your own ops time.
- **Neon (Postgres) + Clerk (auth) + Vercel functions** — more control, more
  moving parts to wire together and pay for individually. Supabase bundles
  the same capabilities in one free tier with less integration work.

**Decision: Supabase + Cloudflare Pages.** Best fit for the data shape and
lowest integration effort for a small multi-user app.

### Known limitation: free-project pausing

Supabase pauses a free project after **1 week with no database activity**
(dashboard visits and cached reads don't count). Not a concern once real
users are hitting it regularly, but if the app sits idle during early
testing it can pause. Mitigation: a free GitHub Actions cron hitting a
lightweight query once every few days, or just accept the one-click restore
from the dashboard (paused projects are restorable for up to a year).

---

## 2. Target architecture

```text
Browser (React SPA)
   |
   |  Supabase JS client (auth + REST/RPC over HTTPS)
   v
Supabase project
   ├─ Auth            (email/password or magic link)
   ├─ Postgres         (tasks, rewards, submissions, profiles, claims)
   ├─ RLS policies      (users see/edit only their own rows; admins see all)
   ├─ Postgres RPC fns  (approve_submission, claim_reward — points math lives here)
   └─ Storage           (proof-photos bucket, one folder per user)

Cloudflare Pages
   └─ serves the built Vite/React app (static)
```

No custom backend server needed — Supabase's RPC functions + RLS play the
role App.tsx currently plays client-side.

---

## 3. Data model (replaces `constants.tsx` seed data + `AppState`)

```sql
-- extends Supabase's built-in auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  avatar text,
  points int not null default 0,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  points int not null,
  icon text not null,
  category text not null check (category in ('Mindfulness','Growth','Physical','Community')),
  active boolean not null default true
);

create table rewards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  cost int not null,
  image text,
  available boolean not null default true
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  task_id uuid not null references tasks(id),
  task_title text not null,       -- denormalized snapshot, matches current type
  proof_note text,                -- optional caption alongside the photo
  proof_image_path text not null, -- storage object path, e.g. proof-photos/{user_id}/{submission_id}.jpg
  points_awarded int not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table reward_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  reward_id uuid not null references rewards(id),
  cost int not null,
  created_at timestamptz not null default now()
);
```

This maps 1:1 onto the existing `types.ts` interfaces (`User` → `profiles`,
`Task`, `Reward`, `Submission` stay almost identical), so component props
barely change — only *where the data comes from* changes.

---

## 4. Security model (the part `localStorage` couldn't do)

- **RLS on `profiles`**: a user can `select`/`update` only their own row,
  except `points` and `role` — those columns are only writable by
  the RPC functions below (`security definer`), never by direct client
  `update`.
- **RLS on `submissions`**: a user can `insert` their own submissions and
  `select` their own; only `role = 'admin'` can `select` all / update status.
- **Storage policy on `proof-photos` bucket**: object path must start with
  the uploading user's own `user_id` folder to `insert`; a user can `select`
  (view) only their own folder, admins can `select` any. Keeps one user from
  reading or overwriting another user's proof photo.
- **`approve_submission(submission_id, decision)`** — Postgres function,
  `security definer`, checks caller's role is admin, flips submission status,
  and adjusts `profiles.points` atomically. Replaces
  `App.tsx: updateSubmissionStatus`.
- **`claim_reward(reward_id)`** — checks caller has enough points, deducts
  atomically, inserts a `reward_claims` row. Replaces `App.tsx: claimReward`.
  Doing this as a DB function (not two separate client calls) avoids a
  race condition where a user double-clicks and claims twice before their
  points balance updates.
- **Admin role assignment**: no self-service "Switch to Admin Mode" button
  (today's `isAdmin` toggle is cosmetic only). Promote a user to admin by
  hand in the Supabase dashboard, or a one-time SQL update — this is a small
  app, doesn't need an admin-invite flow yet.

---

## 5. Component-by-component changes

| File | Change |
| --- | --- |
| `App.tsx` | Remove `localStorage` state entirely. Add Supabase auth session (`supabase.auth.onAuthStateChange`), fetch `profiles` row for the current user. Remove the `isAdmin` toggle button — gate `/admin` route on `profile.role === 'admin'` instead. |
| `constants.tsx` | Delete `INITIAL_USER`/`TASKS`/`REWARDS` — seed them into Postgres once via SQL/dashboard instead. |
| `components/TasksView.tsx` | Replace the proof `<textarea>` with a photo capture/upload input (`<input type="file" accept="image/*" capture="environment">`) plus an optional text note. On submit: upload the file to the `proof-photos/{user_id}/` folder in Supabase Storage, then `insert` a `submissions` row with `proof_image_path` + `proof_note` instead of local state. |
| `components/RewardsView.tsx` | `onClaim` calls the `claim_reward` RPC instead of local math. |
| `components/AdminPanel.tsx` | Render the proof photo (signed or public URL from Storage) instead of a proof quote. `onUpdateStatus` calls `approve_submission` RPC. `onManualUpdate` becomes an admin-only RPC too (e.g. `adjust_points`), not a raw client update. Remove the "AI Verify" button and its `verifySubmission` call. |
| `components/Dashboard.tsx` | Remove `getDailyInspiration` call; use a small local static quotes array instead (`constants.tsx`, e.g. `ZEN_QUOTES: string[]`, pick by day-of-year or random on mount). |
| `services/geminiService.ts` | Delete the file. Remove `@google/genai` from `package.json`. Remove the `importmap` entry for it and the `API_KEY`/`GEMINI_API_KEY` `define` block in `vite.config.ts`. |
| new: `services/supabaseClient.ts` | `createClient(url, anonKey)` using `import.meta.env.VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`. |
| new: `components/Auth.tsx` (or similar) | Sign-in form with two paths: email + password, and a "send magic link" option (`supabase.auth.signInWithOtp`). Replaces the assumption that a user always exists. |

---

## 6. Migration phases

1. **Cleanup** — remove Gemini/AI code and dependency, add static zen quotes.
   Ships independently of everything else below.
2. **Supabase project setup** — create project, run the schema above, create
   the `proof-photos` storage bucket + its policies, seed `tasks`/`rewards`,
   write RLS policies and the two RPC functions.
3. **Auth** — add sign-in UI with email/password and magic-link options,
   wire `App.tsx` to a real session instead of a hardcoded user.
4. **Data wiring** — swap each component's local-state calls for Supabase
   queries/RPCs per the table above, including the photo upload flow in
   `TasksView.tsx` and photo rendering in `AdminPanel.tsx`.
5. **Deploy** — connect this repo to Cloudflare Pages (free `*.pages.dev`
   subdomain, no custom domain), set `VITE_SUPABASE_URL` /
   `VITE_SUPABASE_ANON_KEY` as Pages environment variables, verify build
   (`npm run build`) output deploys correctly.
6. **Hardening** — confirm RLS actually blocks a non-admin from calling the
   admin RPCs and from reading another user's storage folder (test with two
   accounts), optionally set up the keep-alive cron mentioned in §1.

---

## 7. Cost at scale

| Tier | Cloudflare Pages | Supabase |
| --- | --- | --- |
| Free | Unlimited static bandwidth/requests; Workers/Functions capped at 100k req/day if you add any | 500 MB DB, 1 GB storage, 5 GB egress/mo, 50k MAU, 2 active projects |
| Next paid step | Workers Paid: $5/mo | Pro: $25/mo (no pausing, higher limits) |

For a small friends/family-scale rewards app, free/free comfortably covers
it. Photo proofs are the one thing worth watching against the 1 GB storage
cap — compress/resize images client-side before upload (e.g. cap at ~500KB)
to get meaningfully more headroom before the $25/mo Supabase Pro tier is
needed.

---

## 8. Decisions

- **Proof of completion**: photo upload (required) to Supabase Storage, with
  an optional text note alongside it. See `proof_image_path`/`proof_note` in
  §3 and the storage policy in §4.
- **Auth method**: email/password and magic link, both enabled. Social login
  can be added later without a schema change.
- **Domain**: free `*.pages.dev` Cloudflare Pages subdomain for now, no
  custom domain purchase.

---

## 9. Security & testing

Formal/paid penetration testing isn't warranted at this scale — no payment
data, no regulated PII, small user base. The effort belongs elsewhere: with
Supabase, the anon key is *meant* to be public (it ships in the JS bundle) —
**Row Level Security is the actual security boundary**, not secrecy. The
realistic failure mode is misconfiguration (RLS left off a table, or an RPC
that doesn't check the caller's role), not someone "hacking" the app. Testing
effort should target that.

### Free automated tooling

| Category | Tool | What it catches |
| --- | --- | --- |
| Dependency vulns | GitHub Dependabot (free, auto-enabled) + `npm audit` | Known CVEs in `react-router-dom`, `@supabase/supabase-js`, etc. |
| Static code analysis | Semgrep CLI (free OSS rules) | Injection patterns, unsafe code |
| Supabase misconfig | **Supabase Security Advisor** (built into the free dashboard) | Tables with RLS disabled, exposed views, weak policies — targets the single biggest risk class for this stack |
| HTTP headers | Mozilla Observatory / securityheaders.com | Missing CSP, missing HSTS, etc. on the Cloudflare Pages deploy |
| DAST (active scan) | OWASP ZAP (free, self-run) | XSS, common web vulns, run against the live `*.pages.dev` URL |
| Secrets in git | GitHub secret scanning (free on all repos) | Accidentally committed keys |
| Diff review | This repo's `/code-review` skill, `security-review` mode | Injection, auth bypass, exposed secrets — run against the PR that adds the Supabase integration, before merge |

### Manual boundary test (do this before calling §6 "done")

Create two real accounts — a plain `user` and an `admin` — and deliberately
try to break the RLS/RPC boundaries between them:

- Call `approve_submission` / `adjust_points` while logged in as the plain
  user (should be rejected).
- Fetch another user's `proof-photos/{other_user_id}/` folder directly via
  the Storage API (should be denied).
- Run a raw `update profiles set points = ...` from the browser console
  using the logged-in user's session (should be denied — only the RPC
  functions can touch `points`/`role`).
- Try signing in with a magic link for one account while a different
  account's session is active, to confirm sessions don't cross.

If all four fail as expected, the RLS model is doing its job. This is a
15-minute check but catches the failure mode that actually matters for this
architecture, which a generic pentest would not target as precisely.

### When to revisit formal pentesting

Worth paying for a real pentest/audit only if this app later starts handling
payment info, more sensitive personal data, or scales to a point where a
breach would have real consequences beyond this app's own users — none of
which apply at the current scope.
