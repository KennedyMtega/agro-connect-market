-- Update the handle_new_user trigger function to properly store email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    INSERT INTO public.profiles (id, phone_number, full_name, user_type, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'phone_number', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        COALESCE((NEW.raw_user_meta_data ->> 'user_type')::public.user_type, 'buyer'::public.user_type),
        COALESCE(NEW.raw_user_meta_data ->> 'email', NEW.email)
    );
    RETURN NEW;
END;
$$;