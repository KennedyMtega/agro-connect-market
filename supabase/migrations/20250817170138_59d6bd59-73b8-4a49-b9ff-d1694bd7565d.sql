-- Create admin users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin users (only admins can manage admins)
CREATE POLICY "Admins can view all admin users" 
ON public.admin_users 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_users au 
  WHERE au.id = auth.uid() AND au.is_active = true
));

CREATE POLICY "Admins can manage admin users" 
ON public.admin_users 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users au 
  WHERE au.id = auth.uid() AND au.is_active = true
));

-- Create admin sessions table for session management
CREATE TABLE public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on admin sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create business verification logs table
CREATE TABLE public.business_verification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_profile_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES public.admin_users(id),
  action TEXT NOT NULL, -- 'approved', 'rejected', 'pending_review', 'documents_requested'
  notes TEXT,
  previous_status verification_status,
  new_status verification_status,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on verification logs
ALTER TABLE public.business_verification_logs ENABLE ROW LEVEL SECURITY;

-- Create admin audit logs table
CREATE TABLE public.admin_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.admin_users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create system settings table
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on system settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Insert default admin user (password: admin123 - should be changed immediately)
INSERT INTO public.admin_users (email, password_hash, full_name, role)
VALUES (
  'admin@agroconnect.tz',
  '$2b$10$rGKqzF5fBZDrKdx8Fw0JBOHDz1jY7Qr6xNsWp1lMnKtPd8Yr4VB6O', -- hashed "admin123"
  'AgroConnect Administrator',
  'super_admin'
);

-- Create function to get admin dashboard statistics
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_sellers', (SELECT COUNT(*) FROM seller_profiles),
    'verified_sellers', (SELECT COUNT(*) FROM seller_profiles WHERE verification_status = 'verified'),
    'pending_sellers', (SELECT COUNT(*) FROM seller_profiles WHERE verification_status = 'pending'),
    'total_buyers', (SELECT COUNT(*) FROM profiles WHERE user_type = 'buyer'),
    'total_orders', (SELECT COUNT(*) FROM orders),
    'total_crops', (SELECT COUNT(*) FROM crops WHERE is_active = true),
    'revenue_today', COALESCE((
      SELECT SUM(total_amount) 
      FROM orders 
      WHERE created_at >= CURRENT_DATE 
      AND status = 'delivered'
    ), 0),
    'orders_today', (
      SELECT COUNT(*) 
      FROM orders 
      WHERE created_at >= CURRENT_DATE
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Create function to get seller verification details
CREATE OR REPLACE FUNCTION public.get_seller_verification_details(_seller_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'seller_profile', row_to_json(sp),
    'user_profile', row_to_json(p),
    'verification_logs', COALESCE((
      SELECT jsonb_agg(row_to_json(bvl) ORDER BY bvl.created_at DESC)
      FROM business_verification_logs bvl
      WHERE bvl.seller_profile_id = _seller_id
    ), '[]'::jsonb),
    'total_orders', (
      SELECT COUNT(*)
      FROM orders o
      WHERE o.seller_id = _seller_id
    ),
    'total_crops', (
      SELECT COUNT(*)
      FROM crops c
      WHERE c.seller_id = _seller_id AND c.is_active = true
    )
  ) INTO result
  FROM seller_profiles sp
  LEFT JOIN profiles p ON p.id = sp.user_id
  WHERE sp.id = _seller_id;
  
  RETURN result;
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();