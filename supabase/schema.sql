-- GoBeauty — photo analysis feature schema.
-- Run in the Supabase SQL editor (or `supabase db push`) for the shared project.

-- ---------------------------------------------------------------------------
-- analyses: one row per photo a signed-in user submits for AI analysis.
-- The structured result (what / why / how / how_much / recommendation /
-- next_steps) is stored in `analysis` as JSONB so the schema can evolve.
-- ---------------------------------------------------------------------------
create table if not exists public.analyses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users (id) on delete set null,
  image_url   text,
  title       text not null,
  category    text not null default 'Beauty',
  prompt      text,
  analysis    jsonb not null,
  created_at  timestamptz not null default now()
);

create index if not exists analyses_created_at_idx on public.analyses (created_at desc);
create index if not exists analyses_user_id_idx on public.analyses (user_id);

alter table public.analyses enable row level security;

-- The "What others are asking" feed is public: anyone may read.
drop policy if exists "analyses are publicly readable" on public.analyses;
create policy "analyses are publicly readable"
  on public.analyses for select
  using (true);

-- Writes happen only from the server (service_role bypasses RLS), so no
-- insert/update/delete policy is granted to anon or authenticated roles.

-- ---------------------------------------------------------------------------
-- Storage: a public bucket for the uploaded photos. The server uploads with
-- the service role; the public read policy lets the feed + Claude fetch them.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('analysis-images', 'analysis-images', true)
on conflict (id) do nothing;

drop policy if exists "analysis images are publicly readable" on storage.objects;
create policy "analysis images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'analysis-images');
