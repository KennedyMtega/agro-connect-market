-- Fix security issues by adding proper RLS policies

-- Fix RLS policies for admin_sessions table
CREATE POLICY "Admin sessions viewable by session owner" 
ON public.admin_sessions 
FOR SELECT 
USING (admin_id = auth.uid());

CREATE POLICY "Admin sessions manageable by session owner" 
ON public.admin_sessions 
FOR ALL 
USING (admin_id = auth.uid());

-- Fix RLS policies for business_verification_logs table
CREATE POLICY "Admins can view all verification logs" 
ON public.business_verification_logs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_users au 
  WHERE au.id = auth.uid() AND au.is_active = true
));

CREATE POLICY "Admins can create verification logs" 
ON public.business_verification_logs 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.admin_users au 
  WHERE au.id = auth.uid() AND au.is_active = true
));

-- Fix RLS policies for admin_audit_logs table
CREATE POLICY "Admins can view all audit logs" 
ON public.admin_audit_logs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_users au 
  WHERE au.id = auth.uid() AND au.is_active = true
));

CREATE POLICY "Admins can create audit logs" 
ON public.admin_audit_logs 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.admin_users au 
  WHERE au.id = auth.uid() AND au.is_active = true
));

-- Fix RLS policies for system_settings table
CREATE POLICY "Admins can view system settings" 
ON public.system_settings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_users au 
  WHERE au.id = auth.uid() AND au.is_active = true
));

CREATE POLICY "Admins can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users au 
  WHERE au.id = auth.uid() AND au.is_active = true
));