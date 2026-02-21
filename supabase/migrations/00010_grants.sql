-- Grant schema usage
grant usage on schema public to anon, authenticated;

-- exercises: anon can read system exercises
grant select on public.exercises to anon;
grant select, insert, update, delete on public.exercises to authenticated;

-- All user-owned tables: authenticated only
grant select, insert, update, delete on public.programs to authenticated;
grant select, insert, update, delete on public.templates to authenticated;
grant select, insert, update, delete on public.template_exercises to authenticated;
grant select, insert, update, delete on public.workout_sessions to authenticated;
grant select, insert, update, delete on public.workout_exercises to authenticated;
grant select, insert, update, delete on public.sets to authenticated;
grant select, insert, update, delete on public.bodyweight_entries to authenticated;
grant select, insert, update, delete on public.user_settings to authenticated;
grant select, insert, update, delete on public.user_exercise_preferences to authenticated;

-- Views
grant select on public.v_weekly_volume to authenticated;
grant select on public.mv_exercise_1rm to authenticated;

-- Functions
grant execute on function public.refresh_exercise_1rm() to authenticated;
