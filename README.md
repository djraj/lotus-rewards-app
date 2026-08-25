# Lotus Rewards

A zen-themed rewards app: users earn Lotus Points by completing mindful tasks (submitted with a photo as proof), redeem points for rewards, and admins review submissions and manage balances.

- **Frontend**: React 19 + Vite + TypeScript + Tailwind (via CDN), React Router (`HashRouter`)
- **Backend**: [Supabase](https://supabase.com) — Postgres, Auth (email/password + magic link), Row Level Security, Storage (proof photos), RPC functions for point mutations
- **Hosting**: Cloudflare Workers (static assets), auto-deploys on push to `main` via Workers Builds

See [`Docs/production-migration-plan.md`](Docs/production-migration-plan.md) for the full architecture, schema, and security model.

## Run locally

**Prerequisites:** Node.js 22+, a Supabase project.

1. Install dependencies:
   ```
   npm install
   ```
2. Create `.env` in the project root with:
   ```
   VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-project-anon-key>
   DATABASE_PASS=<your-project-db-password>
   ```
   `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are used by the app at build time. `DATABASE_PASS` is only used by the Supabase CLI (below), never shipped to the client.
3. Link the Supabase CLI to your project and push the schema:
   ```
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
   This creates the `profiles`/`tasks`/`rewards`/`submissions`/`reward_claims` tables, RLS policies, the `proof-photos` storage bucket, and the RPC functions the app calls (`approve_submission`, `claim_reward`, `adjust_points`).
4. Run the app:
   ```
   npm run dev
   ```
   Opens at `http://localhost:3000`.

New signups default to `role: 'user'`. To make an account an admin, run in the Supabase SQL editor:
```sql
update public.profiles set role = 'admin' where id = '<user-id>';
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run predeploy` | Type-checks and builds — run this before pushing/deploying (see below) |

## Before deploying

`npm run build` alone does **not** catch TypeScript errors — Vite transpiles with esbuild, which doesn't type-check, so a broken type can still produce a "successful" build. Run the full check first:

```
npm run predeploy
```

This runs `tsc --noEmit` followed by `vite build`, and exits non-zero if either step fails.

## Deployment

Deploys are handled by Cloudflare Workers Builds: pushing to `main` triggers `npm run build` then `npx wrangler versions upload`, using `wrangler.toml` to serve `dist/` as static assets. `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` must be set as **build** variables in the Cloudflare dashboard (Worker → Settings → Build → Variables and secrets — distinct from "Runtime variables and secrets", which doesn't apply to a static-assets-only Worker).
