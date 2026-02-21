create table public.user_settings (
  user_id               uuid primary key references auth.users(id) on delete cascade,
  unit_system           text not null default 'kg' check (unit_system in ('kg','lbs')),
  theme                 text not null default 'dark' check (theme in ('light','dark','system')),
  aggressiveness        int not null default 2 check (aggressiveness between 1 and 3),
  default_rest_seconds  int not null default 120,
  plateau_threshold     int not null default 3,
  auto_deload_enabled   boolean not null default true,
  deload_scale_pct      numeric(4,2) not null default 0.10,
  rest_timer_enabled    boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "Users manage their own settings"
  on public.user_settings for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create trigger user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();

-- Auto-create settings row on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
