# Golden Lotus Rewards

A community rewards web app. Members earn **Lotus Points** by completing
real‑world tasks and submitting a photo as proof; admins review each
submission and award the points; members spend points in a rewards
marketplace on sessions, products, workshops, and review classes.

- **Live app:** https://lotus-rewards-app.jariarud.workers.dev/
- **Version:** 1.0

## How it works

1. A member **starts a task** → an *ongoing* private draft is created.
2. They add a **proof photo** (required) and an optional note, then **submit for review**.
3. An **admin approves or rejects** it. On approval the task's points are added to the member's balance.
4. The member **redeems a reward** → for a regular member this creates a request an admin must approve; points leave the balance only on approval. An admin redeeming for themselves is deducted immediately.
5. Admins can also **adjust balances by hand**, **gift rewards** (no deduction), and **manage roles**.

Every status change (task started / submitted / approved, redemption
approved, reward gifted) and every auth action (sign‑up, magic link,
password reset) sends the member an email.

## Wiki contents

| Page | For |
| --- | --- |
| [User Guide](User-Guide.md) | Members — signing in, earning points, redeeming rewards |
| [Admin Guide](Admin-Guide.md) | Admins — reviews, points, roles, gifts, history |
| [Architecture](Architecture.md) | How the pieces fit together |
| [Data Model and Security](Data-Model-and-Security.md) | Tables, statuses, RLS, the RPC functions |
| [Local Development](Local-Development.md) | Running it on your machine |
| [Deployment](Deployment.md) | How it ships |
| [Email Notifications](Email-Notifications.md) | Brevo + the `notify` function |
| [Testing](Testing.md) | Beta test guide and the RLS boundary check |
| [Contributing](Contributing.md) | Workflow, definition of done, releases |
| [Changelog](https://github.com/djraj/lotus-rewards-app/blob/main/CHANGELOG.md) | What changed in each release (repo root) |

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React 19 + Vite + TypeScript + Tailwind (CDN), React Router (`HashRouter`) |
| Backend | [Supabase](https://supabase.com) — Postgres, Auth, Row Level Security, Storage, RPC functions |
| Email | [Brevo](https://www.brevo.com) — SMTP for auth mail, `notify` Edge Function for in‑app events |
| Hosting | Cloudflare Workers static assets, auto‑deploy on push to `main` |

The canonical design record is
[`Docs/production-migration-plan.md`](https://github.com/djraj/lotus-rewards-app/blob/main/Docs/production-migration-plan.md)
in the repository.
