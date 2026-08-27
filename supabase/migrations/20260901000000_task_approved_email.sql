-- Notify the user when an admin approves their task submission.
-- Reuses private.notify_email() from 20260831000000; the notify function
-- turns a pending/rejected -> approved transition into a "Task approved" mail.
create trigger submissions_email_on_approve
  after update on public.submissions
  for each row
  when (old.status is distinct from new.status and new.status = 'approved')
  execute function private.notify_email();
