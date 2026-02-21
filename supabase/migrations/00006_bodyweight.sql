create table public.bodyweight_entries (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  weight_kg     numeric(5,2) not null,
  measured_at   date not null default current_date,
  notes         text,
  created_at    timestamptz not null default now(),
  unique (user_id, measured_at)
);

create index bodyweight_user_date_idx on public.bodyweight_entries (user_id, measured_at desc);

alter table public.bodyweight_entries enable row level security;

create policy "Users manage their bodyweight entries"
  on public.bodyweight_entries for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
