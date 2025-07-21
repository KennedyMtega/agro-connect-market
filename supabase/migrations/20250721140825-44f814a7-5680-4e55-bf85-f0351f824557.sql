-- Add additional business document fields to seller_profiles table
ALTER TABLE public.seller_profiles
ADD COLUMN IF NOT EXISTS owner_id_number TEXT,
ADD COLUMN IF NOT EXISTS brela_certificate TEXT,
ADD COLUMN IF NOT EXISTS business_certificate TEXT,
ADD COLUMN IF NOT EXISTS tin_certificate TEXT;