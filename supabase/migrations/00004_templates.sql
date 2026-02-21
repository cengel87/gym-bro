create table public.templates (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  program_id    uuid references public.programs(id) on delete set null,
  name          text not null,
  description   text,
  day_of_week   int check (day_of_week between 0 and 6),
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index templates_user_id_idx on public.templates (user_id);
create index templates_program_id_idx on public.templates (program_id);

alter table public.templates enable row level security;

create policy "Users manage their own templates"
  on public.templates for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create trigger templates_updated_at
  before update on public.templates
  for each row execute function public.set_updated_at();

-- Template exercises: ordered exercises within a template
create table public.template_exercises (
  id                   uuid primary key default gen_random_uuid(),
  template_id          uuid not null references public.templates(id) on delete cascade,
  exercise_id          uuid not null references public.exercises(id) on delete restrict,
  sort_order           int not null default 0,
  target_sets          int not null default 3,
  min_reps             int not null default 8,
  max_reps             int not null default 12,
  rest_seconds         int not null default 120,
  -- Variant config: {"incline_deg": 30, "grip": "wide", "stance": "sumo"}
  variant_key          jsonb not null default '{}',
  notes                text,
  created_at           timestamptz not null default now()
);

create index template_exercises_template_id_idx on public.template_exercises (template_id, sort_order);
create index template_exercises_exercise_id_idx on public.template_exercises (exercise_id);
create index template_exercises_variant_idx on public.template_exercises using gin (variant_key);

alter table public.template_exercises enable row level security;

create policy "Users manage their template exercises via template ownership"
  on public.template_exercises for all
  to authenticated
  using (
    exists (
      select 1 from public.templates t
      where t.id = template_id
        and t.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.templates t
      where t.id = template_id
        and t.user_id = auth.uid()
    )
  );
