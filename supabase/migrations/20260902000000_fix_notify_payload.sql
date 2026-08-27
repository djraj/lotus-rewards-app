-- Fix: the webhook payload dropped `record`/`old_record` whenever the row had
-- any NULL column. For a row value, `NEW IS NOT NULL` is only true when EVERY
-- field is non-null, so a draft submission (null proof_note / proof_image_path)
-- sent `record: null` and the notify function skipped every event.
-- Decide inclusion from TG_OP instead.
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
      'record', case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end,
      'old_record', case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end
    ),
    timeout_milliseconds := 5000
  );

  return coalesce(new, old);
end;
$$;
