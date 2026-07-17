-- GoBeauty — custom phone OTP for sign-in / sign-up SMS.
-- Codes are hashed (HMAC) server-side; table is service-role only (RLS on, no grants).
-- Each OTP request also records the user's affirmative SMS consent evidence.
create table if not exists public.gobeauty_phone_otps (
  id                    uuid primary key default gen_random_uuid(),
  phone                 text not null,
  code_hash             text not null,
  attempts              int not null default 0,
  consumed_at           timestamptz,
  expires_at            timestamptz not null,
  sms_consent_at        timestamptz,
  sms_consent_version   text,
  sms_consent_source    text,
  created_at            timestamptz not null default now()
);

-- Safe to run against an existing installation.
alter table public.gobeauty_phone_otps
  add column if not exists sms_consent_at timestamptz,
  add column if not exists sms_consent_version text,
  add column if not exists sms_consent_source text;

create index if not exists gobeauty_phone_otps_phone_created_idx
  on public.gobeauty_phone_otps (phone, created_at desc);

alter table public.gobeauty_phone_otps enable row level security;
