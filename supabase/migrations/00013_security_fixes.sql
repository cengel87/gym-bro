-- Security hardening to address Supabase advisor warnings
-- Safe to re-run (all statements use CREATE OR REPLACE / IF NOT EXISTS / ALTER)

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Fix: v_weekly_volume uses SECURITY DEFINER semantics by default.
--    Switch to SECURITY INVOKER so RLS of the querying user is enforced.
-- ─────────────────────────────────────────────────────────────────────────────
alter view public.v_weekly_volume set (security_invoker = true);


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Fix: Functions have mutable search_path (allows search_path hijacking).
--    Pin search_path = '' and use fully-qualified names inside.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.refresh_exercise_1rm()
returns void
language sql
security definer
set search_path = ''
as $$
  refresh materialized view concurrently public.mv_exercise_1rm;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Fix: pg_trgm and unaccent extensions installed in public schema.
--    Move them to the extensions schema (already in search_path via config).
--    We must drop and recreate the GIN trigram index with the qualified
--    operator class name after moving the extension.
-- ─────────────────────────────────────────────────────────────────────────────
create schema if not exists extensions;

-- Drop the trigram index that references the public-schema operator class
drop index if exists public.exercises_name_trgm;

-- Move extensions
alter extension pg_trgm  set schema extensions;
alter extension unaccent set schema extensions;

-- Recreate the GIN index referencing the operator class in its new schema
create index if not exists exercises_name_trgm
  on public.exercises using gin(name extensions.gin_trgm_ops);


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Fix: mv_exercise_1rm materialized view is directly accessible via the
--    Data API (PostgREST) without RLS filtering. Materialized views cannot
--    have row-level security, so we:
--      a) Revoke direct PostgREST access to the raw materialized view.
--      b) Expose a security-invoker view that filters to auth.uid() only.
-- ─────────────────────────────────────────────────────────────────────────────
revoke select on public.mv_exercise_1rm from anon, authenticated;

create or replace view public.exercise_1rm_estimates
  with (security_invoker = true)
as
  select * from public.mv_exercise_1rm
  where user_id = auth.uid();

grant select on public.exercise_1rm_estimates to authenticated;
