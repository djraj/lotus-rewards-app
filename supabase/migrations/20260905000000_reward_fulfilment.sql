-- ============================================================
-- Reward fulfilment: approved claims can be marked delivered
-- ============================================================

-- Fulfilment is tracked alongside `status` rather than as a new status
-- value: an approved claim stays 'approved' (points are already deducted,
-- and the email triggers key off status transitions), and `fulfilled_at`
-- records when the member actually received it.
alter table public.reward_claims add column fulfilled_at timestamptz;
alter table public.reward_claims add column fulfilled_by uuid references public.profiles(id);
alter table public.reward_claims add column delivery_note text;

alter table public.reward_claims add constraint reward_claims_fulfilled_only_if_approved
  check (fulfilled_at is null or status = 'approved');

-- The delivery note is optional (a handed-over product needs none) but may
-- carry a voucher code or booking link, which the member reads via the
-- existing "read own" select policy.
create function public.fulfil_reward_claim(p_claim_id uuid, p_note text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim public.reward_claims;
begin
  if not public.is_admin() then
    raise exception 'only admins can mark rewards fulfilled';
  end if;

  select * into v_claim from public.reward_claims where id = p_claim_id for update;
  if not found then
    raise exception 'redemption not found';
  end if;

  if v_claim.status != 'approved' then
    raise exception 'only approved redemptions can be fulfilled';
  end if;

  if v_claim.fulfilled_at is not null then
    return; -- already fulfilled, no-op
  end if;

  update public.reward_claims
  set fulfilled_at = now(),
      fulfilled_by = auth.uid(),
      delivery_note = nullif(btrim(p_note), '')
  where id = p_claim_id;
end;
$$;

grant execute on function public.fulfil_reward_claim(uuid, text) to authenticated;
