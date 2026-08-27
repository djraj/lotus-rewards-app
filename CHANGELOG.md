# Changelog

All notable changes to Golden Lotus Rewards, oldest to newest. Format loosely
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The project has
no version tags yet, so entries are grouped by the pull request / milestone that
landed them on `main`.

## [Unreleased] — Brevo email (branch `feature/brevo-email-notifications`)

### Added
- **Auth email over Brevo SMTP** — `supabase/config.toml` wires
  `[auth.email.smtp]` to `smtp-relay.brevo.com` with credentials read from the
  environment, plus branded templates in `supabase/templates/` for the magic
  link, signup confirmation, and password-reset messages.
- **Password reset flow** — "Forgot password?" on the sign-in screen
  (`resetPasswordForEmail`), a new `UpdatePassword` screen, and handling of the
  `PASSWORD_RECOVERY` auth event in `App.tsx`.
- **Transactional notification emails** via a new `notify` Edge Function that
  calls the Brevo API, driven by Postgres triggers (migrations
  `20260831000000`, `20260901000000`, `20260902000000`):
  - task started (new draft submission)
  - task submitted (draft → pending)
  - task approved by an admin (→ approved)
  - redemption approved (reward claim pending → approved)
  - reward sent by an admin (approved claim with a granter)
- `private.email_config` table holding the function URL + a shared secret, so no
  credentials are committed; the triggers are silent no-ops until it is filled.
- `Docs/email-setup.md` and `.env.example` covering the full Brevo setup.

### Fixed
- Webhook payload dropped `record`/`old_record` when the row had any NULL
  column (`NEW IS NOT NULL` is only true when every field is non-null), so the
  notify function skipped every event fired by a trigger (`20260902000000`).

### Changed
- New signups now require email confirmation (`enable_confirmations = true`).
- Auth email rate limit raised from 2 to 30 per hour.
- `tsconfig.json` excludes `supabase/functions` from the app type-check (Deno).
- `.env.example` is no longer ignored by git.

## [PR #6] Enhancements — 2026-08-26

### Added
- Rebrand from "Lotus" to "Golden Lotus" across the UI.
- Tasks and rewards grouped by category with a live search box.
- Draft-first task flow: starting a task creates an editable draft
  (`submit_task` RPC); drafts can be resumed from the dashboard.
- Reward redemption reworked into an admin-approved request
  (`request_reward` / `approve_reward_claim` RPCs) with a confirmation step.
- Admins can redeem instantly (skip approval, deduct immediately) and can send
  rewards directly to a user as a gift with a required remark (`send_reward`).
- Admin approval history / audit log page.
- "Require a remark" when an admin adjusts a user's points, with a
  `points_adjustments` audit table.
- Reward categories column so the Rewards view can group like Tasks.

### Changed
- Reworked the dashboard "Achieve Your Potential" section.
- Rewards UI reflects instant admin redemption.

### Removed
- "Pending Reviews" stat from the user dashboard.

## [PR #5] PH / THM catalog — 2026-08-26

### Changed
- Replaced the placeholder task/reward catalog with the real Pranic Healing /
  THM task and reward list.

## [PR #4] Gate the build on type-checking — 2026-08-26

### Fixed
- Cloudflare Workers build now actually fails on a TypeScript error
  (`prebuild` → `tsc --noEmit` before `vite build`).

## [PR #3] README and predeploy check — 2026-08-26

### Added
- `predeploy` script that type-checks before building.

### Changed
- Rewrote the README to match the actual app.

## [PR #2] Code-review fixes — 2026-08-26

### Fixed
- Task modal no longer gets stuck on the success screen after the first
  submission.
- Admin approve/reject and points-adjust errors surface instead of failing
  silently.

## [PR #1] Supabase migration — 2026-08-26

### Added
- Initial Supabase schema: `profiles`, `tasks`, `rewards`, `submissions`,
  `reward_claims`; Row Level Security policies; `proof-photos` storage bucket;
  RPC functions for all point mutations (`approve_submission`, `claim_reward`,
  `adjust_points`).
- Supabase JS client and Vite env typing.
- Email/password + magic-link sign-in screen.
- App wired to Supabase for auth, multi-user data, photo-proof upload, and the
  admin RPCs.
- `wrangler.toml` so Cloudflare Workers Builds has an entry point.
- Supabase CLI as a dev dependency.
- `Docs/production-migration-plan.md`.

### Changed
- Swapped `@google/genai` for `@supabase/supabase-js`; removed the Gemini AI
  service and its Vite env passthrough.
- Replaced hardcoded seed data with a static quotes list; updated types for
  photo proof.

### Fixed
- App never mounted — `index.html` was missing the Vite entry script.
- `.env` files are no longer tracked by git.

## Project bootstrap — 2025-12-23

### Added
- Initial commit; Vite + React + TypeScript project scaffold ("Lotus Rewards
  App").
