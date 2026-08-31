# Local Development

## Prerequisites

- Node.js 22+
- A Supabase project (free tier is fine)
- A [Brevo](https://www.brevo.com) account if you want to exercise email locally

## Setup

```bash
npm install
```

Create `.env` in the project root (see
[`.env.example`](https://github.com/djraj/lotus-rewards-app/blob/main/.env.example)):

```text
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-project-anon-key>
DATABASE_PASS=<your-project-db-password>

# Brevo SMTP for auth email — see Email Notifications
BREVO_SMTP_USER=<your-brevo-account-email>
BREVO_SMTP_KEY=<your-brevo-smtp-key>
EMAIL_SENDER_ADDRESS=<a-verified-brevo-sender-address>
```

`VITE_*` are read by the app at build time. The rest are only used by the
Supabase CLI and are never shipped to the client.

## Push the schema

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

This creates the tables, RLS policies, the `proof-photos` storage bucket, and
the RPC functions ([Data Model and Security](Data-Model-and-Security.md)).

## Email (optional locally)

```bash
npx supabase functions deploy notify
npx supabase secrets set WEBHOOK_SECRET=... BREVO_API_KEY=... \
  EMAIL_SENDER_ADDRESS=... EMAIL_SENDER_NAME='GLHC Rewards' APP_URL=...
```

Then insert the `private.email_config` row — full walkthrough in
[Email Notifications](Email-Notifications.md). Until that row exists the app
runs fine with email switched off.

## Run

```bash
npm run dev
```

Opens at `http://localhost:3000`.

Make yourself an admin once you've signed up:

```sql
update public.profiles set role = 'admin' where id = '<user-id>';
```

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type‑check (`tsc --noEmit`) then production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | `tsc --noEmit` only |
| `npm run predeploy` | Alias for `npm run build` |

## Type‑checking is enforced on every build

esbuild (what Vite uses) does not type‑check, so `vite build` alone can
"succeed" with a broken type. The `prebuild` script runs `tsc --noEmit` first
and fails the whole command otherwise — and Cloudflare's build runs
`npm run build` too, so a real type error fails the actual deploy.
