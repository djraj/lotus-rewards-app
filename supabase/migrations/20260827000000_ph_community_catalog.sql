-- Replace the placeholder wellness-app catalog with the real PH/THM
-- community task and reward list. Safe to delete outright: verified zero
-- rows in submissions/reward_claims reference the old tasks/rewards.

delete from public.tasks;
delete from public.rewards;

alter table public.tasks drop constraint tasks_category_check;
alter table public.tasks add constraint tasks_category_check
  check (category in ('Referral', 'Service', 'Content', 'Coordination'));

-- "Coordinate the PH workshop (2 days)" is worth 15 points - the cost of
-- the most expensive review (APH/PSY/AYP) - so it can freely cover any one
-- of the five reviews through the normal points ledger, no separate
-- voucher/fee-waiver mechanism needed.
insert into public.tasks (title, description, points, icon, category) values
  ('Bring a Friend to THM (x3 visits)', 'Bring a friend to THM three separate times.', 1, 'fa-user-plus', 'Referral'),
  ('Refer a Friend to a PH Workshop', 'Refer a friend who signs up for a Pranic Healing workshop.', 5, 'fa-bullhorn', 'Referral'),
  ('Friend Visits THM & Purchases', 'A friend you brought visits THM and purchases an audio, spray, or book.', 1, 'fa-bag-shopping', 'Referral'),
  ('Lead Meditation & Exercise (MTH)', 'Assist in MTH by leading a meditation and exercise session.', 2, 'fa-om', 'Service'),
  ('Heal a Patient (Non-PH, MTH)', 'Assist in MTH by healing a patient who is not a Pranic Healing practitioner.', 1, 'fa-hand-holding-medical', 'Service'),
  ('Create & Post a Social Media Video', 'Create a video about THM/PH and post it on social media.', 1, 'fa-video', 'Content'),
  ('Video Gets Engagement', 'Bonus for a posted video that gets real engagement (submit proof, e.g. a screenshot of likes/comments).', 1, 'fa-heart', 'Content'),
  ('Coordinate a PH Workshop (2 Days)', 'Coordinate a 2-day PH workshop. Worth enough points to freely redeem any one of the five review sessions.', 15, 'fa-clipboard-list', 'Coordination');

insert into public.rewards (title, description, cost) values
  ('Alcohol Spray', 'A cleansing alcohol spray.', 2),
  ('MTH Audio', 'Meditation on Twin Hearts guided audio.', 3),
  ('Om Audio', 'Om meditation guided audio.', 3),
  ('GLS or EoG Book', 'Your choice of the GLS or EoG book.', 3),
  ('Full Body Chakra Scan (30 mins)', 'A 30-minute full body chakra scan.', 5),
  ('1:1 PH Session (30 mins)', 'A private 30-minute Pranic Healing session.', 5),
  ('1:1 PH Session (60 mins)', 'A private 60-minute Pranic Healing session.', 10),
  ('BPH (Level 1) Workshop', 'Basic Pranic Healing workshop.', 50),
  ('APH (Level 2) Workshop', 'Advanced Pranic Healing workshop.', 55),
  ('PSY (Level 3) Workshop', 'Pranic Psychotherapy workshop.', 60),
  ('AOHS Workshop', 'Achieving Oneness with the Higher Soul workshop.', 50),
  ('Arhatic Yoga Workshop', 'Arhatic Yoga workshop.', 70),
  ('BPH Review', 'Review session for Basic Pranic Healing.', 10),
  ('APH Review', 'Review session for Advanced Pranic Healing.', 15),
  ('PSY Review', 'Review session for Pranic Psychotherapy.', 15),
  ('AOHS Review', 'Review session for AOHS.', 10),
  ('AYP Review', 'Review session for Arhatic Yoga.', 15);
