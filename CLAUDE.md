# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## What this is

**GLHC Rewards** — a community rewards web app. Members earn Lotus
Points by completing real-world tasks (submitted with a photo as proof);
admins review submissions and award points; members redeem points in a
rewards marketplace. Full picture: [`wiki/Home.md`](wiki/Home.md) and
[`Docs/production-migration-plan.md`](Docs/production-migration-plan.md).

- **Frontend:** React 19 + Vite + TypeScript + Tailwind (CDN), React Router (`HashRouter`)
- **Backend:** Supabase — Postgres, Auth, Row Level Security, Storage, RPC functions, the `notify` Edge Function
- **Email:** Brevo (auth SMTP + transactional API)
- **Hosting:** Cloudflare Workers static assets, auto-deploy on push to `main`

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on `http://localhost:3000` |
| `npm run build` | `tsc --noEmit` (via `prebuild`) then the Vite production build to `dist/` |
| `npm run typecheck` | `tsc --noEmit` only |
| `npm run preview` | Serve the production build locally |
| `npx supabase db push` | Apply `supabase/migrations/` to the linked project |
| `npx supabase functions deploy notify` | Deploy the `notify` Edge Function |

There is **no test runner or linter yet** (tracked in issue #29). The build's
type-check is the only automated gate — Cloudflare runs `npm run build` too,
so a type error fails the real deploy.

## Layout

```
App.tsx                 session + the signed-in user's own data; routes
components/              one file per screen (Dashboard, TasksView, RewardsView,
                        AdminPanel, AdminHistory, Auth, UpdatePassword, TaskSubmissionModal)
services/               supabaseClient.ts, image.ts (proof-photo compression),
                        authCallback.ts (magic/recovery redirect handling)
types.ts                the shared domain types
constants.tsx           static data only (zen quotes); everything else is in Postgres
supabase/migrations/    schema, RLS policies, RPC functions — timestamp-prefixed, append-only
supabase/functions/     the `notify` Edge Function (Deno; excluded from the app type-check)
Docs/                   production-migration-plan.md (canonical design record), email-setup.md
wiki/                   Markdown docs, also published to the GitHub Wiki tab
CHANGELOG.md            every landed change, newest last
```

## Conventions

- **Commits:** Conventional Commits — `feat(scope): …`, `fix(nav): …`,
  `docs(wiki): …`, `refactor(submissions): …`, `build(deps): …`.
- **Branches:** `feature/<slug>` or `<issue#>-<slug>` (e.g. `13-nav-bar-active-section`).
- **PRs:** one issue per PR where practical; body starts with `Closes #<issue>`.
- **Points and roles** are only ever mutated through the `security definer`
  RPC functions (`approve_submission`, `submit_task`, `request_reward`,
  `approve_reward_claim`, `send_reward`, `adjust_points`, `set_user_role`).
  Never write `profiles.points` / `profiles.role` from the client, and never
  add a client-side path that does.
- **Migrations are append-only.** Add a new timestamped file in
  `supabase/migrations/`; do not edit one that has already been pushed.
- **Row mappers** (`mapSubmission`, `mapClaim`) are currently duplicated across
  `App.tsx`, `AdminPanel.tsx`, `AdminHistory.tsx` — keep them in sync until
  issue #31 consolidates them.
- Match the surrounding file's style; keep comments at the density the
  existing code uses (it explains *why*, not *what*).

## Definition of done — required on every completed item

When you finish a roadmap item, a bug fix, or any change that lands on `main`,
**all of the following must be done in the same PR** — a change is not
"complete" until they are:

1. **Tested and working in development.** Run the change with `npm run dev` and
   exercise the affected screens and flows end to end — confirm they behave as
   intended and produce no new console errors. Don't commit code that hasn't
   been run locally. (Docs-only changes are exempt; say so in the PR.)
2. **Type-check + build.** `npm run build` passes (it runs `tsc --noEmit`
   first, and Cloudflare's deploy runs the same command).
3. **Update `CHANGELOG.md`.** Add an entry under the current top grouping,
   following the existing format (`### Added` / `### Changed` / `### Fixed`
   bullets, grouped by the PR / milestone that lands them). One entry per
   user-visible or structural change, written so a reader who wasn't there
   understands what changed and why. Absolute dates, not "today".
4. **Update the wiki.** If the change affects behaviour, data model, security,
   setup, deployment, or email, update the matching page(s) under `wiki/`
   ([Home](wiki/Home.md), [User Guide](wiki/User-Guide.md),
   [Admin Guide](wiki/Admin-Guide.md), [Architecture](wiki/Architecture.md),
   [Data Model and Security](wiki/Data-Model-and-Security.md),
   [Local Development](wiki/Local-Development.md),
   [Deployment](wiki/Deployment.md),
   [Email Notifications](wiki/Email-Notifications.md),
   [Testing](wiki/Testing.md)). Add a new page and link it from
   `wiki/_Sidebar.md`, `wiki/Home.md`, and `wiki/README.md` if none fits.
   Keep `README.md` in the repo root accurate too when it's affected.
5. **Cross-check the docs.** `Docs/production-migration-plan.md` is the design
   record — note there if the change alters an architectural decision.

If a step genuinely doesn't apply (e.g. a pure refactor with no doc impact),
say so explicitly in the PR description rather than skipping silently.

The wiki is published to the GitHub Wiki tab by copying `wiki/*.md` into the
`lotus-rewards-app.wiki` repo (steps in [`wiki/README.md`](wiki/README.md)) —
editing the files here is the source-of-truth step; the sync is separate.

## Environment

- App build needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (in `.env`
  locally; **Build** variables in the Cloudflare dashboard for deploy).
- `DATABASE_PASS` and the `BREVO_*` / `EMAIL_*` vars are for the Supabase CLI
  only — never shipped to the client. See [`.env.example`](.env.example) and
  [`Docs/email-setup.md`](Docs/email-setup.md).
- The `notify` function's own secrets are set with `supabase secrets set`, not
  in `.env`.
- The Supabase anon key is *meant* to be public. **RLS is the security
  boundary** — when touching a table or RPC, verify the policy still holds
  (two-account boundary check in [`wiki/Testing.md`](wiki/Testing.md)).

## Roadmap

Tracked in GitHub Project **Golden Lotus Roadmap**
(`https://github.com/users/djraj/projects/2`), milestones `v0.1.0` / `v0.2.0`
/ `v0.3.0` / Backlog. Issue #15 introduces semver git tags + release CI; once
that lands, `CHANGELOG.md` headings move from `## [PR #n]` to `## [X.Y.Z]` and
the "current top grouping" in the Definition of Done above means the unreleased
section at the top.
