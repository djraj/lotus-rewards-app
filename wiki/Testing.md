# Testing

## Beta field guide

A full tester-facing guide — onboarding, a 7‑day plan, a bug‑report template
with severities, and ~90 numbered test cases across the member and admin
flows — is maintained as a shareable page:

**https://claude.ai/code/artifact/51e2d2df-4774-414d-9b1f-d1ea893cb43c**

Bugs go to
[GitHub Issues](https://github.com/djraj/lotus-rewards-app/issues).

## Manual RLS / RPC boundary check

The architecture's real failure mode is a misconfigured policy, not an
"attack". With two real accounts — a plain `user` and an `admin` — confirm all
of the following are **denied**:

1. Calling `approve_submission` / `approve_reward_claim` / `adjust_points` /
   `set_user_role` while signed in as the plain user.
2. Fetching another user's `proof-photos/<other-user-id>/` folder via the
   Storage API.
3. `update public.profiles set points = ...` from the browser console using
   the signed‑in user's session.
4. A plain user reaching `/#/admin` or `/#/admin/history` (should show
   *Access Denied*, load no admin data).

If all four fail as expected, RLS is doing its job. This 15‑minute check
targets the risk that matters for this stack more precisely than a generic
pentest would. Full rationale:
[`Docs/production-migration-plan.md`](https://github.com/djraj/lotus-rewards-app/blob/main/Docs/production-migration-plan.md)
§9.

## Automated tooling (free)

| Area | Tool |
| --- | --- |
| Dependency CVEs | GitHub Dependabot + `npm audit` |
| Supabase misconfig | Supabase **Security Advisor** (dashboard) — RLS off, weak policies |
| Secrets in git | GitHub secret scanning |
| HTTP headers | securityheaders.com / Mozilla Observatory against the live URL |
| Diff review | the repo's `/code-review` skill, `security-review` mode, on the PR |

## Type safety

`npm run build` type‑checks before building and the Cloudflare deploy runs the
same command, so a type error fails the deploy. Run `npm run typecheck` before
pushing.
