-- QPrep — Unified question bank migration
--
-- Reshapes the schema from per-track question routing into a single
-- topic-tagged bank with curated playlists, plus three new question kinds
-- (mcq, freeform, code) and a per-question metadata payload (`answer_meta`).
--
-- Apply with:
--   supabase db push
-- or copy/paste into the Supabase SQL editor (after 0001_init.sql).
--
-- Migration is **additive** where possible:
--   - `track` is kept as a nullable column for back-compat; new code uses `topic`.
--   - existing legacy `researcher_level / trader_level / dev_level` columns on
--     `anon_users` stay untouched; per-topic levels live in a new `topic_levels`
--     jsonb so old reads keep working.

-- ---------------------------------------------------------------------------
-- 1. Topic / companies / answer_meta / is_premium on questions
-- ---------------------------------------------------------------------------

alter table public.questions
  add column if not exists topic text,
  add column if not exists companies text[] not null default '{}',
  add column if not exists answer_meta jsonb,
  add column if not exists is_premium boolean not null default false;

-- Backfill `topic` for rows seeded under the v1 (track-only) schema.
-- The mapping mirrors the categorization that the new content/seed/* files use,
-- so existing rows survive the migration and slot into the new bank cleanly.
update public.questions
set topic = case
  when slug in (
    'two-dice-sum-seven','monty-hall-switch','two-children-at-least-one-boy',
    'disease-test-bayes','expected-rolls-until-six','expected-flips-until-hh',
    'expected-flips-until-ht','max-of-two-dice','coupon-collector-four',
    'birthday-23','ace-in-five-card-hand','stick-broken-triangle',
    'hat-check-fixed-points','geometric-first-head-third-flip',
    'random-walk-return-step-2','gamblers-ruin-fair','prob-up-after-two-signals'
  ) then 'Probability'
  when slug in (
    'variance-binomial-100-half','ev-uniform-zero-one-square','ev-min-two-uniforms'
  ) then 'Statistics'
  when slug in (
    'secretary-named-theorem','mental-math-eight-percent-of-250',
    'mental-math-1-point-5-percent-of-640','coin-game-advantage'
  ) then 'Brainteasers'
  when slug in (
    'break-even-win-rate-even-loss','mid-from-bid-ask','edge-after-spread',
    'expected-fill-value','call-option-payoff','put-option-payoff',
    'inventory-weighted-mid','spread-in-bps'
  ) then 'Finance'
  -- Heuristic fallback for any rows the slug list above missed.
  when 'mental-math' = any(tags) then 'Brainteasers'
  when 'options' = any(tags) or 'market-making' = any(tags) or 'spread' = any(tags) then 'Finance'
  when 'variance' = any(tags) or 'order-statistics' = any(tags) then 'Statistics'
  when track = 'trader' then 'Finance'
  else 'Probability'
end
where topic is null;

-- Now lock topic NOT NULL with the canonical check constraint.
alter table public.questions
  alter column topic set not null;

alter table public.questions
  drop constraint if exists questions_topic_check;
alter table public.questions
  add constraint questions_topic_check check (topic in (
    'Probability','Brainteasers','Statistics','Pure Math','Finance',
    'Concurrency','LLD','System Design','Algorithms','Data Structures'
  ));

-- ---------------------------------------------------------------------------
-- 2. Widen answer_kind, relax answer_value, drop track NOT NULL
-- ---------------------------------------------------------------------------

alter table public.questions
  drop constraint if exists questions_answer_kind_check;
alter table public.questions
  add constraint questions_answer_kind_check check (
    answer_kind in ('numeric','fraction','exact','mcq','freeform','code')
  );

alter table public.questions
  alter column answer_value drop not null;

alter table public.questions
  alter column track drop not null;

-- ---------------------------------------------------------------------------
-- 3. topic_levels on anon_users for per-topic XP-style progress
-- ---------------------------------------------------------------------------

alter table public.anon_users
  add column if not exists topic_levels jsonb not null default '{}'::jsonb;

-- ---------------------------------------------------------------------------
-- 4. Indexes that match the new query patterns
-- ---------------------------------------------------------------------------

create index if not exists questions_topic_difficulty_idx
  on public.questions (topic, difficulty);
create index if not exists questions_companies_gin
  on public.questions using gin (companies);

-- ---------------------------------------------------------------------------
-- 5. playlists + playlist_questions
-- ---------------------------------------------------------------------------

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  hero_emoji text,
  is_premium boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.playlist_questions (
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  position int not null default 0,
  primary key (playlist_id, question_id)
);

create index if not exists playlist_questions_playlist_position_idx
  on public.playlist_questions (playlist_id, position);

-- ---------------------------------------------------------------------------
-- 6. grade_cache for freeform AI grading
--
-- Identical (question_id, sha256(answer)) pairs reuse a previously computed
-- pass/fail decision so we never re-grade the same submission. The provider
-- column is informational so we can audit grading drift across models.
-- ---------------------------------------------------------------------------

create table if not exists public.grade_cache (
  question_id uuid not null references public.questions(id) on delete cascade,
  answer_hash text not null,
  passed boolean not null,
  feedback text not null,
  provider text not null,
  created_at timestamptz not null default now(),
  primary key (question_id, answer_hash)
);

-- ---------------------------------------------------------------------------
-- 7. award_correct_v2: topic-aware variant of award_correct
--
-- Increments total_points + streak just like the original, but bumps the
-- relevant entry inside `anon_users.topic_levels` instead of the legacy
-- per-track *_level columns. The original `award_correct(p_anon, p_points, p_track)`
-- function from 0001_init.sql is left in place so any in-flight callers still
-- compile; new code paths use this v2.
-- ---------------------------------------------------------------------------

create or replace function public.award_correct_v2(
  p_anon uuid,
  p_points int,
  p_topic text
) returns void
language plpgsql
as $$
declare
  v_last timestamptz;
  v_total int;
  v_level int;
begin
  insert into public.anon_users (id) values (p_anon)
  on conflict (id) do nothing;

  select max(created_at) into v_last
  from public.attempts
  where anon_user_id = p_anon and is_correct = true;

  update public.anon_users
  set total_points = total_points + p_points,
      streak_count = case
        when v_last is null or v_last < now() - interval '36 hours' then 1
        else streak_count + 1
      end,
      last_seen_at = now()
  where id = p_anon
  returning total_points into v_total;

  v_level := 1 + floor(v_total / 100.0);

  -- jsonb_set to update one topic key. Using `coalesce` so first-write works.
  update public.anon_users
  set topic_levels = jsonb_set(
        coalesce(topic_levels, '{}'::jsonb),
        array[p_topic],
        to_jsonb(greatest(
          v_level,
          coalesce((topic_levels ->> p_topic)::int, 1)
        )),
        true
      )
  where id = p_anon;
end
$$;
