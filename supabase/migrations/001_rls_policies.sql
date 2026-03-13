-- ============================================
-- Medical Website - Database Setup & RLS Policies
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- 1. PROFILES TABLE (already exists, but ensure RLS)
-- ============================================

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. ANNOUNCEMENTS TABLE
-- ============================================

-- Enable RLS on announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Anyone can view published announcements
CREATE POLICY "Anyone can view published announcements"
ON public.announcements FOR SELECT
USING (is_published = true);

-- Admin can view all announcements (including drafts)
CREATE POLICY "Admin can view all announcements"
ON public.announcements FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admin can insert announcements
CREATE POLICY "Admin can insert announcements"
ON public.announcements FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admin can update announcements
CREATE POLICY "Admin can update announcements"
ON public.announcements FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admin can delete announcements
CREATE POLICY "Admin can delete announcements"
ON public.announcements FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- 3. LECTURES TABLE
-- ============================================

-- Enable RLS on lectures
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

-- Anyone can view published lectures
CREATE POLICY "Anyone can view published lectures"
ON public.lectures FOR SELECT
USING (is_published = true);

-- Admin can view all lectures (including drafts)
CREATE POLICY "Admin can view all lectures"
ON public.lectures FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admin can insert lectures
CREATE POLICY "Admin can insert lectures"
ON public.lectures FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admin can update lectures
CREATE POLICY "Admin can update lectures"
ON public.lectures FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admin can delete lectures
CREATE POLICY "Admin can delete lectures"
ON public.lectures FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- 4. STORAGE BUCKET POLICIES
-- ============================================

-- Create the lecture-downloads bucket if it doesn't exist
-- (Do this in Supabase Dashboard > Storage > Create Bucket)
-- Bucket name: lecture-downloads
-- Public: false (private)

-- Storage RLS Policies
-- Note: Run these in SQL Editor after creating the bucket

-- Allow authenticated users to read files via signed URLs
-- (Signed URLs work for private buckets automatically)

-- Admin can upload files
CREATE POLICY "Admin can upload lecture downloads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'lecture-downloads'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admin can update files
CREATE POLICY "Admin can update lecture downloads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'lecture-downloads'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'lecture-downloads'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admin can delete files
CREATE POLICY "Admin can delete lecture downloads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'lecture-downloads'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- 5. HELPER FUNCTION FOR ADMIN CHECK
-- ============================================

-- Create a function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. CREATE FIRST ADMIN USER (Optional)
-- ============================================

-- After signing up your first user, run this to make them admin:
-- UPDATE public.profiles SET role = 'admin' WHERE user_id = 'YOUR_USER_ID';

-- To find your user ID:
-- SELECT id, email FROM auth.users;
