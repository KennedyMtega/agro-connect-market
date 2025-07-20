-- Add additional business information fields to seller_profiles table
ALTER TABLE public.seller_profiles 
ADD COLUMN IF NOT EXISTS business_number TEXT,
ADD COLUMN IF NOT EXISTS has_whatsapp BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS store_location TEXT,
ADD COLUMN IF NOT EXISTS store_location_lat DECIMAL,
ADD COLUMN IF NOT EXISTS store_location_lng DECIMAL,
ADD COLUMN IF NOT EXISTS owner_name TEXT,
ADD COLUMN IF NOT EXISTS owner_phone TEXT,
ADD COLUMN IF NOT EXISTS owner_email TEXT;