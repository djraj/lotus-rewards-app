-- ============================================================
-- Contact form: visitor messages, readable by admins only
-- ============================================================

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 1 and 2000),
  -- Set when the sender happened to be signed in; the form works signed out.
  user_id uuid references public.profiles(id) on delete set null,
  status text not null default 'open' check (status in ('open', 'handled')),
  handled_at timestamptz,
  handled_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index contact_messages_open_idx on public.contact_messages (created_at desc) where status = 'open';
create index contact_messages_email_recent_idx on public.contact_messages (lower(email), created_at desc);

alter table public.contact_messages enable row level security;

-- Visitors never read or write the table directly: inserts go through
-- submit_contact_message (validated + throttled), and only admins can read.
create policy "contact_messages: admins read"
  on public.contact_messages for select
  using (public.is_admin());

grant select on public.contact_messages to authenticated;

create function public.submit_contact_message(p_name text, p_email text, p_message text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := btrim(coalesce(p_name, ''));
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_message text := btrim(coalesce(p_message, ''));
begin
  if v_name = '' or v_email = '' or v_message = '' then
    raise exception 'please fill in your name, email and message';
  end if;
  if char_length(v_name) > 100 then
    raise exception 'name is too long (100 characters max)';
  end if;
  if char_length(v_message) > 2000 then
    raise exception 'message is too long (2000 characters max)';
  end if;
  if char_length(v_email) > 254 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'please enter a valid email address';
  end if;

  -- The RPC is callable with the public anon key, so throttle it: a few
  -- messages per sender per hour, and a ceiling on total volume so a flood
  -- can't fill the inbox.
  if (select count(*) from public.contact_messages
      where lower(email) = v_email and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'you have sent several messages recently - please wait a little before sending another';
  end if;
  if (select count(*) from public.contact_messages
      where created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'we are receiving a lot of messages right now - please try again shortly';
  end if;

  insert into public.contact_messages (name, email, message, user_id)
  values (v_name, v_email, v_message, auth.uid());
end;
$$;

revoke all on function public.submit_contact_message(text, text, text) from public;
grant execute on function public.submit_contact_message(text, text, text) to anon, authenticated;

create function public.set_contact_message_status(p_message_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'only admins can update contact messages';
  end if;
  if p_status not in ('open', 'handled') then
    raise exception 'invalid status: %', p_status;
  end if;

  update public.contact_messages
  set status = p_status,
      handled_at = case when p_status = 'handled' then now() else null end,
      handled_by = case when p_status = 'handled' then auth.uid() else null end
  where id = p_message_id;

  if not found then
    raise exception 'message not found';
  end if;
end;
$$;

-- Supabase's default privileges can grant new functions to anon directly,
-- so revoking from public alone isn't enough.
revoke all on function public.set_contact_message_status(uuid, text) from public, anon;
grant execute on function public.set_contact_message_status(uuid, text) to authenticated;
