-- ============================================================
-- Reward categories (so RewardsView can group like TasksView does)
-- ============================================================

alter table public.rewards add column category text;

update public.rewards set category = 'Products'
  where title in ('Alcohol Spray', 'MTH Audio', 'Om Audio', 'GLS or EoG Book');
update public.rewards set category = 'Sessions'
  where title in ('Full Body Chakra Scan (30 mins)', '1:1 PH Session (30 mins)', '1:1 PH Session (60 mins)');
update public.rewards set category = 'Workshops'
  where title in ('BPH (Level 1) Workshop', 'APH (Level 2) Workshop', 'PSY (Level 3) Workshop', 'AOHS Workshop', 'Arhatic Yoga Workshop');
update public.rewards set category = 'Reviews'
  where title in ('BPH Review', 'APH Review', 'PSY Review', 'AOHS Review', 'AYP Review');

alter table public.rewards alter column category set not null;
alter table public.rewards add constraint rewards_category_check
  check (category in ('Products', 'Sessions', 'Workshops', 'Reviews'));

-- ============================================================
-- Points-adjustment audit trail (admin must give a remark)
-- ============================================================

create table public.points_adjustments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  admin_id uuid not null references public.profiles(id),
  amount int not null,
  remark text not null,
  created_at timestamptz not null default now()
);

alter table public.points_adjustments enable row level security;

create policy "points_adjustments: user reads own, admin reads all"
  on public.points_adjustments for select
  using (auth.uid() = user_id or public.is_admin());

grant select on public.points_adjustments to authenticated;
-- No insert policy/grant for authenticated: rows are only ever written by
-- adjust_points below, which runs as security definer and bypasses this.

drop function public.adjust_points(uuid, int);

create function public.adjust_points(p_user_id uuid, p_amount int, p_remark text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'only admins can manually adjust points';
  end if;

  if p_remark is null or btrim(p_remark) = '' then
    raise exception 'a remark is required when adjusting points';
  end if;

  update public.profiles set points = greatest(0, points + p_amount) where id = p_user_id;

  insert into public.points_adjustments (user_id, admin_id, amount, remark)
  values (p_user_id, auth.uid(), p_amount, p_remark);
end;
$$;

grant execute on function public.adjust_points(uuid, int, text) to authenticated;
