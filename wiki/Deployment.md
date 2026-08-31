# Deployment

`main` is the integration branch. **An annotated `vX.Y.Z` tag is the "ship it"
action** — merging to `main` no longer promotes to production.

## Frontend — the release flow

### On every PR and push to `main` — `.github/workflows/ci.yml`

`npm ci` then `npm run build` (`tsc --noEmit` via `prebuild`, then the Vite
build). This is the gate; a type error fails it.

### On `main` — Cloudflare Workers Builds (preview only)

Cloudflare still builds each push to `main`, but as a **non-promoted preview**
(`npx wrangler versions upload`) — a versioned URL, not the live site. Set this
in the Cloudflare dashboard:

> Worker → Settings → Build → **Branch control** — mark `main` a
> *non-production* branch (or set its deploy command to
> `npx wrangler versions upload`).

`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` stay as **Build** variables here
(Worker → Settings → Build → **Variables and secrets**; distinct from "Runtime"
ones, which don't apply to a static-assets Worker).

### On a `vX.Y.Z` tag — `.github/workflows/release.yml`

```bash
# bump the version in its own PR first
npm version <x.y.z> --no-git-tag-version   # edits package.json only
# …commit + merge that PR, then:
git tag -a v<x.y.z> -m "v<x.y.z>" && git push origin v<x.y.z>
```

The workflow then:

1. **Verifies** the tag equals `package.json` `version` (fails the release if not).
2. **Verifies** `CHANGELOG.md` has a `## [x.y.z]` section (used as the release notes).
3. `npm run build` with the production Supabase env.
4. `npx wrangler deploy` — promotes the build to the live Worker.
5. `gh release create` — publishes the GitHub Release.

**Required GitHub → Settings → Secrets and variables → Actions:**

| Secret | Why |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | `wrangler deploy` auth — token with *Workers Scripts: Edit* |
| `CLOUDFLARE_ACCOUNT_ID` | target account |
| `VITE_SUPABASE_URL` | baked into the production bundle (the build now runs in Actions, not Cloudflare) |
| `VITE_SUPABASE_ANON_KEY` | same |

`npm run deploy` runs the same `wrangler deploy` locally as a break-glass path.

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
