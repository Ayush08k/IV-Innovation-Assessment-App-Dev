-- ============================================================
-- IV Innovations BMI Tracker — Supabase SQL Migration
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- ─── Enable UUID extension ────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── PROFILES TABLE ──────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  gender      text not null check (gender in ('male', 'female', 'other')),
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Index for fast lookups by owner
create index if not exists profiles_owner_id_idx on public.profiles(owner_id);

-- ─── WEIGHT ENTRIES TABLE ─────────────────────────────────────
create table if not exists public.weight_entries (
  id           uuid primary key default uuid_generate_v4(),
  profile_id   uuid not null references public.profiles(id) on delete cascade,
  weight_kg    numeric(6, 2) not null check (weight_kg > 0),
  height_cm    numeric(6, 2) not null check (height_cm > 0),
  bmi          numeric(5, 2) not null check (bmi > 0),
  recorded_at  timestamptz not null default now()
);

-- Index for fast time-ordered queries per profile
create index if not exists weight_entries_profile_recorded_idx
  on public.weight_entries(profile_id, recorded_at desc);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
-- DIP: Security is enforced at the DB level, not scattered in application code.

alter table public.profiles enable row level security;
alter table public.weight_entries enable row level security;

-- Profiles: users can only see/edit their own profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (owner_id = auth.uid());

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (owner_id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  using (owner_id = auth.uid());

create policy "profiles_delete_own"
  on public.profiles for delete
  using (owner_id = auth.uid());

-- Weight entries: users can only see/edit entries for their own profiles
create policy "weight_entries_select_own"
  on public.weight_entries for select
  using (
    profile_id in (
      select id from public.profiles where owner_id = auth.uid()
    )
  );

create policy "weight_entries_insert_own"
  on public.weight_entries for insert
  with check (
    profile_id in (
      select id from public.profiles where owner_id = auth.uid()
    )
  );

create policy "weight_entries_delete_own"
  on public.weight_entries for delete
  using (
    profile_id in (
      select id from public.profiles where owner_id = auth.uid()
    )
  );

-- ─── AUTO-CREATE PRIMARY PROFILE ON SIGNUP ───────────────────
-- When a new user signs up, automatically create their first profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (owner_id, name, gender, is_primary)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'male',
    true
  );
  return new;
end;
$$;

-- Attach trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
