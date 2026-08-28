-- ============================================================
-- Submission status: rename 'draft' -> 'ongoing'
-- ============================================================
-- "draft" was the started-but-not-yet-submitted state. The UI calls it
-- "Ongoing", so make the stored value match. This also enforces a single
-- ongoing submission per task, collapsing any duplicates the old "Start Task"
-- flow created before that guard existed.

-- 1. Collapse duplicate started rows, keeping the newest per (user, task).
delete from public.submissions s
using public.submissions keep
where s.status = 'draft'
  and keep.status = 'draft'
  and s.user_id = keep.user_id
  and s.task_id = keep.task_id
  and (s.created_at, s.id) < (keep.created_at, keep.id);

-- 2. Drop the constraints pinning the old value, migrate the rows, re-add.
alter table public.submissions drop constraint if exists submissions_photo_required_unless_draft;
alter table public.submissions drop constraint if exists submissions_status_check;

update public.submissions set status = 'ongoing' where status = 'draft';

alter table public.submissions add constraint submissions_status_check
  check (status in ('ongoing', 'pending', 'approved', 'rejected'));

-- An ongoing submission may have no photo yet; anything past it must have one.
alter table public.submissions add constraint submissions_photo_required_unless_ongoing
  check (status = 'ongoing' or proof_image_path is not null);

-- 3. "owner edits own draft" row policy -> "owner edits own ongoing".
drop policy if exists "submissions: owner edits own draft" on public.submissions;
create policy "submissions: owner edits own ongoing"
  on public.submissions for update
  using (auth.uid() = user_id and status = 'ongoing')
  with check (auth.uid() = user_id and status = 'ongoing');

-- 4. submit_task gates on the new value.
create or replace function public.submit_task(p_submission_id uuid)
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
  if v_submission.status != 'ongoing' then
    raise exception 'this activity has already been submitted';
  end if;
  if v_submission.proof_image_path is null then
    raise exception 'add a proof photo before submitting';
  end if;

  update public.submissions set status = 'pending' where id = p_submission_id;
end;
$$;

-- 5. One ongoing submission per task, per user - DB-level backstop for the
--    client guard (a multi-tab race can't create a second).
create unique index submissions_one_ongoing_per_task
  on public.submissions (user_id, task_id)
  where status = 'ongoing';
