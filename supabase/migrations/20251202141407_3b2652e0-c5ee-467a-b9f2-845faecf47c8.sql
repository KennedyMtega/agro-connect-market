-- 1. Add RLS policy for admins to update seller profiles
CREATE POLICY "Admins can update seller profiles" 
ON public.seller_profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Create RPC function to search verified sellers by query
CREATE OR REPLACE FUNCTION public.search_verified_sellers_public(search_query text)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  business_name text,
  business_description text,
  store_location text,
  store_location_lat numeric,
  store_location_lng numeric,
  delivery_radius_km integer,
  has_whatsapp boolean,
  average_rating numeric,
  total_ratings integer,
  verification_status verification_status
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    sp.id, sp.user_id, sp.business_name, sp.business_description,
    sp.store_location, sp.store_location_lat, sp.store_location_lng,
    sp.delivery_radius_km, sp.has_whatsapp, sp.average_rating,
    sp.total_ratings, sp.verification_status
  FROM public.seller_profiles sp
  WHERE sp.verification_status = 'verified' 
    AND sp.is_active = true
    AND (
      sp.business_name ILIKE '%' || search_query || '%'
      OR sp.business_description ILIKE '%' || search_query || '%'
    );
$$;

-- 3. Create RPC function to get verified sellers by IDs
CREATE OR REPLACE FUNCTION public.get_verified_sellers_by_ids(seller_ids uuid[])
RETURNS TABLE(
  id uuid,
  user_id uuid,
  business_name text,
  business_description text,
  store_location text,
  store_location_lat numeric,
  store_location_lng numeric,
  delivery_radius_km integer,
  has_whatsapp boolean,
  average_rating numeric,
  total_ratings integer,
  verification_status verification_status
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    sp.id, sp.user_id, sp.business_name, sp.business_description,
    sp.store_location, sp.store_location_lat, sp.store_location_lng,
    sp.delivery_radius_km, sp.has_whatsapp, sp.average_rating,
    sp.total_ratings, sp.verification_status
  FROM public.seller_profiles sp
  WHERE sp.id = ANY(seller_ids)
    AND sp.verification_status = 'verified' 
    AND sp.is_active = true;
$$;

-- 4. Create function to get featured crops with seller info
CREATE OR REPLACE FUNCTION public.get_featured_crops()
RETURNS TABLE(
  id uuid,
  name text,
  description text,
  price_per_unit numeric,
  unit text,
  quantity_available integer,
  images text[],
  seller_id uuid,
  business_name text,
  store_location text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id, c.name, c.description, c.price_per_unit, c.unit,
    c.quantity_available, c.images, c.seller_id,
    sp.business_name, sp.store_location
  FROM public.crops c
  JOIN public.seller_profiles sp ON c.seller_id = sp.id
  WHERE c.is_featured = true 
    AND c.is_active = true
    AND sp.verification_status = 'verified'
    AND sp.is_active = true
  ORDER BY c.created_at DESC
  LIMIT 20;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.search_verified_sellers_public(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_verified_sellers_by_ids(uuid[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_featured_crops() TO anon, authenticated;