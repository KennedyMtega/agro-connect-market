-- Add is_onboarded field to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT false;