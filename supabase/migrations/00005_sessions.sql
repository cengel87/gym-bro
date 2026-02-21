create table public.workout_sessions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  template_id       uuid references public.templates(id) on delete set null,
  name              text,
  started_at        timestamptz not null default now(),
  finished_at       timestamptz,
  duration_seconds  int generated always as (
    case
      when finished_at is not null
        then extract(epoch from (finished_at - started_at))::int
      else null
    end
  ) stored,
  bodyweight_kg     numeric(5,2),
  notes             text,
  perceived_effort  int check (perceived_effort between 1 and 10),
  created_at        timestamptz not null default now()
);

create index sessions_user_id_idx on public.workout_sessions (user_id);
create index sessions_user_started_idx on public.workout_sessions (user_id, started_at desc);
create index sessions_template_id_idx on public.workout_sessions (template_id);

alter table public.workout_sessions enable row level security;

create policy "Users manage their own workout sessions"
  on public.workout_sessions for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Exercises performed in a session
create table public.workout_exercises (
  id                   uuid primary key default gen_random_uuid(),
  session_id           uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id          uuid not null references public.exercises(id) on delete restrict,
  template_exercise_id uuid references public.template_exercises(id) on delete set null,
  sort_order           int not null default 0,
  variant_key          jsonb not null default '{}',
  notes                text,
  created_at           timestamptz not null default now()
);

create index workout_exercises_session_id_idx on public.workout_exercises (session_id, sort_order);
create index workout_exercises_exercise_id_idx on public.workout_exercises (exercise_id);
create index workout_exercises_variant_gin_idx on public.workout_exercises using gin (variant_key);

alter table public.workout_exercises enable row level security;

create policy "Users manage their workout exercises via session ownership"
  on public.workout_exercises for all
  to authenticated
  using (
    exists (
      select 1 from public.workout_sessions s
      where s.id = session_id
        and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.workout_sessions s
      where s.id = session_id
        and s.user_id = auth.uid()
    )
  );

-- Individual sets (the leaf of the hierarchy)
create table public.sets (
  id                  uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid not null references public.workout_exercises(id) on delete cascade,
  set_number          int not null,
  set_type            text not null default 'working'
                      check (set_type in ('working','warmup','dropset','amrap')),

  -- Load model: use external_load_kg OR (bodyweight_kg + added_load_kg)
  external_load_kg    numeric(7,2),   -- barbell / dumbbell / cable / machine load
  bodyweight_kg       numeric(5,2),   -- user bodyweight snapshot
  added_load_kg       numeric(6,2),   -- weight added to bodyweight (negative = assisted)

  -- Derived effective load for charting and recommendations
  -- For bodyweight exercises: bodyweight_kg + coalesce(added_load_kg, 0)
  -- For external load:        external_load_kg
  effective_load_kg   numeric(7,2) generated always as (
    case
      when external_load_kg is not null then external_load_kg
      when bodyweight_kg is not null
        then bodyweight_kg + coalesce(added_load_kg, 0)
      else null
    end
  ) stored,

  reps_target         int,
  reps_completed      int,
  rpe                 numeric(3,1) check (rpe between 1 and 10),
  is_completed        boolean not null default false,
  completed_at        timestamptz,
  rest_seconds_taken  int,
  notes               text,
  created_at          timestamptz not null default now(),

  -- Prevent duplicate set_numbers per exercise
  unique (workout_exercise_id, set_number)
);

create index sets_workout_exercise_id_idx on public.sets (workout_exercise_id, set_number);
create index sets_effective_load_idx on public.sets (workout_exercise_id, effective_load_kg desc nulls last);

alter table public.sets enable row level security;

create policy "Users manage their sets via workout exercise → session ownership"
  on public.sets for all
  to authenticated
  using (
    exists (
      select 1
      from public.workout_exercises we
      join public.workout_sessions s on s.id = we.session_id
      where we.id = workout_exercise_id
        and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.workout_exercises we
      join public.workout_sessions s on s.id = we.session_id
      where we.id = workout_exercise_id
        and s.user_id = auth.uid()
    )
  );
