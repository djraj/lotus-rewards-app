# GLHC Rewards

A community rewards app for Golden Lotus Healing Center: members earn Lotus Points by completing tasks (submitted with a photo as proof), redeem points for sessions/products/workshops/reviews, and admins review submissions and manage balances.

- **Frontend**: React 19 + Vite + TypeScript + Tailwind (via CDN), React Router (`HashRouter`)
- **Backend**: [Supabase](https://supabase.com) — Postgres, Auth (email/password + magic link), Row Level Security, Storage (proof photos), RPC functions for point mutations
- **Email**: [Brevo](https://www.brevo.com) — auth mail (magic link, signup confirmation, password reset) over SMTP; in-app notifications (task started/submitted/approved, redeem approved, reward sent) via the `notify` Edge Function. Setup: [`Docs/email-setup.md`](Docs/email-setup.md)
- **Hosting**: Cloudflare Workers (static assets), auto-deploys on push to `main` via Workers Builds

See [`Docs/production-migration-plan.md`](Docs/production-migration-plan.md) for the full architecture, schema, and security model.

## Run locally

**Prerequisites:** Node.js 22+, a Supabase project.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` in the project root with:

   ```text
   VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-project-anon-key>
   DATABASE_PASS=<your-project-db-password>

   # Brevo SMTP for auth email — see Docs/email-setup.md
   BREVO_SMTP_USER=<your-brevo-account-email>
   BREVO_SMTP_KEY=<your-brevo-smtp-key>
   EMAIL_SENDER_ADDRESS=<a-verified-brevo-sender-address>
   ```

   `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are used by the app at build time. `DATABASE_PASS` and the `BREVO_*`/`EMAIL_*` vars are only used by the Supabase CLI (below), never shipped to the client. See [`.env.example`](.env.example) and [`Docs/email-setup.md`](Docs/email-setup.md).

3. Link the Supabase CLI to your project and push the schema:

   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

   This creates the `profiles`/`tasks`/`rewards`/`submissions`/`reward_claims` tables, RLS policies, the `proof-photos` storage bucket, and the RPC functions the app calls (`approve_submission`, `claim_reward`, `adjust_points`).

4. Set up email — deploy the notification function and configure Brevo. Full
   walkthrough in [`Docs/email-setup.md`](Docs/email-setup.md):

   ```bash
   npx supabase functions deploy notify
   npx supabase secrets set WEBHOOK_SECRET=... BREVO_API_KEY=... EMAIL_SENDER_ADDRESS=... EMAIL_SENDER_NAME='GLHC Rewards' APP_URL=...
   # then insert the private.email_config row (see the doc)
   ```

5. Run the app:

   ```bash
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
| `npm run predeploy` | Alias for `npm run build` (kept for an explicit local "check before I push" habit) |

## Type-checking is enforced on every build

Vite transpiles via esbuild, which doesn't type-check — `vite build` alone can still produce a "successful" build with a broken type in it. `npm run build` has a `prebuild` script that runs `tsc --noEmit` first and fails the whole command if it doesn't pass, so this isn't just a local convention: **Cloudflare's Workers Build runs `npm run build` too**, so a real type error now fails the actual deploy, not just a local check someone forgot to run.

## Deployment

Deploys are handled by Cloudflare Workers Builds: pushing to `main` triggers `npm run build` (type-check, then the Vite build) then `npx wrangler versions upload`, using `wrangler.toml` to serve `dist/` as static assets. `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` must be set as **build** variables in the Cloudflare dashboard (Worker → Settings → Build → Variables and secrets — distinct from "Runtime variables and secrets", which doesn't apply to a static-assets-only Worker).

The `notify` Edge Function and the Supabase schema are **not** part of the Cloudflare build — deploy schema changes with `npx supabase db push` and function changes with `npx supabase functions deploy notify`.
