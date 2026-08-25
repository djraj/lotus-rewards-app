-- RLS policies restrict rows, but PostgREST also requires the underlying
-- SQL privilege before it even tries a query. Tables created via a raw CLI
-- migration don't inherit Supabase's dashboard-managed default grants, so
-- every table needs this explicitly (found via a 403 "permission denied for
-- table profiles" while smoke-testing the app against the linked project).

grant select on public.tasks to authenticated;
grant select on public.rewards to authenticated;
grant select, insert on public.submissions to authenticated;
grant select on public.reward_claims to authenticated;
grant select on public.profiles to authenticated;
