# Admin Guide

Admins get two extra nav links — **Admin** and **History** — and can act on
every member's data. Points and roles only ever change through the actions on
this page; there is no way to edit them directly from the browser.

## Becoming an admin

New accounts are always `role: user`. The first admin is set by hand in
Supabase:

```sql
update public.profiles set role = 'admin' where id = '<user-id>';
```

After that, an existing admin can promote or demote others in‑app from
**Team Roles** (below). A role change takes effect on the target user's
**next page load**.

## Pending Verifications

Each pending task submission shows the task title, timestamp, point value, the
**proof photo**, and the note if any.

- **Approve** — adds the task's points to the member's balance, moves the row
  out of the queue, emails the member.
- **Reject** — no points; status becomes *Rejected*.

Re‑deciding a row that's already in that state is a safe no‑op (no double
points).

## Redemption Requests

Pending reward requests show the reward, the requester, a timestamp, and the
cost.

- **Approve** — deducts the cost from the member's balance **now** (re‑checked
  against their current balance; if they can no longer afford it the approval
  fails and the request stays pending), emails the member.
- **Reject** — no deduction; the member can request that reward again.

## Quick Adjust

Add or subtract points for any user. A **remark is required** and every change
is written to a `points_adjustments` audit table. A balance can't go below 0.

## Team Roles

Switch a user between `user` and `admin`. You **cannot change your own role** —
another admin has to. Every change is recorded in a `role_changes` audit
table. The change lands on the affected user's next page load.

## Send a Reward (gift)

Send any reward to any user directly. A **remark is required**. It's recorded
at the reward's normal cost for reporting but **no points are deducted** from
the recipient, and they get a "reward sent" email. Gifts appear in History
marked *Gifted by <admin>*.

## Admin instant redeem

When an **admin** redeems a reward for themselves, there's no approval step —
the points are deducted immediately and the claim is recorded as approved.

## History

The full trail: **Task Submissions** and **Reward Redemptions**, newest first,
with member name, timestamp, status badge, and points. Search by task, reward,
or member name; filter by All / Pending / Approved / Rejected. Ongoing drafts
are not shown. Remarks and gift attribution appear on redemption rows.

## Admin Stats

Totals on the Admin screen: approved / rejected / total submissions and
pending redemptions.
