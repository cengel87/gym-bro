create table public.exercises (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  aliases             text[] not null default '{}',
  primary_muscles     text[] not null default '{}',
  secondary_muscles   text[] not null default '{}',
  equipment           text not null check (equipment in ('barbell','dumbbell','bodyweight','cable','machine','kettlebell','band','other')),
  movement_pattern    text not null check (movement_pattern in ('squat','hinge','push_horizontal','push_vertical','pull_horizontal','pull_vertical','carry','core','isolation')),
  force_type          text check (force_type in ('push','pull','static')),
  mechanics           text check (mechanics in ('compound','isolation')),
  supports_bodyweight boolean not null default false,
  supports_incline    boolean not null default false,
  supports_grip       boolean not null default false,
  supports_stance     boolean not null default false,
  default_rep_range   int4range default '[8,12]',
  default_sets        int not null default 3,
  tags                text[] not null default '{}',
  created_at          timestamptz not null default now(),
  is_custom           boolean not null default false,
  created_by          uuid references auth.users(id) on delete set null
);

-- Unique constraint: system exercises have unique names; custom exercises can share names
create unique index exercises_system_name_unique
  on public.exercises (name)
  where is_custom = false;

-- GiST index for trigram search across name
create index exercises_name_trgm_idx
  on public.exercises
  using gist (name gist_trgm_ops);

create index exercises_equipment_idx on public.exercises (equipment);
create index exercises_movement_pattern_idx on public.exercises (movement_pattern);
create index exercises_custom_idx on public.exercises (is_custom, created_by);
create index exercises_primary_muscles_idx on public.exercises using gin (primary_muscles);
create index exercises_tags_idx on public.exercises using gin (tags);

-- RLS
alter table public.exercises enable row level security;

create policy "Authenticated users can read all non-custom exercises and their own custom exercises"
  on public.exercises for select
  to authenticated
  using (is_custom = false or created_by = auth.uid());

create policy "Users can insert their own custom exercises"
  on public.exercises for insert
  to authenticated
  with check (is_custom = true and created_by = auth.uid());

create policy "Users can update their own custom exercises"
  on public.exercises for update
  to authenticated
  using (is_custom = true and created_by = auth.uid())
  with check (is_custom = true and created_by = auth.uid());

create policy "Users can delete their own custom exercises"
  on public.exercises for delete
  to authenticated
  using (is_custom = true and created_by = auth.uid());
