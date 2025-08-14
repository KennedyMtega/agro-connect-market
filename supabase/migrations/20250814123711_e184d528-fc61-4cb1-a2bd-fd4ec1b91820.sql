-- Fix seller_profiles security vulnerability
-- Step 1: Drop the overly permissive public access policy
DROP POLICY IF EXISTS "Anyone can view verified sellers" ON public.seller_profiles;

-- Step 2: Create a secure function that returns only safe public seller information
CREATE OR REPLACE FUNCTION public.get_verified_sellers_public()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  business_name text,
  business_description text,
  average_rating numeric,
  total_ratings integer,
  delivery_radius_km integer,
  verification_status verification_status,
  store_location_lat numeric,
  store_location_lng numeric,
  store_location text,
  has_whatsapp boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    sp.user_id,
    sp.business_name,
    sp.business_description,
    sp.average_rating,
    sp.total_ratings,
    sp.delivery_radius_km,
    sp.verification_status,
    sp.store_location_lat,
    sp.store_location_lng,
    sp.store_location,
    sp.has_whatsapp
  FROM public.seller_profiles sp
  WHERE sp.verification_status = 'verified';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = 'public';

-- Step 3: Create a function to search verified sellers safely
CREATE OR REPLACE FUNCTION public.search_verified_sellers_public(_query text)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  business_name text,
  business_description text,
  average_rating numeric,
  total_ratings integer,
  delivery_radius_km integer,
  verification_status verification_status,
  store_location_lat numeric,
  store_location_lng numeric,
  store_location text,
  has_whatsapp boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    sp.user_id,
    sp.business_name,
    sp.business_description,
    sp.average_rating,
    sp.total_ratings,
    sp.delivery_radius_km,
    sp.verification_status,
    sp.store_location_lat,
    sp.store_location_lng,
    sp.store_location,
    sp.has_whatsapp
  FROM public.seller_profiles sp
  WHERE sp.verification_status = 'verified'
    AND (
      sp.business_name ILIKE '%' || _query || '%'
      OR sp.business_description ILIKE '%' || _query || '%'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = 'public';

-- Step 4: Create a function to get sellers by IDs safely
CREATE OR REPLACE FUNCTION public.get_verified_sellers_by_ids(_ids uuid[])
RETURNS TABLE(
  id uuid,
  user_id uuid,
  business_name text,
  business_description text,
  average_rating numeric,
  total_ratings integer,
  delivery_radius_km integer,
  verification_status verification_status,
  store_location_lat numeric,
  store_location_lng numeric,
  store_location text,
  has_whatsapp boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    sp.user_id,
    sp.business_name,
    sp.business_description,
    sp.average_rating,
    sp.total_ratings,
    sp.delivery_radius_km,
    sp.verification_status,
    sp.store_location_lat,
    sp.store_location_lng,
    sp.store_location,
    sp.has_whatsapp
  FROM public.seller_profiles sp
  WHERE sp.verification_status = 'verified'
    AND sp.id = ANY(_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = 'public';