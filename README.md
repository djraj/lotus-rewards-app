# GLHC Rewards

A community rewards app for Golden Lotus Healing Center: members earn Lotus Points by completing tasks (submitted with a photo as proof), redeem points for sessions/products/workshops/reviews, and admins review submissions and manage balances.

- **Frontend**: React 19 + Vite + TypeScript + Tailwind (via CDN), React Router (`HashRouter`)
- **Backend**: [Supabase](https://supabase.com) — Postgres, Auth (email/password + magic link), Row Level Security, Storage (proof photos), RPC functions for point mutations
- **Email**: [Brevo](https://www.brevo.com) — auth mail (magic link, signup confirmation, password reset) over SMTP; in-app notifications (task started/submitted/approved, redeem approved, reward sent) via the `notify` Edge Function. Setup: [`Docs/email-setup.md`](Docs/email-setup.md)
- **Hosting**: Cloudflare Workers (static assets). `main` builds a non-promoted preview; an annotated `vX.Y.Z` tag runs the release workflow that promotes to production and cuts a GitHub Release

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
| `npm run deploy` | `wrangler deploy` — promote the current `dist/` to the live Worker (break-glass; normally the release workflow does this) |

## Type-checking is enforced on every build

Vite transpiles via esbuild, which doesn't type-check — `vite build` alone can still produce a "successful" build with a broken type in it. `npm run build` has a `prebuild` script that runs `tsc --noEmit` first and fails the whole command if it doesn't pass. CI (`.github/workflows/ci.yml`) runs `npm run build` on every PR and push to `main`, so a real type error fails the check, not just a local run someone forgot.

## Versioning & deployment

`main` is the integration branch. **An annotated `vX.Y.Z` tag is the release action** — see [`wiki/Deployment.md`](wiki/Deployment.md) for the full flow.

- **Every PR / push to `main`** → `ci.yml`: `npm ci` + `npm run build`.
- **Push to `main`** → Cloudflare Workers Builds, but as a *non-promoted preview* (`wrangler versions upload`) — not the live site.
- **`vX.Y.Z` tag** → `release.yml`: verify tag == `package.json` version, verify a `## [x.y.z]` `CHANGELOG.md` section exists, build with the prod Supabase env, `wrangler deploy` to promote, then publish a GitHub Release. Needs `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` as Actions secrets.

Cutting a release:

```bash
npm version <x.y.z> --no-git-tag-version   # bump package.json in its own PR
# merge that PR, then:
git tag -a v<x.y.z> -m "v<x.y.z>" && git push origin v<x.y.z>
```

The `notify` Edge Function and the Supabase schema are **not** part of this — deploy schema changes with `npx supabase db push` and function changes with `npx supabase functions deploy notify`.
