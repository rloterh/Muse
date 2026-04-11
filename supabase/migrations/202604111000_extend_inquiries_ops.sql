alter table public.inquiries
add column if not exists assigned_to_name text,
add column if not exists next_touch_at timestamptz,
add column if not exists history jsonb not null default '[]'::jsonb;
