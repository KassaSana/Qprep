-- QPrep — Remove Finance topic + add target_roles
--
-- 1) Deletes all Finance-topic questions + any playlists that only existed for trader/finance content.
-- 2) Tightens the `questions.topic` check constraint to remove 'Finance'.
-- 3) Adds `target_roles` to `questions` to support role-based filtering in the UI.

-- ---------------------------------------------------------------------------
-- 1) Purge finance content (questions + playlist links)
-- ---------------------------------------------------------------------------

-- Remove any playlist links to finance-topic questions first.
delete from public.playlist_questions pq
using public.questions q
where pq.question_id = q.id
  and q.topic = 'Finance';

-- Remove finance-topic questions.
delete from public.questions
where topic = 'Finance';

-- Remove legacy finance playlists (static playlist slugs that no longer exist in code).
delete from public.playlists
where slug in ('quant-trader-core');

-- ---------------------------------------------------------------------------
-- 2) Remove 'Finance' from the topic constraint
-- ---------------------------------------------------------------------------

alter table public.questions
  drop constraint if exists questions_topic_check;

alter table public.questions
  add constraint questions_topic_check check (topic in (
    'Probability','Brainteasers','Statistics','Pure Math',
    'Concurrency','LLD','System Design','Algorithms','Data Structures'
  ));

-- ---------------------------------------------------------------------------
-- 3) Add target_roles (Gemini schema)
-- ---------------------------------------------------------------------------

alter table public.questions
  add column if not exists target_roles text[] not null default '{All}';

alter table public.questions
  drop constraint if exists questions_target_roles_check;

-- All entries must be in the allowed set.
alter table public.questions
  add constraint questions_target_roles_check
  check (target_roles <@ array['Trader','Dev','Researcher','All']::text[]);

