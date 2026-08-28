-- ============================================================
-- Admins can change another user's role
-- ============================================================
-- profiles.role is otherwise unreachable from the client (RLS + the column
-- grant only exposes name/avatar). This is the one path to it, the same way
-- points only ever move through adjust_points.

-- Audit trail for role changes.
create table public.role_changes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  admin_id uuid not null references public.profiles(id),
  old_role text not null,
  new_role text not null,
  created_at timestamptz not null default now()
);

alter table public.role_changes enable row level security;

create policy "role_changes: admin reads all"
  on public.role_changes for select
  using (public.is_admin());

grant select on public.role_changes to authenticated;
-- No insert policy/grant: rows are only ever written by set_user_role below,
-- which runs as security definer and bypasses this.

create function public.set_user_role(p_user_id uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_role text;
begin
  if not public.is_admin() then
    raise exception 'only admins can change roles';
  end if;

  -- Keep in step with the profiles.role check constraint.
  if p_role not in ('user', 'admin') then
    raise exception 'invalid role: %', p_role;
  end if;

  -- An admin can't demote (or lock in) themselves - another admin must do it.
  if p_user_id = auth.uid() then
    raise exception 'you cannot change your own role';
  end if;

  select role into v_old_role from public.profiles where id = p_user_id for update;
  if not found then
    raise exception 'user not found';
  end if;

  if v_old_role = p_role then
    return; -- already that role, no-op
  end if;

  update public.profiles set role = p_role where id = p_user_id;

  insert into public.role_changes (user_id, admin_id, old_role, new_role)
  values (p_user_id, auth.uid(), v_old_role, p_role);
end;
$$;

grant execute on function public.set_user_role(uuid, text) to authenticated;
