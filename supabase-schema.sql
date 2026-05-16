-- Supabase Schema for BCA Learn

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop existing tables/triggers to prevent "already exists" errors
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists user_progress cascade;
drop table if exists profiles cascade;

-- 1. Profiles Table (Extends Supabase Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. User Progress Table
-- Tracks which lessons a user has completed
create table user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  course_id text not null, -- Links to our static COURSES or FUTURE_TOPICS ids
  module_idx integer not null,
  lesson_idx integer not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id, module_idx, lesson_idx)
);

-- RLS (Row Level Security) Policies

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table user_progress enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- User Progress Policies
create policy "Users can view their own progress."
  on user_progress for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own progress."
  on user_progress for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own progress."
  on user_progress for delete
  using ( auth.uid() = user_id );

-- Create a trigger to automatically create a profile for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Lessons Content Table
drop table if exists lessons cascade;

create table lessons (
  id uuid default uuid_generate_v4() primary key,
  course_id text not null,
  module_idx integer not null,
  lesson_idx integer not null,
  title text not null,
  content text, -- Markdown content goes here
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(course_id, module_idx, lesson_idx)
);

-- RLS for Lessons
alter table lessons enable row level security;

create policy "Anyone can view lessons"
  on lessons for select using (true);

create policy "Only admins can insert lessons"
  on lessons for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can update lessons"
  on lessons for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can delete lessons"
  on lessons for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
