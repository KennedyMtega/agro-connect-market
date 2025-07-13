-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_type AS ENUM ('buyer', 'seller');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE notification_type AS ENUM ('order_update', 'delivery', 'payment', 'general');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    user_type user_type NOT NULL,
    avatar_url TEXT,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    address TEXT,
    city TEXT DEFAULT 'Dar es Salaam',
    region TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create seller profiles table
CREATE TABLE public.seller_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    business_name TEXT NOT NULL,
    business_description TEXT,
    verification_status verification_status DEFAULT 'pending',
    business_license TEXT,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    delivery_radius_km INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crop categories table
CREATE TABLE public.crop_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crops table
CREATE TABLE public.crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.crop_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    price_per_unit DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    quantity_available INTEGER NOT NULL DEFAULT 0,
    images TEXT[],
    is_organic BOOLEAN DEFAULT FALSE,
    harvest_date DATE,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
    status order_status DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    delivery_address TEXT NOT NULL,
    delivery_lat DECIMAL(10, 8) NOT NULL,
    delivery_lng DECIMAL(11, 8) NOT NULL,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    phone_number TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order items table
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES public.crops(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'general',
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create delivery tracking table
CREATE TABLE public.delivery_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE UNIQUE,
    driver_name TEXT,
    driver_phone TEXT,
    vehicle_details JSONB,
    current_lat DECIMAL(10, 8),
    current_lng DECIMAL(11, 8),
    distance_to_destination DECIMAL(8,2),
    estimated_arrival TIMESTAMP WITH TIME ZONE,
    status_updates JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default crop categories
INSERT INTO public.crop_categories (name, description) VALUES
('Vegetables', 'Fresh vegetables and leafy greens'),
('Fruits', 'Fresh seasonal fruits'),
('Grains', 'Cereals and grain crops'),
('Legumes', 'Beans, peas, and other legumes'),
('Tubers', 'Potatoes, cassava, and root vegetables'),
('Herbs & Spices', 'Fresh herbs and spices');

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Seller profiles policies
CREATE POLICY "Anyone can view verified sellers" ON public.seller_profiles FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Sellers can update own profile" ON public.seller_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Sellers can insert own profile" ON public.seller_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Crop categories policies (public read)
CREATE POLICY "Anyone can view crop categories" ON public.crop_categories FOR SELECT USING (true);

-- Crops policies
CREATE POLICY "Anyone can view active crops" ON public.crops FOR SELECT USING (is_active = true);
CREATE POLICY "Sellers can manage own crops" ON public.crops FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.seller_profiles sp 
        WHERE sp.id = crops.seller_id AND sp.user_id = auth.uid()
    )
);

-- Orders policies
CREATE POLICY "Buyers can view own orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers can view their orders" ON public.orders FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.seller_profiles sp 
        WHERE sp.id = orders.seller_id AND sp.user_id = auth.uid()
    )
);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Sellers can update order status" ON public.orders FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.seller_profiles sp 
        WHERE sp.id = orders.seller_id AND sp.user_id = auth.uid()
    )
);

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON public.order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.orders o 
        WHERE o.id = order_items.order_id 
        AND (o.buyer_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.seller_profiles sp 
            WHERE sp.id = o.seller_id AND sp.user_id = auth.uid()
        ))
    )
);
CREATE POLICY "Users can insert order items for their orders" ON public.order_items FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders o 
        WHERE o.id = order_items.order_id AND o.buyer_id = auth.uid()
    )
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Delivery tracking policies
CREATE POLICY "Users can view tracking for their orders" ON public.delivery_tracking FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.orders o 
        WHERE o.id = delivery_tracking.order_id 
        AND (o.buyer_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.seller_profiles sp 
            WHERE sp.id = o.seller_id AND sp.user_id = auth.uid()
        ))
    )
);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seller_profiles_updated_at BEFORE UPDATE ON public.seller_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crops_updated_at BEFORE UPDATE ON public.crops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_delivery_tracking_updated_at BEFORE UPDATE ON public.delivery_tracking FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, phone_number, full_name, user_type)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'phone_number', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        COALESCE((NEW.raw_user_meta_data ->> 'user_type')::user_type, 'buyer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto-profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function for Tanzania phone number validation
CREATE OR REPLACE FUNCTION public.validate_tz_phone(phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Tanzania phone numbers: +255 followed by 9 digits, or 0 followed by 9 digits
    RETURN phone ~ '^(\+255|0)[67][0-9]{8}$';
END;
$$ LANGUAGE plpgsql;

-- Add constraint for Tanzania phone numbers
ALTER TABLE public.profiles ADD CONSTRAINT valid_tz_phone CHECK (validate_tz_phone(phone_number));