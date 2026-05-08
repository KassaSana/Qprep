-- QPrep — Add Dev wave topics
--
-- Extends the canonical `questions.topic` check constraint to include:
-- - 'Systems'
-- - 'C++ Deep Dives'
--
-- This is required for seeding new Dev wave packs.

alter table public.questions
  drop constraint if exists questions_topic_check;

alter table public.questions
  add constraint questions_topic_check check (topic in (
    'Probability',
    'Brainteasers',
    'Statistics',
    'Pure Math',
    'Concurrency',
    'Systems',
    'LLD',
    'System Design',
    'Algorithms',
    'Data Structures',
    'C++ Deep Dives'
  ));

