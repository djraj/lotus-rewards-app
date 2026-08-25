-- ============================================================
-- Draft task submissions: start now, edit later, submit when ready
-- ============================================================

alter table public.submissions add column updated_at timestamptz not null default now();

alter table public.submissions alter column proof_image_path drop not null;

alter table public.submissions drop constraint submissions_status_check;
alter table public.submissions add constraint submissions_status_check
  check (status in ('draft', 'pending', 'approved', 'rejected'));

-- A draft can exist with no photo yet; anything past draft must have one.
alter table public.submissions add constraint submissions_photo_required_unless_draft
  check (status = 'draft' or proof_image_path is not null);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger submissions_set_updated_at
  before update on public.submissions
  for each row execute function public.set_updated_at();

-- Owner can edit their own proof note/photo while still a draft. Column
-- grants (not just the row policy) stop status/points_awarded from ever
-- being touched this way - the real transition happens in submit_task.
create policy "submissions: owner edits own draft"
  on public.submissions for update
  using (auth.uid() = user_id and status = 'draft')
  with check (auth.uid() = user_id and status = 'draft');

grant update (proof_note, proof_image_path) on public.submissions to authenticated;

create function public.submit_task(p_submission_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_submission public.submissions;
begin
  select * into v_submission from public.submissions where id = p_submission_id for update;
  if not found or v_submission.user_id != auth.uid() then
    raise exception 'submission not found';
  end if;
  if v_submission.status != 'draft' then
    raise exception 'this activity has already been submitted';
  end if;
  if v_submission.proof_image_path is null then
    raise exception 'add a proof photo before submitting';
  end if;

  update public.submissions set status = 'pending' where id = p_submission_id;
end;
$$;

grant execute on function public.submit_task(uuid) to authenticated;

-- Owners can now replace a draft's photo; let them delete the old blob
-- instead of leaving it orphaned in storage.
create policy "proof-photos: owner deletes own folder"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'proof-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================
-- Reward redemptions become admin-approved requests, not instant
-- ============================================================

alter table public.reward_claims add column status text not null default 'pending'
  check (status in ('pending', 'approved', 'rejected'));
alter table public.reward_claims add column reward_title text not null;
alter table public.reward_claims add column remark text;
alter table public.reward_claims add column granted_by uuid references public.profiles(id);

drop function public.claim_reward(uuid);

create function public.request_reward(p_reward_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cost int;
  v_title text;
  v_available boolean;
  v_points int;
begin
  select cost, title, available into v_cost, v_title, v_available from public.rewards where id = p_reward_id;
  if not found or not v_available then
    raise exception 'reward not available';
  end if;

  select points into v_points from public.profiles where id = auth.uid();
  if v_points < v_cost then
    raise exception 'insufficient points';
  end if;

  insert into public.reward_claims (user_id, reward_id, cost, reward_title, status)
  values (auth.uid(), p_reward_id, v_cost, v_title, 'pending');
end;
$$;

-- Points are only ever deducted here, on approval - never at request time -
-- and re-checked against the CURRENT balance so two pending requests can't
-- both be approved past what the user can actually afford.
create function public.approve_reward_claim(p_claim_id uuid, p_decision text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim public.reward_claims;
  v_points int;
begin
  if not public.is_admin() then
    raise exception 'only admins can review redemption requests';
  end if;

  if p_decision not in ('approved', 'rejected') then
    raise exception 'invalid decision: %', p_decision;
  end if;

  select * into v_claim from public.reward_claims where id = p_claim_id for update;
  if not found then
    raise exception 'redemption request not found';
  end if;

  if v_claim.status != 'pending' then
    return; -- already decided, no-op
  end if;

  if p_decision = 'approved' then
    select points into v_points from public.profiles where id = v_claim.user_id for update;
    if v_points < v_claim.cost then
      raise exception 'user no longer has enough points for this redemption';
    end if;
    update public.profiles set points = points - v_claim.cost where id = v_claim.user_id;
  end if;

  update public.reward_claims set status = p_decision where id = p_claim_id;
end;
$$;

-- Admin-initiated gift: recorded at the reward's normal cost for reporting,
-- but never deducted from the recipient's balance, and requires a remark.
create function public.send_reward(p_user_id uuid, p_reward_id uuid, p_remark text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cost int;
  v_title text;
begin
  if not public.is_admin() then
    raise exception 'only admins can send rewards';
  end if;

  if p_remark is null or btrim(p_remark) = '' then
    raise exception 'a remark is required when sending a reward';
  end if;

  select cost, title into v_cost, v_title from public.rewards where id = p_reward_id;
  if not found then
    raise exception 'reward not found';
  end if;

  insert into public.reward_claims (user_id, reward_id, cost, reward_title, status, remark, granted_by)
  values (p_user_id, p_reward_id, v_cost, v_title, 'approved', p_remark, auth.uid());
end;
$$;

grant execute on function public.request_reward(uuid) to authenticated;
grant execute on function public.approve_reward_claim(uuid, text) to authenticated;
grant execute on function public.send_reward(uuid, uuid, text) to authenticated;
