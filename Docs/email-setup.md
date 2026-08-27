# Email setup (Brevo)

Golden Lotus sends two kinds of mail:

| Kind | Sent by | Trigger |
| --- | --- | --- |
| **Magic sign-in link** | Supabase Auth → Brevo **SMTP** | `signInWithOtp` on the login screen |
| **Sign-up confirmation** | Supabase Auth → Brevo **SMTP** | `signUp` (email confirmation is required) |
| **Password reset** | Supabase Auth → Brevo **SMTP** | "Forgot password?" on the login screen |
| **Task started** | `notify` Edge Function → Brevo **API** | new draft submission |
| **Task submitted** | `notify` Edge Function → Brevo **API** | draft → pending |
| **Redeem successful** | `notify` Edge Function → Brevo **API** | reward request → approved |
| **Reward sent (by admin)** | `notify` Edge Function → Brevo **API** | admin `send_reward` |

There is **no Resend** anywhere in this project. If you previously set Resend as
the custom SMTP provider on the hosted Supabase project, clear it under
**Authentication → Emails → SMTP Settings** before doing the steps below.

---

## 1. Brevo account

1. Create a free account at <https://www.brevo.com> (free tier: 300 emails/day).
2. **Verify a sender address.** Settings → **Senders, Domains & Dedicated IPs** →
   **Senders** → *Add a sender*. Use an address you control (e.g. your Gmail).
   Brevo emails you a confirmation link — click it. This address is what
   recipients see in the `From:` field. No domain purchase needed.
   - Deliverability is fine for low volume. If mail lands in spam later, add the
     SPF/DKIM records Brevo shows for whatever domain you *do* eventually own.
3. Get the two credentials (they are different things):
   - **SMTP key** — Brevo left nav → **SMTP & API** → **SMTP** tab. You'll see
     `Login` (your Brevo account email) and a generated `Master password` /
     SMTP key. Used by Supabase Auth.
   - **API key** — **SMTP & API** → **API Keys** tab → *Generate a new API key*.
     Used by the `notify` Edge Function.

---

## 2. Supabase Auth SMTP (magic link, confirmation, password reset)

### Local dev

Put these in a root `.env` (already git-ignored). `supabase start` reads them
for the `env(...)` placeholders in `supabase/config.toml`:

```text
BREVO_SMTP_USER=your-brevo-account@email.com
BREVO_SMTP_KEY=xkeysib-...your-smtp-key...
EMAIL_SENDER_ADDRESS=your-verified-sender@email.com
```

`supabase/config.toml` is already wired: `[auth.email.smtp]` points at
`smtp-relay.brevo.com:587`, confirmations are on, and the three templates in
`supabase/templates/` are referenced.

### Hosted project

Either run `supabase config push` (pushes the `[auth]` block from
`config.toml`), **or** set it by hand in the dashboard:

- **Authentication → Emails → SMTP Settings**
  - Host `smtp-relay.brevo.com`, Port `587`
  - Username = your Brevo account email
  - Password = the Brevo **SMTP key**
  - Sender email = your verified sender, Sender name = `Golden Lotus Rewards`
- **Authentication → URL Configuration** → add your deployed origin to
  **Redirect URLs** and set **Site URL**.
- **Authentication → Emails → Templates** → paste the contents of
  `supabase/templates/{magic_link,confirmation,recovery}.html` into the
  *Magic Link*, *Confirm signup*, and *Reset password* templates.
- **Authentication → Providers → Email** → enable *Confirm email*.

---

## 3. The `notify` Edge Function (the four in-app emails)

### Deploy

```bash
supabase functions deploy notify
```

### Secrets

Pick a long random string for `WEBHOOK_SECRET` (e.g. `openssl rand -hex 32`).

```bash
supabase secrets set \
  WEBHOOK_SECRET='<random-string>' \
  BREVO_API_KEY='xkeysib-...your-API-key...' \
  EMAIL_SENDER_ADDRESS='your-verified-sender@email.com' \
  EMAIL_SENDER_NAME='Golden Lotus Rewards' \
  APP_URL='https://your-deployed-app.example'
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.

For local testing, the same keys go in `supabase/functions/.env` and you run
`supabase functions serve notify --env-file supabase/functions/.env`.

### Point the database at the function

The `20260831000000_email_notifications.sql` migration created triggers that
call a URL stored in `private.email_config`. After `supabase db push`, run this
once in the SQL editor with the **same** secret you gave the function:

```sql
insert into private.email_config (id, function_url, webhook_secret)
values (
  1,
  'https://obwekimgjwkafgtccdre.supabase.co/functions/v1/notify',
  '<the-same-random-string>'
)
on conflict (id) do update
  set function_url  = excluded.function_url,
      webhook_secret = excluded.webhook_secret;
```

Until this row exists the triggers are silent no-ops, so the app keeps working
with email switched off.

---

## 4. Smoke test

1. **Magic link** — login screen → enter email → *Send Magic Link* → mail arrives.
2. **Sign up** — create an account → confirmation mail arrives.
3. **Password reset** — login screen → *Forgot password?* → mail arrives → link
   opens the "Choose a new password" screen.
4. **Task started** — start any task → "Task started" mail.
5. **Task submitted** — add a photo and submit → "Task submitted" mail.
6. **Redeem successful** — request a reward as a user, approve it as an admin →
   the user gets "Redeem successful".
7. **Reward sent** — as an admin, *Send reward* to a user → that user gets
   "Reward sent".

Function logs: `supabase functions logs notify` (or the dashboard). Brevo's
**Transactional → Logs** shows every API/SMTP send and its delivery state.
