create table if not exists public.moderation_tasks (
  id text primary key,
  title text not null,
  description text not null,
  href text not null,
  kind text not null check (kind in ('case-study', 'content', 'inquiry', 'service')),
  priority text not null check (priority in ('low', 'medium', 'high')),
  status text not null check (status in ('Needs review', 'Scheduled', 'Published', 'In progress')),
  owner_id text,
  owner_name text,
  notes text,
  history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.moderation_tasks enable row level security;

create policy "Editors can read moderation tasks"
on public.moderation_tasks
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('editor', 'admin')
  )
);

create policy "Editors can update moderation tasks"
on public.moderation_tasks
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('editor', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('editor', 'admin')
  )
);

create or replace function public.handle_moderation_task_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists moderation_tasks_updated_at on public.moderation_tasks;

create trigger moderation_tasks_updated_at
before update on public.moderation_tasks
for each row
execute procedure public.handle_moderation_task_updated_at();
