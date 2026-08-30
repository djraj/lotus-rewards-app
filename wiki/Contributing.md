# Contributing

How work moves from an idea to `main` in this project.

## Where work is tracked

GitHub Project **[Golden Lotus Roadmap](https://github.com/users/djraj/projects/2)**.

- **Milestones are releases:** `v0.1.0` (self-service & feedback), `v0.2.0`
  (community & engagement), `v0.3.0` (scale & hardening), plus **Backlog** for
  unscheduled items.
- **Issues** are one per feature / fix, each with scope and acceptance
  criteria. Labels: `type:*`, `area:*`, `P1`–`P3`, `effort:*`.
- Two views: **Roadmap** (grouped by milestone, sorted by priority) and
  **Current sprint** (board, filtered to the active milestone).
- Project workflows set an added item to **Todo** and a closed issue to
  **Done** automatically.

## Branch → PR

- Branch from `main`: `feature/<slug>` or `<issue#>-<slug>`
  (e.g. `13-nav-bar-active-section`).
- [Conventional Commits](https://www.conventionalcommits.org/):
  `feat(scope): …`, `fix(nav): …`, `docs(wiki): …`, `refactor(...)`,
  `build(deps): …`.
- One issue per PR where practical. PR body starts with `Closes #<issue>`.
- `npm run build` must pass — it runs `tsc --noEmit` first, and Cloudflare's
  deploy build runs the same command, so a type error fails the deploy.

## Definition of done

A change is not complete until **all of these are in the same PR**:

1. **Tested and working in development** — run it with `npm run dev` and
   exercise the affected screens and flows; no new console errors. Don't commit
   code you haven't run locally. Docs-only changes are exempt (say so in the PR).
2. **Type-check + build** — `npm run build` is green (`tsc --noEmit` runs
   first, and Cloudflare's deploy runs the same command).
3. **[`CHANGELOG.md`](https://github.com/djraj/lotus-rewards-app/blob/main/CHANGELOG.md)**
   — add an entry under the current top grouping, in the existing format
   (`### Added` / `### Changed` / `### Fixed`), one bullet per user-visible or
   structural change, with absolute dates. Write it so someone who wasn't in
   the loop understands what changed and why.
4. **Wiki** — update every `wiki/` page the change touches (behaviour, data
   model, security, setup, deployment, email, testing). If nothing fits, add a
   page and link it from `_Sidebar.md`, `Home.md`, and `README.md`. Keep the
   repo-root `README.md` accurate too.
5. **Design record** — if the change alters an architectural decision, note it
   in [`Docs/production-migration-plan.md`](https://github.com/djraj/lotus-rewards-app/blob/main/Docs/production-migration-plan.md).

If a step honestly doesn't apply (a pure refactor with no doc impact), say so
in the PR description — don't skip it silently.

## Releases

Today: pushing to `main` builds and uploads via Cloudflare Workers Builds; the
schema and `notify` function deploy separately with the Supabase CLI
(see [Deployment](Deployment.md)).

Planned (issue #15): an annotated semver tag `vX.Y.Z` becomes the "ship it"
action, a release workflow verifies + promotes + cuts a GitHub Release, and the
[`CHANGELOG.md`](https://github.com/djraj/lotus-rewards-app/blob/main/CHANGELOG.md)
headings move from `## [PR #n]` to `## [X.Y.Z]`. Until then the changelog stays
grouped by the PR / milestone that landed each change.

The changelog lives at the repo root, not in this wiki — it's reviewed in the
same PR as the code and feeds the GitHub Release notes.

## Publishing the wiki

The files in `wiki/` are the source of truth. Publishing them to the GitHub
**Wiki** tab is a separate copy step — see [`wiki/README.md`](README.md).
