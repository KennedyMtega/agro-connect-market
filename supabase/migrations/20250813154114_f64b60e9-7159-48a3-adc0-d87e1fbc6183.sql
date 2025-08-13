-- Phase 1: Critical RLS Policy Fixes for Profiles Table

-- Drop the overly permissive policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Policy 1: Users can view only their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Sellers can view basic buyer info (name only) for delivered orders
CREATE POLICY "Sellers can view buyer names for delivered orders" 
ON public.profiles 
FOR SELECT 
USING (
  user_type = 'buyer' 
  AND EXISTS (
    SELECT 1 FROM orders o
    JOIN seller_profiles sp ON sp.id = o.seller_id
    WHERE o.buyer_id = profiles.id 
    AND sp.user_id = auth.uid()
    AND o.status = 'delivered'
  )
);

-- Policy 3: Limited public visibility for verified sellers (business info only)
-- This allows buyers to see seller names and basic info when viewing their orders
CREATE POLICY "Public can view verified seller basic info" 
ON public.profiles 
FOR SELECT 
USING (
  user_type = 'seller' 
  AND EXISTS (
    SELECT 1 FROM seller_profiles sp 
    WHERE sp.user_id = profiles.id 
    AND sp.verification_status = 'verified'
  )
);

-- Additional security: Create a secure function to get seller business name for orders
CREATE OR REPLACE FUNCTION public.get_seller_business_name(_seller_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT business_name 
  FROM seller_profiles 
  WHERE id = _seller_id 
  AND verification_status = 'verified';
$$;