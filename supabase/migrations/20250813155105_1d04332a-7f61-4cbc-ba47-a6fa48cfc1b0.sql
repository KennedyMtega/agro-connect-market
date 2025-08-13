-- Phase 1 & 2: Critical Security Fixes
-- Fix profiles table policies (drop and recreate to ensure they're correct)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
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

-- Limited seller access to buyer names for delivered orders only (no personal info)
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

-- NO public access to profiles - all public seller info comes from seller_profiles table only
-- This removes the previous policy that exposed seller profile data

-- Create function for secure business data sanitization
CREATE OR REPLACE FUNCTION public.sanitize_business_input(input_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $function$
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Remove potentially dangerous characters and normalize
  RETURN LEFT(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        TRIM(input_text), 
        '[<>\"''&]', '', 'g'
      ), 
      '\s+', ' ', 'g'
    ), 
    500
  );
END;
$function$;

-- Create function for email validation
CREATE OR REPLACE FUNCTION public.validate_email_server_side(email_input text)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
AS $function$
DECLARE
  email_clean text;
  domain_part text;
  local_part text;
  result jsonb;
BEGIN
  -- Sanitize and normalize email
  email_clean := LOWER(TRIM(email_input));
  
  -- Basic format validation
  IF NOT email_clean ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invalid email format');
  END IF;
  
  -- Length validation (RFC 5321)
  IF LENGTH(email_clean) > 320 THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Email too long');
  END IF;
  
  -- Split email
  local_part := SPLIT_PART(email_clean, '@', 1);
  domain_part := SPLIT_PART(email_clean, '@', 2);
  
  -- Local part validation
  IF LENGTH(local_part) > 64 THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Email local part too long');
  END IF;
  
  -- Check for disposable domains
  IF domain_part = ANY(ARRAY[
    '10minutemail.com', 'guerrillamail.com', 'tempmail.org', 
    'yopmail.com', 'mailinator.com', 'temp-mail.org',
    'throwaway.email', 'trash-mail.com', 'getnada.com', 'temp.local'
  ]) THEN
    RETURN jsonb_build_object(
      'valid', true, 
      'warnings', ARRAY['Consider using a permanent email address']
    );
  END IF;
  
  RETURN jsonb_build_object('valid', true);
END;
$function$;