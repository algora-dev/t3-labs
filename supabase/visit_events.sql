-- Forensic visit tracking for the /custom-proposal lander (t3labs.tech).
-- One row per event. event='landing' rows are written server-side per request;
-- all other events come from the passive browser tracker via /api/visit-events.
-- RLS is ON with no policies: only the service role (server routes) can read/write.
-- Run this once in the Supabase SQL editor of the t3-labs project.

create table if not exists public.visit_events (
  id bigint generated always as identity primary key,
  visit_id text not null,
  event text not null,
  client_ts text,
  created_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create index if not exists visit_events_visit_idx on public.visit_events (visit_id, id);
create index if not exists visit_events_event_idx on public.visit_events (event, created_at desc);

alter table public.visit_events enable row level security;
