# Deployment

## Frontend — Cloudflare Workers Builds

Pushing to `main` triggers a build that runs:

1. `npm run build` — `tsc --noEmit` then the Vite production build to `dist/`
2. `npx wrangler versions upload` — uploads `dist/` as static assets, served
   per [`wrangler.toml`](https://github.com/djraj/lotus-rewards-app/blob/main/wrangler.toml)

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set as **Build**
variables in the Cloudflare dashboard:

> Worker → Settings → Build → **Variables and secrets**

These are distinct from "Runtime variables and secrets", which don't apply to
a static‑assets‑only Worker.

A genuine type error fails this build (the `prebuild` type‑check), so it
fails the deploy, not just a local check.

## Backend — Supabase (separate, manual)

The schema and the Edge Function are **not** part of the Cloudflare build.

```bash
# schema changes
npx supabase db push

# notify function changes
npx supabase functions deploy notify
```

Auth email templates, SMTP settings, redirect URLs, and the
`private.email_config` row are configured once in the Supabase dashboard —
see [Email Notifications](Email-Notifications.md).

## Notes

- Hosting is a free `*.workers.dev` subdomain; no custom domain.
- Supabase pauses a free project after ~1 week with no database activity;
  a paused project restores in one click. A lightweight cron query keeps it
  awake if needed.
