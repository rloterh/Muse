create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  website text,
  region text,
  budget text,
  timeline text,
  project_focus text,
  referral_source text,
  services text[] not null default '{}',
  goals text,
  message text,
  consent boolean not null default false,
  source text,
  status text not null default 'New' check (status in ('New', 'Qualified', 'Discovery scheduled', 'Proposal drafted')),
  routing jsonb not null default '{}'::jsonb,
  notes text,
  attribution jsonb not null default '{}'::jsonb,
  notification_delivered boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.inquiries enable row level security;

create policy "Editors can read inquiries"
on public.inquiries
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

create policy "Editors can update inquiries"
on public.inquiries
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

create or replace function public.handle_inquiry_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists inquiries_updated_at on public.inquiries;

create trigger inquiries_updated_at
before update on public.inquiries
for each row
execute procedure public.handle_inquiry_updated_at();
