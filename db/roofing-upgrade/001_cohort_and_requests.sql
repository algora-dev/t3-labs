-- Run once in Supabase SQL Editor before exposing the campaign URL.
-- Only the server with the service-role key should read the cohort table or write submissions.
create table if not exists public.roofing_upgrade_cohorts (
  id text primary key,
  capacity integer not null check (capacity > 0 and capacity <= 100),
  confirmed_count integer not null default 0 check (confirmed_count >= 0 and confirmed_count <= capacity),
  status text not null default 'open' check (status in ('open','closed')),
  pricing_phase text not null default 'early' check (pricing_phase in ('early','later')),
  updated_at timestamptz not null default now()
);
create table if not exists public.roofing_upgrade_requests (
  id text primary key,
  cohort_id text not null references public.roofing_upgrade_cohorts(id),
  created_at timestamptz not null default now(),
  status text not null default 'requested' check (status in ('requested','accepted','declined','cancelled')),
  plan text not null,
  email text not null,
  website text,
  country text,
  improvements jsonb not null default '[]',
  marketing jsonb not null default '[]',
  team_size text,
  quote_process text,
  preferred_format text,
  notes text,
  attribution jsonb not null default '{}'
);
create index if not exists roofing_upgrade_requests_cohort_created on public.roofing_upgrade_requests(cohort_id,created_at desc);
create index if not exists roofing_upgrade_requests_email on public.roofing_upgrade_requests(email);
alter table public.roofing_upgrade_cohorts enable row level security;
alter table public.roofing_upgrade_requests enable row level security;
-- No public RLS policies: the only access path is a Next.js server route using the service role.
insert into public.roofing_upgrade_cohorts(id,capacity,confirmed_count,status,pricing_phase)
values ('first-cohort-2026-11',10,0,'open','early')
on conflict (id) do nothing;

-- V12 uses MANUAL, one-file availability for display:
-- Edit config/roofing-upgrade-cohort.json -> spotsAvailable, commit and redeploy.
-- This column (confirmed_count) is NOT read by the website availability endpoint.
-- You may keep it in sync for internal reporting, but updating SQL alone will
-- NOT alter the public counter.
-- For future cohorts, insert a NEW row, update cohortId in the JSON configuration,
-- set the pricingPhase and update visible first-cohort copy as appropriate.
