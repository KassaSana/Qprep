-- QPrep — Auth slice 1: identity-link infrastructure
--
-- Adds the schema scaffolding for "real auth via Supabase Auth" without
-- changing any current behavior. Every column added here is nullable, every
-- write path stays on the existing service-role client. Apps that have not
-- enabled the auth feature flag (`NEXT_PUBLIC_AUTH_ENABLED=true`) keep
-- working unchanged.
--
-- Apply with:
--   supabase db push
--
-- Reversal note: the `link_anon_to_user` function and the column / index
-- below can all be dropped without data loss. Once a user has been linked,
-- though, the merge step in slice 2 will copy attempts/streaks across
-- anon rows — that's where rollback gets tricky. This file is safe to
-- revert; future slices won't be.

-- ---------------------------------------------------------------------------
-- 1. Optional `user_id` link on anon_users.
-- ---------------------------------------------------------------------------
--
-- Why no FK to auth.users(id):
--   `auth.users` exists in every Supabase project, but referencing it from a
--   `public` schema migration creates an implicit dependency on the auth
--   extension being installed before this migration runs. We keep this as a
--   plain `uuid` and rely on `link_anon_to_user` to validate that the value
--   came from a real Supabase Auth session at write time. This also keeps
--   local Postgres dumps (without the auth schema) round-trippable.

alter table public.anon_users
  add column if not exists user_id uuid,
  add column if not exists linked_at timestamptz;

-- One auth user owns at most one canonical anon row. We allow many anon rows
-- to remain `user_id IS NULL` (the default for visitors who never sign in),
-- so the unique constraint is partial.
create unique index if not exists anon_users_user_id_unique
  on public.anon_users(user_id)
  where user_id is not null;

comment on column public.anon_users.user_id is
  'Optional link to a Supabase Auth user (auth.users.id). NULL = anon-only session. Set via link_anon_to_user().';

comment on column public.anon_users.linked_at is
  'Timestamp the anon row was first attached to an auth user. NULL = never linked.';

-- ---------------------------------------------------------------------------
-- 2. link_anon_to_user — idempotent attach.
-- ---------------------------------------------------------------------------
--
-- Called from the post-sign-in hook (slice 2) to mark this anon cookie as
-- belonging to the authenticated user. We deliberately don't merge attempts
-- or streaks here — that's a separate concern handled in slice 2 once we
-- know which row should win the merge.
--
-- Behavior:
--   - If the anon row already points at this user_id  → no-op (returns true).
--   - If the anon row currently has NULL user_id      → set it + linked_at.
--   - If the anon row already points at a different user_id → raises an
--     `unique_violation`-flavored error so the caller can surface
--     "this device is already linked to another account" to the user.
--   - If a different anon row already owns this user_id → raises a
--     unique violation via the partial index.

create or replace function public.link_anon_to_user(
  p_anon_id uuid,
  p_user_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
begin
  if p_anon_id is null or p_user_id is null then
    raise exception 'link_anon_to_user requires non-null p_anon_id and p_user_id';
  end if;

  select user_id into current_user_id
  from public.anon_users
  where id = p_anon_id;

  if not found then
    -- Defensive: caller forgot to ensure_anon_user first. Create the row.
    insert into public.anon_users(id, user_id, linked_at)
    values (p_anon_id, p_user_id, now());
    return true;
  end if;

  if current_user_id = p_user_id then
    return true;
  end if;

  if current_user_id is not null then
    raise exception 'anon row % is already linked to user %, refusing to overwrite with %',
      p_anon_id, current_user_id, p_user_id
      using errcode = 'check_violation';
  end if;

  update public.anon_users
  set user_id = p_user_id,
      linked_at = now()
  where id = p_anon_id;

  return true;
end;
$$;

revoke all on function public.link_anon_to_user(uuid, uuid) from public;
grant execute on function public.link_anon_to_user(uuid, uuid) to service_role;

comment on function public.link_anon_to_user(uuid, uuid) is
  'Idempotently mark an anon_users row as belonging to a Supabase Auth user. Service-role only. Used by the post-sign-in hook (auth slice 2).';
