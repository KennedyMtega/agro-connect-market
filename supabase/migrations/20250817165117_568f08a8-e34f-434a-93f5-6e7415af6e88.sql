-- Update the handle_new_user trigger function to automatically mark buyers as onboarded
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    INSERT INTO public.profiles (id, phone_number, full_name, user_type, email, is_onboarded)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'phone_number', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        COALESCE((NEW.raw_user_meta_data ->> 'user_type')::public.user_type, 'buyer'::public.user_type),
        COALESCE(NEW.raw_user_meta_data ->> 'email', NEW.email),
        CASE 
            WHEN COALESCE((NEW.raw_user_meta_data ->> 'user_type')::public.user_type, 'buyer'::public.user_type) = 'buyer'::public.user_type 
            THEN true 
            ELSE false 
        END
    );
    RETURN NEW;
END;
$$;