-- Fix critical security issues

-- 1. Fix function search_path issues
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';
ALTER FUNCTION public.handle_new_order() SET search_path = 'public';
ALTER FUNCTION public.handle_order_inventory() SET search_path = 'public';
ALTER FUNCTION public.handle_order_status_change() SET search_path = 'public';
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';

-- 2. Create secure geocoding proxy function for Google Maps
CREATE OR REPLACE FUNCTION public.get_geocode_data(lat numeric, lng numeric)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
DECLARE
  api_key text;
  geocode_url text;
  response jsonb;
BEGIN
  -- Get API key from secrets (will be available via Supabase secrets)
  api_key := current_setting('app.settings.google_maps_api_key', true);
  
  IF api_key IS NULL OR api_key = '' THEN
    RETURN jsonb_build_object('error', 'API key not configured');
  END IF;
  
  -- For now, return a placeholder response structure
  -- This will be implemented via Edge Function for actual HTTP calls
  RETURN jsonb_build_object(
    'status', 'OK',
    'results', jsonb_build_array(
      jsonb_build_object(
        'formatted_address', 'Location address will be fetched via Edge Function',
        'geometry', jsonb_build_object(
          'location', jsonb_build_object('lat', lat, 'lng', lng)
        )
      )
    )
  );
END;
$$;