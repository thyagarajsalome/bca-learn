-- ============================================
-- BCALearn Admin System Setup
-- ============================================
-- Run this to add admin functionality to your existing database
-- ============================================

-- Step 1: Add role column to profiles table
alter table profiles
add column if not exists role text default 'student'
check (role in ('student', 'admin', 'instructor'));

-- Step 2: Create admin-specific policies
drop policy if exists "Users can view/edit own profile" on profiles;
create policy "Users can view/edit own profile" on profiles
  for all using (auth.uid() = id);

-- Step 3: Create policy for admin access
create policy "Admins can view all profiles" on profiles
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Step 4: Create storage bucket for PDFs
-- Note: Run this in Supabase Storage section, not SQL editor
-- Bucket name: lesson-pdfs
-- Public access: true

-- Step 5: Create admin management functions
create or replace function make_admin(user_id uuid)
returns void as $$
begin
  update profiles set role = 'admin' where id = user_id;
end;
$$ language sql security definer;

-- Step 6: Create function to check if user is admin
create or replace function is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where id = user_id and role = 'admin'
  );
end;
$$ language sql security definer;

-- Step 7: Make yourself admin (replace with your actual user ID after first signup)
-- Uncomment and run this after you create your account:
-- select make_admin('YOUR_USER_ID_HERE');

-- Step 8: Create admin content management policies
-- Allow admins to manage all modules and lessons
drop policy if exists "Admins can manage modules" on modules;
create policy "Admins can manage modules" on modules
  for all using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Admins can manage lessons" on lessons;
create policy "Admins can manage lessons" on lessons
  for all using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Step 9: Enable RLS on modules and lessons if not already enabled
alter table modules enable row level security;
alter table lessons enable row level security;

-- Step 10: Create policies for regular users (read-only)
create policy "Anyone can view published modules" on modules
  for select using (is_published = true);

create policy "Anyone can view published lessons" on lessons
  for select using (is_published = true);

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if admin functions exist
-- SELECT routine_name, routine_type
-- FROM information_schema.routines
-- WHERE routine_schema = 'public'
-- AND routine_name IN ('make_admin', 'is_admin');

-- Check profiles table structure
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'profiles';

-- ============================================
-- USAGE INSTRUCTIONS
-- ============================================

-- 1. After creating your account, get your user ID from the profiles table:
-- SELECT id, email FROM auth.users;
-- OR
-- SELECT id, name FROM profiles;

-- 2. Make yourself admin:
-- select make_admin('YOUR_USER_ID_HERE');

-- 3. Verify admin status:
-- SELECT id, name, role FROM profiles WHERE role = 'admin';

-- 4. Set up Supabase Storage:
-- - Go to Storage section in Supabase Dashboard
-- - Create new bucket: "lesson-pdfs"
-- - Enable public access
-- - Add policy for public read access

-- ============================================
-- END OF ADMIN SETUP
-- ============================================