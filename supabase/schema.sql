-- Sponsorship Tracker — Supabase schema
-- Run this once in your Supabase project: Dashboard → SQL Editor → New query → paste → Run.
--
-- ⚠️  This script drops and recreates the "sponsorships" and "app_settings" tables every
-- time it's run, so any data already in them will be wiped. That's intentional for first
-- setup (or fixing a broken partial run) — just don't re-run it later once you have real
-- data you care about in Supabase, or back it up first (Table Editor → export, or
-- `select * from sponsorships` in the SQL Editor).
--
-- Design: each sponsorship is stored as a single JSONB document (matching the shape the
-- app already uses in memory) inside one table, plus a few plain columns duplicated out
-- for fast filtering/sorting without needing to unpack JSONB on every query. This keeps
-- the app's existing nested data model (deliverables/approvals/tasks embedded per
-- sponsorship) intact, so almost none of the app's existing logic has to change.
--
-- Auth model: every signed-in user can read and write every row (single shared team
-- workspace, not per-user data). Add team members via
-- Dashboard → Authentication → Users → Add user (or Invite user).

create extension if not exists "pgcrypto";

-- Drop any existing versions first. Makes this script safe to re-run — if a previous
-- attempt failed partway through and left a table with the wrong columns (e.g. an
-- app_settings table missing its "id" column), "create table if not exists" would
-- silently skip it and every insert/query below would fail against the stale schema.
drop table if exists sponsorships cascade;
drop table if exists app_settings cascade;

-- ============================== SPONSORSHIPS ==============================
create table if not exists sponsorships (
  id text primary key,                 -- matches the app's sp.id (e.g. "sp-14")
  request_id text,                     -- duplicated out from data->>'requestId' for quick lookup
  stage text,                          -- duplicated out from data->>'stage' for filtering
  event_date date,                     -- duplicated out from data->>'eventDate' for sorting
  data jsonb not null,                 -- the full sponsorship object as the app uses it
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sponsorships_stage_idx on sponsorships (stage);
create index if not exists sponsorships_event_date_idx on sponsorships (event_date);

-- Keep request_id / stage / event_date in sync with the JSONB payload automatically,
-- and bump updated_at, whenever a row is inserted or updated.
create or replace function sponsorships_sync_columns()
returns trigger as $$
begin
  new.request_id := new.data->>'requestId';
  new.stage := new.data->>'stage';
  new.event_date := (new.data->>'eventDate')::date;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists sponsorships_sync_columns_trigger on sponsorships;
create trigger sponsorships_sync_columns_trigger
  before insert or update on sponsorships
  for each row execute function sponsorships_sync_columns();

alter table sponsorships enable row level security;

drop policy if exists "Authenticated users can read sponsorships" on sponsorships;
create policy "Authenticated users can read sponsorships"
  on sponsorships for select
  using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can insert sponsorships" on sponsorships;
create policy "Authenticated users can insert sponsorships"
  on sponsorships for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can update sponsorships" on sponsorships;
create policy "Authenticated users can update sponsorships"
  on sponsorships for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can delete sponsorships" on sponsorships;
create policy "Authenticated users can delete sponsorships"
  on sponsorships for delete
  using (auth.role() = 'authenticated');

-- ============================== SETTINGS ==============================
-- Single shared row for team-wide settings (follow-up thresholds, annual budget).
-- The app always reads/writes the row with id = 'default'.
create table if not exists app_settings (
  id text primary key default 'default',
  thresholds jsonb,
  annual_budget numeric,
  updated_at timestamptz not null default now()
);

alter table app_settings enable row level security;

drop policy if exists "Authenticated users can read settings" on app_settings;
create policy "Authenticated users can read settings"
  on app_settings for select
  using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can upsert settings" on app_settings;
create policy "Authenticated users can upsert settings"
  on app_settings for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can update settings" on app_settings;
create policy "Authenticated users can update settings"
  on app_settings for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into app_settings (id, thresholds, annual_budget)
values ('default', null, 2500000)
on conflict (id) do nothing;
