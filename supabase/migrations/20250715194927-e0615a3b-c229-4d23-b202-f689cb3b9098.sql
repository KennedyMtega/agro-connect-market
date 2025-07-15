-- Create user_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('buyer', 'seller');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create order_status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create verification_status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create notification_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('order_update', 'delivery', 'payment', 'general');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update the handle_new_user function with proper enum casting
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, phone_number, full_name, user_type, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'phone_number', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        COALESCE((NEW.raw_user_meta_data ->> 'user_type')::user_type, 'buyer'::user_type),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;