-- GoBeauty — professional & supplier lead capture (PRD v2 FR-006/FR-007).
-- Run in the Supabase SQL editor. Written only via the service-role API
-- route (/api/leads); no public read/write policies on purpose.
create table if not exists public.gobeauty_leads (
  id            uuid primary key default gen_random_uuid(),
  audience_type text not null check (audience_type in ('professional','supplier','consumer')),
  name          text not null,
  business_name text,
  contact       text not null,
  interest      text,
  message       text,
  source_page   text,
  status        text not null default 'new',
  created_at    timestamptz not null default now()
);

create index if not exists gobeauty_leads_created_at_idx on public.gobeauty_leads (created_at desc);
create index if not exists gobeauty_leads_status_idx on public.gobeauty_leads (status);

alter table public.gobeauty_leads enable row level security;
