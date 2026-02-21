-- Materialized view: estimated 1RM per user per exercise per day
-- Refresh after each session completes (via app logic or pg_cron)
create materialized view public.mv_exercise_1rm as
select
  s.user_id,
  we.exercise_id,
  we.variant_key,
  date_trunc('day', ws.started_at)::date as session_date,
  max(
    -- Epley formula: load * (1 + reps/30)
    st.effective_load_kg * (1.0 + st.reps_completed::numeric / 30.0)
  ) as estimated_1rm_kg
from public.sets st
join public.workout_exercises we on we.id = st.workout_exercise_id
join public.workout_sessions ws  on ws.id = we.session_id
join lateral (select ws.user_id) s on true
where
  st.is_completed = true
  and st.reps_completed between 1 and 15
  and st.effective_load_kg is not null
  and st.set_type = 'working'
group by s.user_id, we.exercise_id, we.variant_key, session_date;

create unique index mv_exercise_1rm_idx
  on public.mv_exercise_1rm (user_id, exercise_id, session_date)
  where variant_key = '{}';

create index mv_exercise_1rm_user_exercise_idx
  on public.mv_exercise_1rm (user_id, exercise_id, session_date desc);

-- Weekly volume view (for volume charts)
create or replace view public.v_weekly_volume as
select
  ws.user_id,
  we.exercise_id,
  ex.movement_pattern,
  ex.primary_muscles,
  date_trunc('week', ws.started_at)::date as week_start,
  sum(st.effective_load_kg * st.reps_completed)::numeric(10,2) as total_volume_kg,
  count(*) filter (where st.set_type = 'working') as working_set_count
from public.sets st
join public.workout_exercises we on we.id = st.workout_exercise_id
join public.workout_sessions ws  on ws.id = we.session_id
join public.exercises ex         on ex.id = we.exercise_id
where
  st.is_completed = true
  and ws.finished_at is not null
group by ws.user_id, we.exercise_id, ex.movement_pattern, ex.primary_muscles, week_start;

-- Function to refresh 1RM materialized view (call after session finishes)
create or replace function public.refresh_exercise_1rm()
returns void
language sql
security definer
as $$
  refresh materialized view concurrently public.mv_exercise_1rm;
$$;
