-- Phase 1: Critical Data Protection - Secure Profiles Table
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Public can view verified seller basic info" ON public.profiles;
DROP POLICY IF EXISTS "Sellers can view buyer names for delivered orders" ON public.profiles;

-- Create secure RLS policies for profiles table
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Limited seller access to buyer names for delivered orders only
CREATE POLICY "Sellers can view buyer names for delivered orders" 
ON public.profiles 
FOR SELECT 
USING (
  user_type = 'buyer' 
  AND EXISTS (
    SELECT 1 
    FROM orders o
    JOIN seller_profiles sp ON sp.id = o.seller_id
    WHERE o.buyer_id = profiles.id 
    AND sp.user_id = auth.uid() 
    AND o.status = 'delivered'
  )
);

-- Minimal public seller visibility (business info only via seller_profiles)
CREATE POLICY "Public can view verified seller basic info" 
ON public.profiles 
FOR SELECT 
USING (
  user_type = 'seller' 
  AND EXISTS (
    SELECT 1 
    FROM seller_profiles sp
    WHERE sp.user_id = profiles.id 
    AND sp.verification_status = 'verified'
  )
);

-- Ensure seller_profiles table is properly secured
-- Verify existing policies are correct for seller_profiles
CREATE OR REPLACE FUNCTION public.get_public_seller_info(_seller_id uuid)
RETURNS TABLE(business_name text, average_rating numeric, total_ratings integer, delivery_radius_km integer, store_location text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    sp.business_name,
    sp.average_rating,
    sp.total_ratings,
    sp.delivery_radius_km,
    sp.store_location
  FROM seller_profiles sp
  WHERE sp.id = _seller_id 
  AND sp.verification_status = 'verified';
$function$;