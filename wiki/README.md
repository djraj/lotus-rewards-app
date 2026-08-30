# wiki/

Project documentation, authored as Markdown so it can live with the code and
also be published to the repository's **Wiki** tab (the file names follow the
GitHub Wiki convention — `Home.md`, `_Sidebar.md`, `_Footer.md`, and
hyphenated page names).

Start at [Home.md](Home.md).

| Page | For |
| --- | --- |
| [Home](Home.md) | Overview and index |
| [User Guide](User-Guide.md) | Members |
| [Admin Guide](Admin-Guide.md) | Admins |
| [Architecture](Architecture.md) | How the pieces fit |
| [Data Model and Security](Data-Model-and-Security.md) | Tables, statuses, RLS, RPCs |
| [Local Development](Local-Development.md) | Running it locally |
| [Deployment](Deployment.md) | How it ships |
| [Email Notifications](Email-Notifications.md) | Brevo + the `notify` function |
| [Testing](Testing.md) | Beta guide + RLS boundary check |
| [Contributing](Contributing.md) | Workflow, definition of done, releases |
| [Changelog](https://github.com/djraj/lotus-rewards-app/blob/main/CHANGELOG.md) | What changed in each release (repo root) |

## Publishing to the Wiki tab

Once the Wiki has been initialised (create any page once at
`https://github.com/djraj/lotus-rewards-app/wiki`):

```bash
git clone https://github.com/djraj/lotus-rewards-app.wiki.git
cp wiki/*.md lotus-rewards-app.wiki/
cd lotus-rewards-app.wiki && git add -A && git commit -m "Sync wiki from repo" && git push
```
