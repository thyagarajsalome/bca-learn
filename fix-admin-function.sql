-- ============================================
-- FIX: Admin Function Creation
-- ============================================
-- Run this step by step in your Supabase SQL Editor
-- ============================================

-- STEP 1: Check if role column exists, add it if needed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles ADD COLUMN role text DEFAULT 'student';
        ALTER TABLE profiles ADD CONSTRAINT check_role CHECK (role IN ('student', 'admin', 'instructor'));
    END IF;
END $$;

-- STEP 2: Drop existing function if it exists (to avoid conflicts)
DROP FUNCTION IF EXISTS make_admin(uuid);

-- STEP 3: Create the make_admin function
CREATE OR REPLACE FUNCTION make_admin(user_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE profiles SET role = 'admin' WHERE id = user_id;
END;
$$ LANGUAGE sql SECURITY DEFINER;

-- STEP 4: Verify the function was created
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name = 'make_admin';

-- ============================================
-- NOW MAKE YOURSELF ADMIN
-- ============================================
-- Replace '4514f6ff-4822-463c-9f82-706f744f281d' with your actual user ID
-- Run this after completing the steps above:

-- select make_admin('4514f6ff-4822-463c-9f82-706f744f281d');

-- ============================================
-- VERIFY ADMIN STATUS
-- ============================================
-- Run this to check if you're now an admin:

-- SELECT id, name, role FROM profiles WHERE id = '4514f6ff-4822-463c-9f82-706f744f281d';

-- ============================================
-- ALTERNATIVE: Direct Update (If Function Still Fails)
-- ============================================
-- If the function approach doesn't work, use this direct update:

-- UPDATE profiles SET role = 'admin' WHERE id = '4514f6ff-4822-463c-9f82-706f744f281d';

-- Then verify:
-- SELECT id, name, role FROM profiles WHERE id = '4514f6ff-4822-463c-9f82-706f744f281d';