-- =====================================================================
-- Climate Change Awareness App — Supabase Schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- =====================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- USERS (extends auth.users via a public profile table)
-- ---------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  fullname text not null,
  email text unique not null,
  phone text,
  region text,
  district text,
  avatar text,
  latitude numeric,
  longitude numeric,
  push_token text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- ARTICLES (climate news)
-- ---------------------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image text,
  category text,
  source text,
  url text unique,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- BOOKMARKS
-- ---------------------------------------------------------------------
create table if not exists public.bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, article_id)
);

-- ---------------------------------------------------------------------
-- WEATHER CACHE (latest snapshot per region)
-- ---------------------------------------------------------------------
create table if not exists public.weather_cache (
  id uuid primary key default uuid_generate_v4(),
  region text not null,
  temperature numeric,
  humidity numeric,
  pressure numeric,
  rainfall numeric,
  wind_speed numeric,
  forecast jsonb,
  updated_at timestamptz not null default now(),
  unique (region)
);

-- ---------------------------------------------------------------------
-- WEATHER HISTORY
-- ---------------------------------------------------------------------
create table if not exists public.weather_history (
  id uuid primary key default uuid_generate_v4(),
  date date not null,
  temperature numeric,
  humidity numeric,
  rainfall numeric,
  pressure numeric,
  wind_speed numeric,
  region text not null
);

-- ---------------------------------------------------------------------
-- NOTIFICATIONS
-- ---------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'general' check (type in ('weather','flood','heat','disease','tip','news','general')),
  region text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- CLIMATE TIPS
-- ---------------------------------------------------------------------
create table if not exists public.climate_tips (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- DISEASE INFORMATION
-- ---------------------------------------------------------------------
create table if not exists public.disease_information (
  id uuid primary key default uuid_generate_v4(),
  disease_name text not null,
  symptoms text,
  prevention text,
  climate_relation text,
  recommended_action text
);

-- ---------------------------------------------------------------------
-- EDUCATIONAL CONTENT
-- ---------------------------------------------------------------------
create table if not exists public.educational_content (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text,
  content text,
  image text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- CLIMATE INITIATIVES (real Cameroon-focused organizations, with sources)
-- ---------------------------------------------------------------------
create table if not exists public.climate_initiatives (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  focus_area text,
  region text,
  source_url text not null,
  logo text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- FLOOD REPORTS
-- ---------------------------------------------------------------------
create table if not exists public.flood_reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  region text not null,
  division text,
  subdivision text,
  village text,
  latitude numeric,
  longitude numeric,
  description text,
  image_url text,
  severity text not null check (severity in ('Low','Medium','High','Critical')),
  status text not null default 'Pending' check (status in ('Pending','Verified','Rejected','Resolved')),
  created_at timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

alter table public.users enable row level security;
alter table public.bookmarks enable row level security;
alter table public.articles enable row level security;
alter table public.weather_cache enable row level security;
alter table public.weather_history enable row level security;
alter table public.notifications enable row level security;
alter table public.climate_tips enable row level security;
alter table public.disease_information enable row level security;
alter table public.educational_content enable row level security;
alter table public.climate_initiatives enable row level security;
alter table public.flood_reports enable row level security;

-- USERS: a person can read/update only their own profile
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);
drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);
drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
  for insert with check (auth.uid() = id);

-- BOOKMARKS: fully owned by the user
drop policy if exists "bookmarks_owner_all" on public.bookmarks;
create policy "bookmarks_owner_all" on public.bookmarks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ARTICLES / TIPS / DISEASE INFO / EDUCATIONAL CONTENT / WEATHER: public read
drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read" on public.articles
  for select using (true);
drop policy if exists "climate_tips_public_read" on public.climate_tips;
create policy "climate_tips_public_read" on public.climate_tips
  for select using (true);
drop policy if exists "disease_information_public_read" on public.disease_information;
create policy "disease_information_public_read" on public.disease_information
  for select using (true);
drop policy if exists "educational_content_public_read" on public.educational_content;
create policy "educational_content_public_read" on public.educational_content
  for select using (true);
drop policy if exists "climate_initiatives_public_read" on public.climate_initiatives;
create policy "climate_initiatives_public_read" on public.climate_initiatives
  for select using (true);
drop policy if exists "weather_cache_public_read" on public.weather_cache;
create policy "weather_cache_public_read" on public.weather_cache
  for select using (true);
drop policy if exists "weather_history_public_read" on public.weather_history;
create policy "weather_history_public_read" on public.weather_history
  for select using (true);

-- Writes to the above reference tables are done only via the backend's
-- service-role key, which bypasses RLS — no public write policies needed.

-- NOTIFICATIONS: user sees/updates only their own
drop policy if exists "notifications_owner_select" on public.notifications;
create policy "notifications_owner_select" on public.notifications
  for select using (auth.uid() = user_id);
drop policy if exists "notifications_owner_update" on public.notifications;
create policy "notifications_owner_update" on public.notifications
  for update using (auth.uid() = user_id);

-- FLOOD REPORTS: anyone authenticated can read verified reports;
-- a user can always see, edit, and delete their own (pending) reports
drop policy if exists "flood_reports_select_verified_or_own" on public.flood_reports;
create policy "flood_reports_select_verified_or_own" on public.flood_reports
  for select using (status = 'Verified' or auth.uid() = user_id);
drop policy if exists "flood_reports_insert_own" on public.flood_reports;
create policy "flood_reports_insert_own" on public.flood_reports
  for insert with check (auth.uid() = user_id);
drop policy if exists "flood_reports_update_own_pending" on public.flood_reports;
create policy "flood_reports_update_own_pending" on public.flood_reports
  for update using (auth.uid() = user_id and status = 'Pending');
drop policy if exists "flood_reports_delete_own_pending" on public.flood_reports;
create policy "flood_reports_delete_own_pending" on public.flood_reports
  for delete using (auth.uid() = user_id and status = 'Pending');

-- Admin verification/rejection/resolution of flood reports is done via the
-- backend using the Supabase service-role key (bypasses RLS). Add an
-- `is_admin` claim/table later if you want admin actions enforced in RLS too.

-- =====================================================================
-- INDEXES
-- =====================================================================
create index if not exists idx_articles_category on public.articles(category);
create index if not exists idx_articles_published_at on public.articles(published_at desc);
create index if not exists idx_flood_reports_region on public.flood_reports(region);
create index if not exists idx_flood_reports_status on public.flood_reports(status);
create index if not exists idx_weather_history_region_date on public.weather_history(region, date);
create index if not exists idx_notifications_user_read on public.notifications(user_id, read);
create index if not exists idx_users_region on public.users(region) where region is not null;
