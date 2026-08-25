-- Lotus Rewards: initial multi-user schema
-- See Docs/production-migration-plan.md sections 3-4 for the design rationale.

create extension if not exists pgcrypto;

-- ============================================================
-- Tables
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  avatar text,
  points int not null default 0,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  points int not null,
  icon text not null,
  category text not null check (category in ('Mindfulness', 'Growth', 'Physical', 'Community')),
  active boolean not null default true
);

create table public.rewards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  cost int not null,
  image text,
  available boolean not null default true
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  task_id uuid not null references public.tasks(id),
  task_title text not null,
  proof_note text,
  proof_image_path text not null,
  points_awarded int not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table public.reward_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reward_id uuid not null references public.rewards(id),
  cost int not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- New-user provisioning
-- ============================================================

-- Auth signups only create a row in auth.users; this mirrors one into
-- public.profiles so the app always has somewhere to store points/role.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.rewards enable row level security;
alter table public.submissions enable row level security;
alter table public.reward_claims enable row level security;

-- security definer + fixed search_path so this can be used inside other
-- policies without recursing back through profiles' own RLS.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles: read own or admin reads all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- Row-level policy only; column-level grants below stop this from ever
-- reaching points/role, so a user can update name/avatar but nothing else.
create policy "profiles: update own row"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

revoke update on public.profiles from authenticated;
grant update (name, avatar) on public.profiles to authenticated;

create policy "tasks: readable by any signed-in user"
  on public.tasks for select
  to authenticated
  using (true);

create policy "rewards: readable by any signed-in user"
  on public.rewards for select
  to authenticated
  using (true);

create policy "submissions: insert own"
  on public.submissions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "submissions: read own or admin reads all"
  on public.submissions for select
  using (auth.uid() = user_id or public.is_admin());

create policy "reward_claims: read own or admin reads all"
  on public.reward_claims for select
  using (auth.uid() = user_id or public.is_admin());

-- No insert/update policies for submissions.status, reward_claims, or
-- profiles.points/.role: those only change via the security definer
-- functions below, which run as the table owner and bypass RLS/grants.

-- ============================================================
-- Storage: proof photos
-- ============================================================

insert into storage.buckets (id, name, public)
values ('proof-photos', 'proof-photos', false);

create policy "proof-photos: upload to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'proof-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "proof-photos: read own folder or admin reads all"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'proof-photos'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

-- ============================================================
-- RPC functions (points/role mutations only ever happen here)
-- ============================================================

create function public.approve_submission(p_submission_id uuid, p_decision text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_submission public.submissions;
begin
  if not public.is_admin() then
    raise exception 'only admins can review submissions';
  end if;

  if p_decision not in ('approved', 'rejected') then
    raise exception 'invalid decision: %', p_decision;
  end if;

  select * into v_submission from public.submissions where id = p_submission_id for update;
  if not found then
    raise exception 'submission not found';
  end if;

  if v_submission.status = p_decision then
    return; -- no-op, already in that state
  end if;

  if p_decision = 'approved' and v_submission.status != 'approved' then
    update public.profiles set points = points + v_submission.points_awarded where id = v_submission.user_id;
  elsif v_submission.status = 'approved' and p_decision != 'approved' then
    update public.profiles set points = greatest(0, points - v_submission.points_awarded) where id = v_submission.user_id;
  end if;

  update public.submissions set status = p_decision where id = p_submission_id;
end;
$$;

create function public.claim_reward(p_reward_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cost int;
  v_available boolean;
  v_points int;
begin
  select cost, available into v_cost, v_available from public.rewards where id = p_reward_id;
  if not found or not v_available then
    raise exception 'reward not available';
  end if;

  select points into v_points from public.profiles where id = auth.uid() for update;
  if v_points < v_cost then
    raise exception 'insufficient points';
  end if;

  update public.profiles set points = points - v_cost where id = auth.uid();
  insert into public.reward_claims (user_id, reward_id, cost) values (auth.uid(), p_reward_id, v_cost);
end;
$$;

create function public.adjust_points(p_user_id uuid, p_amount int)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'only admins can manually adjust points';
  end if;

  update public.profiles set points = greatest(0, points + p_amount) where id = p_user_id;
end;
$$;

grant execute on function public.approve_submission(uuid, text) to authenticated;
grant execute on function public.claim_reward(uuid) to authenticated;
grant execute on function public.adjust_points(uuid, int) to authenticated;

-- ============================================================
-- Seed data (from the current constants.tsx)
-- ============================================================

insert into public.tasks (title, description, points, icon, category) values
  ('Morning Meditation', 'Complete a 15-minute guided meditation session.', 25, 'fa-om', 'Mindfulness'),
  ('Daily Journaling', 'Write at least 300 words reflecting on your day.', 15, 'fa-book-open', 'Growth'),
  ('Healthy Meal Prep', 'Prepare a balanced meal with fresh ingredients.', 30, 'fa-carrot', 'Physical'),
  ('Volunteer Hour', 'Give back to your local community for one hour.', 100, 'fa-hands-holding-heart', 'Community'),
  ('Nature Walk', 'Spend 30 minutes walking in a park or forest.', 20, 'fa-leaf', 'Physical');

insert into public.rewards (title, description, cost, image) values
  ('Premium Yoga Class', 'A 60-minute private session with an instructor.', 500, 'https://picsum.photos/seed/yoga/400/300'),
  ('Gratitude Journal', 'A beautiful physical linen-bound journal.', 200, 'https://picsum.photos/seed/journal/400/300'),
  ('1-Month App Subscription', 'Access to premium meditation and fitness tools.', 350, 'https://picsum.photos/seed/app/400/300'),
  ('Plant a Tree', 'We will plant a tree in your name in a reforestation area.', 150, 'https://picsum.photos/seed/tree/400/300');
