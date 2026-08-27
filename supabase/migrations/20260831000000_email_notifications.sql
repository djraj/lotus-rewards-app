-- ============================================================
-- Transactional email notifications
-- ============================================================
-- Row changes on `submissions` / `reward_claims` call the `notify` Edge
-- Function over HTTP (via pg_net). The function decides what to send and
-- delivers it through Brevo. Config (the function URL + a shared secret)
-- lives in one row of private.email_config so it never ends up in git.
--
-- After `db push`, run ONCE against your project (SQL editor), filling in
-- your project ref and a secret you also give the function:
--
--   insert into private.email_config (id, function_url, webhook_secret)
--   values (
--     1,
--     'https://<project-ref>.supabase.co/functions/v1/notify',
--     '<a-long-random-string>'
--   )
--   on conflict (id) do update
--     set function_url = excluded.function_url,
--         webhook_secret = excluded.webhook_secret;
--
-- ...and set the matching secret on the function:
--   supabase secrets set WEBHOOK_SECRET='<the-same-random-string>'

create extension if not exists pg_net with schema extensions;

create schema if not exists private;

create table if not exists private.email_config (
  id int primary key default 1 check (id = 1),
  function_url text not null,
  webhook_secret text not null
);

-- private schema is not API-exposed; make doubly sure the client roles can't touch it.
revoke all on schema private from anon, authenticated;
revoke all on private.email_config from anon, authenticated;

-- Posts the row change to the Edge Function. Never blocks the write: pg_net
-- queues the request and returns immediately, and a missing config row is a
-- silent no-op so the app keeps working before email is wired up.
create or replace function private.notify_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_url text;
  v_secret text;
begin
  select function_url, webhook_secret
    into v_url, v_secret
    from private.email_config
   where id = 1;

  if v_url is null then
    return coalesce(new, old);
  end if;

  perform net.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', v_secret
    ),
    body := jsonb_build_object(
      'type', tg_op,
      'table', tg_table_name,
      'record', case when new is not null then to_jsonb(new) else null end,
      'old_record', case when old is not null then to_jsonb(old) else null end
    ),
    timeout_milliseconds := 5000
  );

  return coalesce(new, old);
end;
$$;

-- Task started: a fresh draft submission.
create trigger submissions_email_on_start
  after insert on public.submissions
  for each row execute function private.notify_email();

-- Task submitted: draft -> pending.
create trigger submissions_email_on_submit
  after update on public.submissions
  for each row
  when (old.status is distinct from new.status and new.status = 'pending')
  execute function private.notify_email();

-- Reward sent by an admin: inserted already-approved with a granter.
create trigger reward_claims_email_on_gift
  after insert on public.reward_claims
  for each row
  when (new.status = 'approved' and new.granted_by is not null)
  execute function private.notify_email();

-- Redeem successful: a user's pending request -> approved.
create trigger reward_claims_email_on_approve
  after update on public.reward_claims
  for each row
  when (old.status is distinct from new.status and new.status = 'approved')
  execute function private.notify_email();
