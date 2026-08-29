# Testing

This page is the full **beta tester field guide** — onboarding, a 7‑day plan,
a bug‑report template, and ~90 numbered test cases — followed by the
engineering checks ([RLS / RPC boundary](#manual-rls--rpc-boundary-check),
[automated tooling](#automated-tooling-free), [type safety](#type-safety)).

Bugs go to
[GitHub Issues](https://github.com/djraj/lotus-rewards-app/issues).

---

# Beta tester field guide

Help us shake down Golden Lotus Rewards before launch: what to try, how to log
what breaks, what we need back.

| | |
| --- | --- |
| **Test window** | 7 days from your onboarding day |
| **Build** | v1.0 · <https://lotus-rewards-app.jariarud.workers.dev/> |
| **Your role** | Member; some also Admin |
| **Bugs** | [GitHub Issues](https://github.com/djraj/lotus-rewards-app/issues) — see [Reporting a bug](#4--reporting-a-bug) |
| **Questions** | Durairaj or Sundar |
| **Wrap‑up** | Day 7 — feedback to a coordinator |

## 0 · What you're testing

**Golden Lotus Rewards** is a browser app (phone + desktop) for a wellness
community. Members earn **Lotus Points** by completing real‑world tasks and
submitting a **proof photo**; admins review and award the points; members
spend points in a **rewards marketplace**. Admins also adjust balances, gift
rewards, and set roles. It's one site — screens sit after a `#` in the URL
(e.g. `…/#/tasks`).

**The five screens**

- **Dashboard** — points, completed count, daily quote, recent activity, next‑reward progress.
- **Tasks** — the catalogue by category. Starting a task creates an *ongoing* draft.
- **Rewards** — the marketplace. Redeeming sends a request for admin approval.
- **Admin** *(admins only)* — review submissions/redemptions, adjust points, set roles, gift rewards.
- **History** *(admins only)* — the full decision trail.

## 1 · What we need from you

- **Functional bugs** — doesn't do what it says, throws an error, loses data, wrong number.
- **Confusing moments** — anywhere you hesitated or guessed, even if nothing broke.
- **Wording** — labels, buttons, errors, emails that are unclear or wrong.
- **Visual glitches** — overlap, clipped text, misalignment, broken images.
- **Speed** — slow to load, or slow to react after a tap.
- **What worked well**, and **gaps** — things you expected to do but couldn't.

> **Minimum:** cover your assigned groups in §5, use the app for real on at
> least **two days** (start and submit a task each time), and file every issue
> you hit.

## 2 · Getting started

Day 1. If any step fails, that's your first bug report.

**Get in**

1. Open <https://lotus-rewards-app.jariarud.workers.dev/>.
2. **Sign up** with an email you can receive mail at (the beta sends real email).
3. Confirm via the email before signing in. Check spam.
4. Sign in → you land on the Dashboard, balance `0`, no activity.
5. **Admin testers:** send a coordinator your account email. One admin is set
   up by the coordinators and promotes the rest via *Team Roles* (TC‑G5).
   Confirmed when *Admin* / *History* appear after a reload.

**Ground rules**

- **Throwaway data.** Nothing real or sensitive; use a password you don't reuse.
- Data may be **reset without warning** and the app may blip during fixes — only report lasting downtime.
- Proof photos are visible to admins and the team — use **non‑sensitive test images**.
- Keep the URL **within the tester group**.
- **Security/privacy issues** (seeing others' data, unearned Admin access) → message Durairaj or Sundar directly, not the public issue tracker.

**Email**

Email is **on**: sign‑up, magic link, password reset, plus task
started/submitted/approved, redemption approved, and reward gifted. Watch your
inbox and spam — tests are group I.

## 3 · The seven‑day plan

Day 1 is your onboarding day. A suggested path — adjust freely, but use the
app daily and file issues as you go.

| When | Focus |
| --- | --- |
| **Day 1** | Onboarding — run §2, open all five screens, report access problems immediately. |
| **Days 2–4** | Member journey, groups A–E. Each day: start a task, add a photo, submit. Get an admin tester to approve some so you build up points. |
| **Day 4** | Check‑in — quick note to a coordinator; anything blocking you. |
| **Days 5–6** | Admin/email/rough edges, groups F–J. Admin testers drive F–H. End Day 6 with 30 min of unscripted "try to break it". |
| **Day 7** | Wrap up — re‑test anything tied to a bug marked fixed; send a coordinator your §6 answers and bug list. |

## 4 · Reporting a bug

One issue per report; make it reproducible. File at
[github.com/djraj/lotus-rewards-app/issues](https://github.com/djraj/lotus-rewards-app/issues)
(public repo — a free GitHub account is all you need). No GitHub? Send the
template to Durairaj or Sundar. Attach a screenshot or screen recording where
you can.

| Field | Notes |
| --- | --- |
| Title | Short + specific: "Submit stays disabled after adding a photo, iOS Safari" |
| When | Date, time, timezone |
| Tester | Name + account email used |
| Environment | Device, OS, browser + version, screen size |
| Screen / URL | Full URL including the part after `#` |
| Test case | `TC-…` if it maps to one, else "exploratory" |
| Severity | S1–S4 (below) |
| Steps | Numbered, from a stated starting point |
| Expected / Actual | What you expected vs. what happened |
| Frequency | Every time / sometimes / once |
| Evidence | Screenshot, recording, console errors (`F12`) |
| Notes | Did a refresh fix it? Depends on points balance? |

**Severity**

| Code | Means | Example |
| --- | --- | --- |
| **S1** | Critical — core flow blocked, data lost/wrong, or data exposed. | Can't sign in; points deducted twice; a member reaches Admin. |
| **S2** | Major — key feature broken, no workaround. | Submit never leaves Pending; approving a redemption doesn't deduct. |
| **S3** | Minor — misbehaves but has a workaround, or an edge case. | Wrong stat count; filter needs a second tap. |
| **S4** | Cosmetic — visual or copy only. | Clipped text; awkward wording; icon a few px off. |

Unsure between two? Pick the higher and note it.

## 5 · Test cases

Groups A–J. Cite the ID in bug reports. *(admins only)* needs an Admin account.

### A · Access & accounts

Password, magic link + one‑time code, password reset.

**TC‑A1 · Sign up with email & password**
1. From the sign‑in screen, choose **Sign up**.
2. Enter a name, an email you control, and a password of at least 6 characters.
3. Submit.

*Expected:* a message tells you the account was created and to check your email to confirm, then sign in.

**TC‑A2 · Confirmation is required before first sign‑in**
1. Immediately after TC‑A1, try to sign in with the new email and password.
2. Then open the confirmation email and follow it.

*Expected:* sign‑in before confirming is refused with a clear reason. After confirming, sign‑in works.

**TC‑A3 · Sign in with a confirmed account**
1. Enter a confirmed email and correct password, submit.

*Expected:* you land on the Dashboard. The nav shows your points balance.

**TC‑A4 · Wrong password**
1. Enter a valid email with the wrong password, submit.

*Expected:* a readable error appears. No sign‑in. The form stays usable and doesn't lose your email.

**TC‑A5 · Request a magic link**
1. On the sign‑in screen, enter your email and choose **Send Magic Link**.

*Expected:* a message says a code and a sign‑in link were sent. A code entry field appears. The email arrives with both a 6–8 digit code and a link.

**TC‑A6 · Sign in with the one‑time code**
1. After TC‑A5, type the code from the email into the field and verify.
2. Also try: one wrong digit; then the correct code.

*Expected:* the correct code signs you in and shows the Dashboard. A wrong code gives a clear "not accepted" message without signing you in.

**TC‑A7 · Sign in by clicking the magic link**
1. Request a fresh link (TC‑A5) and click the link in the email instead of entering a code.

*Expected:* the link opens the app already signed in.

**TC‑A8 · "Use a different email" from the code screen**
1. On the code‑entry screen, choose **Use a different email**.

*Expected:* you're back to the normal sign‑in form, code field cleared.

**TC‑A9 · Forgot password — request**
1. On sign‑in, leave email blank and tap **Forgot password?** — note the prompt.
2. Enter your email, tap it again.

*Expected:* with no email, you're told to enter one first. With an email, a message confirms a reset email was sent.

**TC‑A10 · Reset password — set a new one**
1. Open the reset email and follow the link.
2. On "Choose a new password", enter two *different* passwords, submit.
3. Then enter the same password in both fields, submit.

*Expected:* mismatched passwords are rejected with "the two passwords don't match". Matching passwords save, and you're dropped into the app signed in. The new password works next time; the old one doesn't.

**TC‑A11 · Cancel out of the reset screen**
1. On "Choose a new password", choose **Cancel and sign out**.

*Expected:* you're signed out and returned to the normal sign‑in screen. Your password is unchanged.

**TC‑A12 · Sign out**
1. While signed in, use the sign‑out control in the top‑right of the nav.

*Expected:* you return to the sign‑in screen. Going back / reloading does not get you back into the app.

**TC‑A13 · Session survives a reload and a restart**
1. Signed in, reload the page.
2. Close the tab, reopen the URL.
3. Quit the browser entirely, reopen, return to the URL.

*Expected:* you stay signed in each time and land on the Dashboard.

**TC‑A14 · Expired or reused magic link**
1. Request a magic link, wait past its expiry (or use it twice), then try the old link.

*Expected:* the app opens on the sign‑in screen showing a specific reason (e.g. the link expired), not a blank or generic failure.

**TC‑A15 · Password minimum length**
1. On Sign up (or password reset), try a 5‑character password.

*Expected:* the form won't submit and indicates a 6‑character minimum.

### B · Dashboard

Best tested with a mix of ongoing / pending / approved / rejected activity.

**TC‑B1 · Header greets you by name**
1. Open the Dashboard.

*Expected:* "Welcome back, *your name*" — the name you signed up with.

**TC‑B2 · Points match everywhere**
1. Compare the "Lotus Points" stat card, the number in the nav pill, and (on Rewards) the "Available" figure.

*Expected:* all three show the same number.

**TC‑B3 · Completed Tasks count**
1. Note the "Completed Tasks" number.
2. Have an admin approve one more of your submissions, then reload.

*Expected:* the count equals your number of **approved** submissions and goes up by one.

**TC‑B4 · Daily quote**
1. Note the quote. Reload a few times. Revisit later the same day.

*Expected:* a quote always shows and stays the same all day (it rotates by date, not per reload).

**TC‑B5 · Recent Activity list**
1. With several submissions in different states, look at Recent Activity.

*Expected:* up to 5 items, newest first, each with the task title, a date, and a status badge (Ongoing / Pending / Approved / Rejected) that matches reality. Approved rows show `+points`.

**TC‑B6 · Progress toward next reward**
1. With points below the cost of at least one reward, read the "Achieve Your Potential" panel.

*Expected:* it names the **cheapest reward you can't yet afford**, shows `your points / cost`, and a progress bar filled to roughly the right fraction.

**TC‑B7 · When you can afford everything**
1. Have an admin set your points above the most expensive reward (70). Reload the Dashboard.

*Expected:* the panel switches to the "enough points for every reward" message instead of a progress bar.

**TC‑B8 · Continue an ongoing task from the Dashboard**
1. Start a task (TC‑C4) so you have an **Ongoing** row.
2. Click that row in Recent Activity.

*Expected:* the row is visibly clickable and opens the proof submission dialog for that task.

**TC‑B9 · Non‑ongoing rows aren't clickable**
1. Click a Pending / Approved / Rejected row.

*Expected:* nothing happens; no dialog opens; no hover affordance suggesting it should.

**TC‑B10 · Empty state**
1. On a brand‑new account with no activity, read the Dashboard.

*Expected:* stats show 0. Recent Activity shows a friendly "no activity yet" prompt rather than a blank box.

### C · Tasks

Browsing and starting tasks. Full list + points in [Appendix A](#appendix-a--task-catalogue).

**TC‑C1 · Grouping and order**
1. Open Tasks.

*Expected:* tasks appear under category headings in order: Referral, Service, Content, Coordination. Each heading shows a count. Empty categories don't appear.

**TC‑C2 · Search**
1. Type part of a task title into the search box (e.g. "friend").
2. Then part of a description that isn't in any title.

*Expected:* the list narrows live to tasks matching title *or* description, case‑insensitive.

**TC‑C3 · No‑results state**
1. Search for something with no matches ("xyzzy").

*Expected:* a "no tasks match" message quoting your search term. Clearing the box restores the full list.

**TC‑C4 · Start a task**
1. On a task you haven't started, tap **Start Task**.

*Expected:* the button briefly shows "Starting…", then you're taken to the Dashboard, where the task now appears as an **Ongoing** item. No modal is shown at this step.

**TC‑C5 · Started tasks show "Ongoing"**
1. Return to Tasks after TC‑C4.

*Expected:* that task's button now reads **Ongoing**; tapping it takes you to the Dashboard to finish the draft.

**TC‑C6 · Can't start the same task twice**
1. With a task already Ongoing, try to start it again — including from a second browser tab opened on Tasks.

*Expected:* no second draft is created. You end up with exactly one Ongoing draft for that task. No error is shown to you.

**TC‑C7 · Point values match the catalogue**
1. Spot‑check a few task point values against [Appendix A](#appendix-a--task-catalogue).

*Expected:* they match (values are small — 1 to 15).

**TC‑C8 · Re‑run a task after approval**
1. Get a task submission approved, then return to Tasks and start the same task again.

*Expected:* you can start it again (repeatable tasks); a fresh Ongoing draft is created.

### D · Proof submission

The dialog from an Ongoing item on the Dashboard. Photo required to submit;
note optional.

**TC‑D1 · Open the draft**
1. Dashboard → click an Ongoing row.

*Expected:* a dialog opens with the task title, its point value, and a "Started …" timestamp.

**TC‑D2 · Attach a photo from a file**
1. Tap the photo area, choose an image file from the device.

*Expected:* a preview of the image replaces the upload box, with an "x" to remove it.

**TC‑D3 · Take a photo with the camera**
1. On a phone, tap the photo area and choose the camera option.

*Expected:* the camera opens (rear camera preferred); the captured photo appears as the preview.

**TC‑D4 · Reject a non‑image file**
1. Try to attach a PDF or other non‑image (you may need to switch the file picker off "images only").

*Expected:* a message like "please choose an image file". Nothing is attached.

**TC‑D5 · Reject an oversized photo**
1. Try to attach an image larger than 10 MB.

*Expected:* a "too large (max 10MB)" message. Nothing is attached.

**TC‑D6 · Note is optional**
1. Add a photo, leave the note empty, submit.

*Expected:* submission goes through; the empty note isn't treated as an error.

**TC‑D7 · Save Draft**
1. Add a photo and a note, tap **Save Draft**.

*Expected:* the dialog closes. The task is still **Ongoing** (not Pending). No points move.

**TC‑D8 · Draft persists**
1. After TC‑D7, reload the page and reopen the same Ongoing item.

*Expected:* your saved note is pre‑filled and your saved photo is shown. A "Last edited …" time appears next to "Started …".

**TC‑D9 · Replace the photo**
1. Reopen a draft that has a photo, remove it with the "x", add a different one, Save Draft, reopen.

*Expected:* the new photo is what's stored; the old one is gone. No broken image.

**TC‑D10 · Submit is blocked without a photo**
1. Open a draft with no photo. Type a note. Look at **Submit for Review**.

*Expected:* Submit is disabled until a photo is attached; hovering it explains why. Save Draft still works.

**TC‑D11 · Submit for review**
1. With a photo attached, tap **Submit for Review**.

*Expected:* brief "Submitting…", then the dialog closes. On the Dashboard the item is now **Pending**. It appears in the admin's Pending Verifications (TC‑F2). Still no points until approved.

**TC‑D12 · Large photo still works end to end**
1. Submit with a large (but under 10 MB) high‑resolution photo.
2. Have an admin open it in the review queue.

*Expected:* upload completes in reasonable time and the admin sees a clear image (the app compresses before upload).

**TC‑D13 · Close without saving**
1. Open a draft, change the note, close with the "x" (not Save).
2. Reopen.

*Expected:* the unsaved change is not kept — the note is back to its last saved value. (Note this either way in a report if it surprises you.)

**TC‑D14 · Double‑tap Submit**
1. Tap **Submit for Review** twice quickly.

*Expected:* exactly one Pending submission results; the button disables itself during the operation.

### E · Rewards marketplace

For members, redeeming creates a request; points leave your balance only on
admin approval. Costs in [Appendix B](#appendix-b--reward-catalogue).

**TC‑E1 · Grouping and order**
1. Open Rewards.

*Expected:* rewards under headings in order: Products, Sessions, Workshops, Reviews, each with a count.

**TC‑E2 · Search**
1. Search by part of a title ("review") and by a description word.

*Expected:* list narrows live on title or description; a no‑match message quotes the term.

**TC‑E3 · Affordable reward**
1. With enough points for a reward, look at its button.

*Expected:* button reads **Redeem Reward** and is enabled. The cost is shown on the card.

**TC‑E4 · Unaffordable reward**
1. Look at a reward that costs more than your balance.

*Expected:* button is disabled and reads **Need N more**, where N is exactly cost minus your points.

**TC‑E5 · Out of stock**
1. If any reward is marked unavailable (ask an admin to set one), view it.

*Expected:* button reads **Out of Stock** and is disabled regardless of your points.

**TC‑E6 · Redemption confirmation dialog**
1. Tap **Redeem Reward** on an affordable reward.

*Expected:* a dialog names the reward and cost and shows your balance *after*. For a member it says points come off **once an admin approves**. Cancel closes it with nothing changed.

**TC‑E7 · Confirm a redemption (member)**
1. In the dialog, tap **Confirm**.

*Expected:* a success message says the request was sent for admin approval. Your points are **unchanged** for now.

**TC‑E8 · Requested state**
1. After TC‑E7, look at that reward's card and the "My Redemption Requests" list.

*Expected:* the card button now reads **Requested** and is disabled. The request is listed as "Pending approval".

**TC‑E9 · No duplicate pending request**
1. Try to redeem the same reward again while the first request is still pending.

*Expected:* you can't — the button stays **Requested**. (Once approved or rejected, you may request again.)

**TC‑E10 · My Redemption Requests list**
1. With a few requests in different states, read the list.

*Expected:* up to 5 recent requests with the reward title and a status of Pending approval / Approved / Declined that matches the admin's decisions.

**TC‑E11 · Insufficient points can't be forced**
1. Get a reward's button to **Need N more**, then try anything to trigger a redeem (double‑tap, keyboard Enter on the button).

*Expected:* no request is created; no confirmation dialog opens.

**TC‑E12 · Admin redeems instantly** *(admins only)*
1. As an admin with enough points, redeem a reward and confirm.

*Expected:* the dialog wording says points come off **immediately**. On confirm, your balance drops by the cost right away with no approval step, and a success message says it was redeemed.

### F · Admin — reviewing submissions & redemptions

*(admins only)* The *Admin* screen. Points move only through these actions
and group G.

**TC‑F1 · Admin nav visibility**
1. Sign in as an admin; then as a regular member.

*Expected:* *Admin* and *History* links show only for the admin, in both the top nav and the mobile bottom bar.

**TC‑F2 · Pending Verifications shows the proof**
1. Have a member submit a task (TC‑D11). Open Admin.

*Expected:* the submission is listed with the task title, a timestamp, the point value, the proof photo, and the note if there was one.

**TC‑F3 · Approve a submission**
1. Tap **Approve** on a pending submission.
2. Check the member's balance and Dashboard.

*Expected:* the row leaves the queue. The member's points increase by exactly the task's value. Their activity shows Approved with `+points`. (Email "approved" if on.)

**TC‑F4 · Reject a submission**
1. Tap **Reject** on a pending submission.

*Expected:* the row leaves the queue, no points are awarded, and the member's activity shows Rejected.

**TC‑F5 · Re‑deciding is a safe no‑op**
1. In History or via a second admin tab, try to approve a submission that's already approved (or reject an already‑rejected one).

*Expected:* no double points, no error state that sticks — the decision stays as it was.

**TC‑F6 · Redemption Requests list**
1. Have a member request a reward (TC‑E7). Open Admin.

*Expected:* the request shows the reward title, the requester's name, a timestamp, and the cost.

**TC‑F7 · Approve a redemption**
1. Tap **Approve** on a request. Check the member's balance.

*Expected:* the member's points drop by exactly the cost *now* (not before). The request leaves the queue and shows Approved in the member's list. (Email if enabled.)

**TC‑F8 · Reject a redemption**
1. Tap **Reject** on a request.

*Expected:* no points are deducted. The member sees it as Declined and can request that reward again.

**TC‑F9 · Approving a redemption the member can no longer afford**
1. Member has 10 points and requests two different 10‑point rewards.
2. Admin approves the first (balance → 0), then tries to approve the second.

*Expected:* the second approval fails with a clear message ("no longer has enough points"). Balance stays at 0; that request is left pending, not silently approved into a negative balance.

**TC‑F10 · Admin Stats accuracy**
1. Note Total Approved / Rejected / Submissions / Pending Redemptions. Approve one submission and one redemption. Reload.

*Expected:* counts move by the right amounts and reconcile with what's in History.

**TC‑F11 · Proof photo access is scoped**
1. As an admin, open a proof photo; copy its image URL; open it in a private window with no session.

*Expected:* signed URLs work for the admin but a bare, unauthenticated request to storage for someone else's folder is refused. Report any way a member can see another member's photos as **S1**.

### G · Admin — points, roles & gifts

*(admins only)* The right‑hand column of the Admin screen.

**TC‑G1 · Add points by hand**
1. Quick Adjust → pick a user, enter `50`, type a remark, Update Balance.

*Expected:* that user's balance rises by 50. The user picker label updates. The remark is required and accepted.

**TC‑G2 · Subtract points**
1. Enter `-20` with a remark, Update Balance.

*Expected:* balance drops by 20.

**TC‑G3 · Remark is required**
1. Enter an amount but leave the remark blank.

*Expected:* Update Balance stays disabled / the form won't submit until a non‑blank remark is entered.

**TC‑G4 · Balance floors at zero**
1. On a user with 15 points, adjust by `-100` with a remark.

*Expected:* balance becomes 0, not negative.

**TC‑G5 · Promote a user to admin**
1. Team Roles → pick another user → set role to **admin** → Update Role.
2. Have that person reload the app.

*Expected:* a confirmation message names the user and new role. After *their* next page load, they see Admin / History.

**TC‑G6 · Demote an admin to user**
1. Set an admin (not yourself) back to **user**. Have them reload.

*Expected:* on their next load the Admin / History links are gone and `#/admin` shows Access Denied (TC‑H5).

**TC‑G7 · You can't change your own role**
1. In Team Roles, select yourself in the user picker.

*Expected:* the role selector is disabled for your own row and the helper text explains another admin must do it. Update Role can't be used on yourself.

**TC‑G8 · No‑op role change**
1. Pick a user and "change" them to the role they already have.

*Expected:* Update Role is disabled (no change to make); nothing errors.

**TC‑G9 · Gift a reward**
1. Send a Reward → pick a user and a reward → enter a remark → Send Reward.
2. Check the recipient's points and their Rewards list.

*Expected:* success message. The recipient's points are **not** reduced. The gift shows in their reward history. (Email "reward sent" if enabled.)

**TC‑G10 · Gift requires a remark**
1. Try Send Reward with a blank remark.

*Expected:* blocked until a non‑blank remark is entered.

**TC‑G11 · Gift is attributed in History**
1. Open History and find the gift from TC‑G9.

*Expected:* it's listed as a redemption marked "Gifted by *your name*" with the remark shown.

### H · Admin — history & access control

**TC‑H1 · History shows both trails** *(admins only)*
1. Open History.

*Expected:* two panels: Task Submissions and Reward Redemptions, newest first, each row with the member's name, a timestamp, a status badge, and points. Ongoing drafts are *not* listed.

**TC‑H2 · History search** *(admins only)*
1. Search by a task title, a reward title, and a member's name.

*Expected:* both panels filter to matching rows; counts in the headings update.

**TC‑H3 · Status filter tabs** *(admins only)*
1. Cycle through All / Pending / Approved / Rejected.

*Expected:* each tab shows only rows in that state, across both panels, and combines correctly with an active search.

**TC‑H4 · Remarks & gift attribution show** *(admins only)*
1. Find a gifted reward and a rejected/approved redemption with a remark.

*Expected:* "Gifted by …" and the remark text are both visible on the row.

**TC‑H5 · Member blocked from /admin**
1. As a regular member, put `#/admin` in the address bar and go.

*Expected:* an "Access Denied — you must be an administrator" screen. No admin data loads.

**TC‑H6 · Member blocked from /admin/history**
1. As a regular member, navigate to `#/admin/history`.

*Expected:* same Access Denied screen; no history data loads. Report any leak of admin data to a member as **S1**.

### I · Email notifications

Check inbox *and* spam for each. Note sender, subject, whether the link opens
the app, and arrival time.

**TC‑I1 · Auth emails**
1. Trigger: sign‑up confirmation (TC‑A1), magic link (TC‑A5), password reset (TC‑A9).

*Expected:* each arrives within a couple of minutes, from a recognisable sender, with a working link/code.

**TC‑I2 · Task started**
1. Start a task (TC‑C4).

*Expected:* email "You started: *task*" explaining to add a photo and submit. CTA opens your dashboard.

**TC‑I3 · Task submitted**
1. Submit a draft for review (TC‑D11).

*Expected:* email "Submitted for review: *task*".

**TC‑I4 · Task approved**
1. Have an admin approve it (TC‑F3).

*Expected:* email "Approved: *task*" naming the points added.

**TC‑I5 · Redemption approved**
1. Have an admin approve a redemption request (TC‑F7).

*Expected:* email "Redemption approved: *reward*" with the cost.

**TC‑I6 · Reward gifted**
1. Have an admin gift you a reward (TC‑G9).

*Expected:* email "A reward was sent to you: *reward*", including the admin's remark and noting no points were deducted.

**TC‑I7 · No stray emails**
1. Across the week, watch for emails with no matching action (e.g. on Save Draft, on Reject, or duplicates).

*Expected:* email only for the events above. Report anything else.

### J · Cross‑cutting & non‑functional

Run against flows you already know. Spread devices and browsers across the
tester group.

**TC‑J1 · Phone layout**
1. Use the app on a phone (~375 px wide) through a full task and a full redemption.

*Expected:* bottom tab bar for navigation; dialogs fit and scroll if needed; nothing cut off or overlapping; tap targets big enough.

**TC‑J2 · Tablet & desktop layout**
1. Repeat key screens at ~768 px and at full desktop width.

*Expected:* layout adapts (multi‑column where there's room), the top nav replaces the bottom bar, no giant empty gutters or squished cards.

**TC‑J3 · Browser matrix**
1. As a group, cover latest Chrome, Safari, Firefox, and Edge on desktop, plus iOS Safari and Android Chrome.

*Expected:* sign‑in, task submit (incl. camera), and redemption work on all. Note any browser‑specific failure with the version.

**TC‑J4 · Slow network**
1. Throttle to a slow connection (dev tools, or real weak signal) and do a task submit and a redemption.

*Expected:* loading/spinner states show; buttons disable while working; nothing ends in a permanent blank screen; no duplicate records from the delay.

**TC‑J5 · Offline / connection drop**
1. Go offline mid‑action (e.g. right after tapping Submit or Approve). Come back online and reload.

*Expected:* a clear failure message, not a silent hang. After reconnecting and reloading, data is consistent — the action either fully happened or fully didn't.

**TC‑J6 · Two tabs / two devices**
1. Sign in as the same user in two places. Start a task in one; reload the other. Have an admin approve something; reload your member view.

*Expected:* after a reload the second view reflects the change. No corruption, no duplicate drafts (TC‑C6).

**TC‑J7 · Deep links & refresh**
1. Bookmark `#/rewards`, open it fresh. Use browser Back/Forward across Dashboard → Tasks → Rewards. Reload while on each screen.

*Expected:* every route loads directly and survives a refresh; Back/Forward move between screens as expected.

**TC‑J8 · Rapid taps everywhere**
1. Double‑ and triple‑tap Start Task, Save Draft, Submit, Approve, Reject, Confirm, Update Balance.

*Expected:* one action per intent. No duplicate submissions, requests, adjustments, or point changes.

**TC‑J9 · Keyboard only**
1. Navigate a full flow using only `Tab`, `Shift`+`Tab`, `Enter`, `Space`, `Esc`.

*Expected:* every control is reachable and operable; focus is always visible; dialogs trap focus and close on `Esc`; focus returns somewhere sensible afterwards.

**TC‑J10 · Screen reader & zoom**
1. Do a task submit with a screen reader (VoiceOver / NVDA / TalkBack). Separately, set browser zoom / text size to 200%.

*Expected:* buttons and fields are announced with meaningful names; status changes are perceivable; at 200% text reflows without clipping or horizontal scrolling of the whole page.

**TC‑J11 · Odd input**
1. Use a very long name at sign‑up; a very long note; emoji and non‑Latin characters in the note and remark; leading/trailing spaces.

*Expected:* text is stored and displayed faithfully; layouts wrap or truncate cleanly; nothing overflows its card or breaks the page.

**TC‑J12 · Timestamps & timezone**
1. Check "Started" / "Last edited" times and History timestamps against your device clock.

*Expected:* times are shown in your local timezone and read sensibly (no "in the future", no obviously wrong dates).

**TC‑J13 · Light & dark / general polish**
1. If your OS/browser has a dark mode, view the app in both. Scan every screen for contrast and readability.

*Expected:* text is readable on its background everywhere; no invisible labels; images and icons load. (Log contrast problems as S3/S4.)

**TC‑J14 · Perceived performance**
1. Note first load time, and the delay after tapping into Tasks / Rewards / Admin, on a typical connection.

*Expected:* screens appear within a second or two; nothing feels stuck. Flag anything that routinely takes longer with your connection details.

## 6 · Wrap‑up questions

No form — on Day 7, write short answers and send them to a coordinator with
your bug list.

1. **First sign‑in and setup** — how easy? *(1–5 + comment)*
2. **Earning points** (start → proof → submit) — how clear? *(1–5 + comment)*
3. **Rewards flow** (cost, request, approval) — how clear? *(1–5 + comment)*
4. Did the **points maths** ever look wrong? *(when)*
5. *Admins:* **admin tools** — how usable? *(1–5 + comment)*
6. **Performance** on your device/connection? *(1–5 + what was slow)*
7. **Visual polish**? *(1–5 + where it looked rough)*
8. **Top three problems** you hit *(link bug IDs)*
9. **Three things that worked** and shouldn't change
10. What did you **expect to do but couldn't**?
11. Use this in your community as‑is? *(yes / with fixes / not yet — why)*
12. Recommend to another organiser, 0–10? *(+ main reason)*

## Appendix A — task catalogue

Seeded in the beta; points are per completion.

| Category | Task | Points |
| --- | --- | ---: |
| Referral | Bring a Friend to THM (×3 visits) | 1 |
| Referral | Refer a Friend to a PH Workshop | 5 |
| Referral | Friend Visits THM & Purchases | 1 |
| Service | Lead Meditation & Exercise (MTH) | 2 |
| Service | Heal a Patient (Non‑PH, MTH) | 1 |
| Content | Create & Post a Social Media Video | 1 |
| Content | Video Gets Engagement | 1 |
| Coordination | Coordinate a PH Workshop (2 Days) | 15 |

## Appendix B — reward catalogue

| Category | Reward | Cost |
| --- | --- | ---: |
| Products | Alcohol Spray | 2 |
| Products | MTH Audio | 3 |
| Products | Om Audio | 3 |
| Products | GLS or EoG Book | 3 |
| Sessions | Full Body Chakra Scan (30 mins) | 5 |
| Sessions | 1:1 PH Session (30 mins) | 5 |
| Sessions | 1:1 PH Session (60 mins) | 10 |
| Workshops | BPH (Level 1) Workshop | 50 |
| Workshops | APH (Level 2) Workshop | 55 |
| Workshops | PSY (Level 3) Workshop | 60 |
| Workshops | AOHS Workshop | 50 |
| Workshops | Arhatic Yoga Workshop | 70 |
| Reviews | BPH Review | 10 |
| Reviews | APH Review | 15 |
| Reviews | PSY Review | 15 |
| Reviews | AOHS Review | 10 |
| Reviews | AYP Review | 15 |

Availability can be toggled per reward by an admin — handy for testing the
"Out of Stock" state (TC‑E5). Term glossary:
[Data Model and Security](Data-Model-and-Security.md) and
[User Guide](User-Guide.md#status-glossary).

---

# Engineering testing

## Manual RLS / RPC boundary check

The architecture's real failure mode is a misconfigured policy, not an
"attack". With two real accounts — a plain `user` and an `admin` — confirm all
of the following are **denied**:

1. Calling `approve_submission` / `approve_reward_claim` / `adjust_points` /
   `set_user_role` while signed in as the plain user.
2. Fetching another user's `proof-photos/<other-user-id>/` folder via the
   Storage API.
3. `update public.profiles set points = ...` from the browser console using
   the signed‑in user's session.
4. A plain user reaching `/#/admin` or `/#/admin/history` (should show
   *Access Denied*, load no admin data).

If all four fail as expected, RLS is doing its job. Full rationale:
[`Docs/production-migration-plan.md`](https://github.com/djraj/lotus-rewards-app/blob/main/Docs/production-migration-plan.md)
§9.

## Automated tooling (free)

| Area | Tool |
| --- | --- |
| Dependency CVEs | GitHub Dependabot + `npm audit` |
| Supabase misconfig | Supabase **Security Advisor** (dashboard) — RLS off, weak policies |
| Secrets in git | GitHub secret scanning |
| HTTP headers | securityheaders.com / Mozilla Observatory against the live URL |
| Diff review | the repo's `/code-review` skill, `security-review` mode, on the PR |

## Type safety

`npm run build` type‑checks before building and the Cloudflare deploy runs the
same command, so a type error fails the deploy. Run `npm run typecheck` before
pushing.
