-- QPrep initial schema
-- Apply with:
--   supabase db push
-- or copy/paste into the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- anon_users: cookie-backed identities.
-- The id is supplied by the client (UUID set by Next.js middleware) so the
-- same cookie value can be reused if/when we layer real auth on top later.
-- ---------------------------------------------------------------------------
create table if not exists public.anon_users (
  id uuid primary key,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  streak_count int not null default 0,
  total_points int not null default 0,
  researcher_level int not null default 1,
  trader_level int not null default 1,
  dev_level int not null default 1
);

-- ---------------------------------------------------------------------------
-- questions: a single bank, multi-track via the `track` column.
-- prompt_md / solution_md may contain inline ($...$) and block ($$...$$) LaTeX.
-- answer_kind:
--   numeric  -> answer_value parses as a float, compared with answer_tolerance
--   fraction -> answer_value like "3/8", normalized to a float for comparison
--   exact    -> case-insensitive string compare on a normalized form
-- ---------------------------------------------------------------------------
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  track text not null check (track in ('researcher', 'trader', 'dev')),
  title text not null,
  prompt_md text not null,
  solution_md text,
  answer_kind text not null check (answer_kind in ('numeric', 'fraction', 'exact')),
  answer_value text not null,
  answer_tolerance numeric,
  difficulty int not null default 1 check (difficulty between 1 and 5),
  tags text[] not null default '{}',
  source text,
  created_at timestamptz not null default now()
);

create index if not exists questions_track_difficulty_idx on public.questions (track, difficulty);
create index if not exists questions_tags_gin on public.questions using gin (tags);

-- ---------------------------------------------------------------------------
-- attempts: one row per submitted answer (correct or not).
-- hint_levels_used is the highest hint level revealed before the user submitted.
-- ---------------------------------------------------------------------------
create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  anon_user_id uuid not null references public.anon_users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  submitted_answer text not null,
  is_correct boolean not null,
  hint_levels_used int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists attempts_user_created_idx
  on public.attempts (anon_user_id, created_at desc);
create index if not exists attempts_question_idx
  on public.attempts (question_id);

-- ---------------------------------------------------------------------------
-- hints_cache: dedupes Claude calls.
-- Keyed by (question_id, error_signature, level) where error_signature is a
-- stable hash of the normalized wrong answer + level. Repeat mistakes get the
-- same hint without another model call.
-- ---------------------------------------------------------------------------
create table if not exists public.hints_cache (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  error_signature text not null,
  level int not null check (level between 1 and 3),
  hint_text text not null,
  created_at timestamptz not null default now(),
  unique (question_id, error_signature, level)
);

-- ---------------------------------------------------------------------------
-- nudge_usage: per-day rate limiting bucket per anon user.
-- ---------------------------------------------------------------------------
create table if not exists public.nudge_usage (
  anon_user_id uuid not null references public.anon_users(id) on delete cascade,
  day date not null,
  count int not null default 0,
  primary key (anon_user_id, day)
);

-- ---------------------------------------------------------------------------
-- helpful upserts for app code
-- ---------------------------------------------------------------------------

-- Increment nudge usage for today, returning the new count.
create or replace function public.bump_nudge_usage(p_anon uuid)
returns int
language plpgsql
as $$
declare
  v_count int;
begin
  insert into public.nudge_usage (anon_user_id, day, count)
  values (p_anon, current_date, 1)
  on conflict (anon_user_id, day)
  do update set count = public.nudge_usage.count + 1
  returning count into v_count;
  return v_count;
end
$$;

-- Award points and update streak when an attempt is correct.
-- Streak resets to 1 if the previous correct attempt was more than 36 hours ago.
create or replace function public.award_correct(p_anon uuid, p_points int)
returns void
language plpgsql
as $$
declare
  v_last timestamptz;
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
  where id = p_anon;
end
$$;
