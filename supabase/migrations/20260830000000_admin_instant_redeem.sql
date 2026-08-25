-- Admins don't need their own redemption requests approved - they'd just
-- be approving themselves. If the caller is an admin, deduct and mark
-- approved immediately instead of leaving it pending for review.
create or replace function public.request_reward(p_reward_id uuid)
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

  select points into v_points from public.profiles where id = auth.uid() for update;
  if v_points < v_cost then
    raise exception 'insufficient points';
  end if;

  if public.is_admin() then
    update public.profiles set points = points - v_cost where id = auth.uid();
    insert into public.reward_claims (user_id, reward_id, cost, reward_title, status)
    values (auth.uid(), p_reward_id, v_cost, v_title, 'approved');
  else
    insert into public.reward_claims (user_id, reward_id, cost, reward_title, status)
    values (auth.uid(), p_reward_id, v_cost, v_title, 'pending');
  end if;
end;
$$;
