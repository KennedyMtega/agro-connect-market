-- Fix RLS policies for seller_profiles to allow upsert operations

-- Drop existing policies
DROP POLICY IF EXISTS "Sellers can insert own profile" ON public.seller_profiles;
DROP POLICY IF EXISTS "Sellers can update own profile" ON public.seller_profiles;

-- Create new policies that properly handle upsert operations
CREATE POLICY "Sellers can manage own profile" 
ON public.seller_profiles 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure the policy for viewing verified sellers remains
-- (This one should already exist but let's make sure)
DROP POLICY IF EXISTS "Anyone can view verified sellers" ON public.seller_profiles;
CREATE POLICY "Anyone can view verified sellers" 
ON public.seller_profiles 
FOR SELECT 
USING (verification_status = 'verified'::verification_status);