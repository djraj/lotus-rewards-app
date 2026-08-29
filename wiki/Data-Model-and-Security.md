# Data Model and Security

Schema lives in
[`supabase/migrations/`](https://github.com/djraj/lotus-rewards-app/tree/main/supabase/migrations).
This page is the summary; the migrations are the source of truth.

## Tables

| Table | Purpose | Key columns |
| --- | --- | --- |
| `profiles` | One per `auth.users` row | `name`, `avatar`, `points` (int, ≥ 0), `role` (`user` \| `admin`) |
| `tasks` | Task catalogue | `title`, `description`, `points`, `icon`, `category` (`Referral` \| `Service` \| `Content` \| `Coordination`), `active` |
| `rewards` | Reward catalogue | `title`, `description`, `cost`, `image`, `available`, `category` (`Products` \| `Sessions` \| `Workshops` \| `Reviews`) |
| `submissions` | A task attempt | `user_id`, `task_id`, `task_title` (snapshot), `proof_note`, `proof_image_path`, `points_awarded`, `status`, `created_at`, `updated_at` |
| `reward_claims` | A redemption or gift | `user_id`, `reward_id`, `reward_title`, `cost`, `status`, `remark`, `granted_by`, `created_at` |
| `points_adjustments` | Audit — manual point changes | `user_id`, `admin_id`, `amount`, `remark` |
| `role_changes` | Audit — role changes | `user_id`, `admin_id`, `old_role`, `new_role` |
| `private.email_config` | Where triggers send email webhooks | `function_url`, `webhook_secret` |

### Statuses

- `submissions.status`: `ongoing` → `pending` → `approved` \| `rejected`.
  An `ongoing` row may have no photo; anything past `ongoing` must have one.
  One `ongoing` row per (user, task) is enforced by a unique index.
- `reward_claims.status`: `pending` → `approved` \| `rejected`. A gift is
  inserted already `approved` with `granted_by` set.

## Row Level Security

RLS is enabled on every table. Highlights:

- **`profiles`** — read your own row (admins read all); update only `name` /
  `avatar` on your own row. `points` and `role` have no client update path.
- **`tasks` / `rewards`** — any signed‑in user can read.
- **`submissions`** — insert your own; read your own (admins read all). Update
  is limited to `proof_note` / `proof_image_path` on your own row while it's
  still `ongoing`.
- **`reward_claims`** — read your own (admins read all). No client insert;
  rows are created only by RPC.
- **Storage `proof-photos`** — you may upload to, read, and delete only a path
  under your own `user_id` folder; admins may read any.
- **Audit tables** — you read rows about yourself, admins read all; no client
  insert.

## RPC functions (the only path to points / roles)

All are `security definer` with a fixed `search_path`. `is_admin()` backs the
role checks.

| Function | Who | What it does |
| --- | --- | --- |
| `submit_task(submission_id)` | owner | `ongoing` → `pending`; requires a photo |
| `approve_submission(submission_id, decision)` | admin | `pending` → `approved`/`rejected`; on approve, `points += points_awarded`; reversing an approval floors points at 0 |
| `request_reward(reward_id)` | any | checks balance; **member** → inserts a `pending` claim; **admin** → deducts and inserts an `approved` claim immediately |
| `approve_reward_claim(claim_id, decision)` | admin | on approve, re‑checks the user's **current** balance then `points -= cost`; on reject, nothing |
| `send_reward(user_id, reward_id, remark)` | admin | inserts an `approved` claim with `granted_by`; **no deduction**; remark required |
| `adjust_points(user_id, amount, remark)` | admin | `points = max(0, points + amount)`; writes `points_adjustments`; remark required |
| `set_user_role(user_id, role)` | admin | changes another user's role (never your own); writes `role_changes` |

## Why this shape

The Supabase **anon key is public** — it ships in the JS bundle. Secrecy is
not the boundary; **RLS plus the `security definer` RPCs are**. The realistic
failure mode is misconfiguration (RLS left off a table, an RPC that forgets to
check the caller), so that's where review effort goes. See
[Testing](Testing.md) for the manual boundary check, and
[`Docs/production-migration-plan.md`](https://github.com/djraj/lotus-rewards-app/blob/main/Docs/production-migration-plan.md)
§4 and §9 for the full rationale.
