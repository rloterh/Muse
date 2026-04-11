create extension if not exists pgcrypto;

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('stripe', 'system')),
  event_type text not null,
  label text not null,
  detail text not null,
  status text not null check (status in ('pending', 'paid', 'failed', 'active', 'canceled', 'draft')),
  customer_name text,
  plan_id text check (plan_id in ('discovery-sprint', 'launch-program', 'embedded-partnership')),
  subscription_id text,
  amount integer,
  currency text,
  stripe_event_id text unique,
  payload jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists billing_events_created_at_idx on public.billing_events (created_at desc);
create index if not exists billing_events_plan_id_idx on public.billing_events (plan_id);
create index if not exists billing_events_subscription_id_idx on public.billing_events (subscription_id);

alter table public.billing_events enable row level security;

drop policy if exists "Authenticated users can view billing events" on public.billing_events;
create policy "Authenticated users can view billing events"
on public.billing_events
for select
to authenticated
using (true);

drop policy if exists "Service role manages billing events" on public.billing_events;
create policy "Service role manages billing events"
on public.billing_events
for all
to service_role
using (true)
with check (true);
