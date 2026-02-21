create table public.user_exercise_preferences (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  exercise_id         uuid not null references public.exercises(id) on delete cascade,
  load_increment_kg   numeric(5,2),
  min_reps_override   int,
  max_reps_override   int,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id, exercise_id)
);

create index user_exercise_prefs_user_idx on public.user_exercise_preferences (user_id);

alter table public.user_exercise_preferences enable row level security;

create policy "Users manage their exercise preferences"
  on public.user_exercise_preferences for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create trigger user_exercise_prefs_updated_at
  before update on public.user_exercise_preferences
  for each row execute function public.set_updated_at();
