-- Fix the handle_new_user function to avoid RLS issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, phone_number, full_name, user_type, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'phone_number', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        COALESCE((NEW.raw_user_meta_data ->> 'user_type')::public.user_type, 'buyer'::public.user_type),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;