# Email Notifications

GLHC Rewards sends mail through [Brevo](https://www.brevo.com) (free tier:
300 emails/day). The full setup walkthrough is
[`Docs/email-setup.md`](https://github.com/djraj/lotus-rewards-app/blob/main/Docs/email-setup.md);
this is the map.

## What gets sent

| Mail | Path | Trigger |
| --- | --- | --- |
| Magic sign‑in link | Supabase Auth → Brevo **SMTP** | `signInWithOtp` on the login screen |
| Sign‑up confirmation | Supabase Auth → Brevo **SMTP** | `signUp` (confirmation is required) |
| Password reset | Supabase Auth → Brevo **SMTP** | "Forgot password?" |
| Task started | `notify` fn → Brevo **API** | new `ongoing` submission |
| Task submitted | `notify` fn → Brevo **API** | `ongoing` → `pending` |
| Task approved | `notify` fn → Brevo **API** | submission → `approved` |
| Redeem successful | `notify` fn → Brevo **API** | reward request → `approved` |
| Reward sent | `notify` fn → Brevo **API** | admin `send_reward` |

There is no Resend in this project.

## Two credentials, different jobs

- **SMTP key** (Brevo → SMTP & API → SMTP tab) — used by Supabase Auth for the
  three auth emails.
- **API key** (Brevo → SMTP & API → API Keys) — used by the `notify` Edge
  Function for the five in‑app emails.

## Supabase Auth SMTP

Set under **Authentication → Emails → SMTP Settings**: host
`smtp-relay.brevo.com`, port `587`, username = Brevo account email, password =
Brevo **SMTP key**, sender = your verified Brevo sender. Paste
`supabase/templates/{magic_link,confirmation,recovery}.html` into the matching
templates, add your deployed origin to **URL Configuration → Redirect URLs**,
(the templates lead with `<img src="{{ .SiteURL }}/logo-email.png">`, so the
origin must serve that asset — it ships in `public/`),
and enable **Confirm email**. Locally, the `BREVO_SMTP_*` / `EMAIL_SENDER_*`
`.env` values feed `supabase/config.toml`.

## The `notify` Edge Function

```bash
supabase functions deploy notify
supabase secrets set \
  WEBHOOK_SECRET='<random-string>' \
  BREVO_API_KEY='<your-API-key>' \
  EMAIL_SENDER_ADDRESS='<verified-sender>' \
  EMAIL_SENDER_NAME='GLHC Rewards' \
  APP_URL='https://lotus-rewards-app.jariarud.workers.dev'
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically. The
function authenticates the trigger by an `x-webhook-secret` header, figures
out which lifecycle event a row change is, looks up the recipient with the
service‑role key, and sends via the Brevo API.

## Wire the database to the function

The `20260831000000_email_notifications.sql` migration adds `after
insert/update` triggers that read a URL + secret from `private.email_config`.
Run once in the SQL editor with the **same** secret you gave the function:

```sql
insert into private.email_config (id, function_url, webhook_secret)
values (1, 'https://<project-ref>.supabase.co/functions/v1/notify', '<same-random-string>')
on conflict (id) do update
  set function_url = excluded.function_url,
      webhook_secret = excluded.webhook_secret;
```

**Until this row exists the triggers are silent no‑ops** — the app works with
email off.

## Debugging

- `supabase functions logs notify` (or the dashboard) for function errors
- Brevo **Transactional → Logs** for every SMTP/API send and its delivery state
