create table public.programs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  description   text,
  days_per_week int check (days_per_week between 1 and 7),
  is_active     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index programs_user_id_idx on public.programs (user_id);

alter table public.programs enable row level security;

create policy "Users manage their own programs"
  on public.programs for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger programs_updated_at
  before update on public.programs
  for each row execute function public.set_updated_at();
