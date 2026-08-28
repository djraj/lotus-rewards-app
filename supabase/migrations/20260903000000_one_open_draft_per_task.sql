-- ============================================================
-- One ongoing (draft) submission per task, per user
-- ============================================================
-- "Start Task" used to create a fresh draft every time, so a user could pile
-- up several un-submitted drafts for the same task. Enforce a single open
-- draft per (user, task); the client finishes the existing one instead.

-- Collapse any duplicate open drafts left behind by the old behaviour,
-- keeping the most recently created row for each (user, task).
delete from public.submissions s
using public.submissions keep
where s.status = 'draft'
  and keep.status = 'draft'
  and s.user_id = keep.user_id
  and s.task_id = keep.task_id
  and (s.created_at, s.id) < (keep.created_at, keep.id);

create unique index submissions_one_open_draft_per_task
  on public.submissions (user_id, task_id)
  where status = 'draft';
