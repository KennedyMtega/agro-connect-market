-- ============================================
-- HELPER FUNCTIONS, STORAGE POLICIES, AND SEED DATA
-- ============================================

-- 10. CREATE HELPER FUNCTIONS

-- Function to get verified sellers (public)
CREATE OR REPLACE FUNCTION public.get_verified_sellers_public()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  business_name TEXT,
  business_description TEXT,
  store_location TEXT,
  store_location_lat DECIMAL,
  store_location_lng DECIMAL,
  delivery_radius_km INTEGER,
  has_whatsapp BOOLEAN,
  average_rating DECIMAL,
  total_ratings INTEGER,
  verification_status public.verification_status
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id, user_id, business_name, business_description,
    store_location, store_location_lat, store_location_lng,
    delivery_radius_km, has_whatsapp, average_rating,
    total_ratings, verification_status
  FROM public.seller_profiles
  WHERE verification_status = 'verified' AND is_active = true;
$$;

-- Function to get seller reviews
CREATE OR REPLACE FUNCTION public.get_seller_reviews(_seller_id UUID, _limit INTEGER DEFAULT 20, _offset INTEGER DEFAULT 0)
RETURNS TABLE (
  id UUID,
  order_id UUID,
  buyer_name TEXT,
  buyer_avatar TEXT,
  rating INTEGER,
  comment TEXT,
  photos TEXT[],
  seller_response TEXT,
  seller_response_date TIMESTAMPTZ,
  is_verified_purchase BOOLEAN,
  helpful_count INTEGER,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    r.id,
    r.order_id,
    p.full_name as buyer_name,
    p.avatar_url as buyer_avatar,
    r.rating,
    r.comment,
    r.photos,
    r.seller_response,
    r.seller_response_date,
    r.is_verified_purchase,
    r.helpful_count,
    r.created_at
  FROM public.reviews r
  JOIN public.profiles p ON r.buyer_id = p.id
  WHERE r.seller_id = _seller_id
  ORDER BY r.created_at DESC
  LIMIT _limit
  OFFSET _offset;
$$;

-- Function to check if user can review order
CREATE OR REPLACE FUNCTION public.can_review_order(_order_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = _order_id
    AND buyer_id = _user_id
    AND status = 'delivered'
    AND NOT EXISTS (
      SELECT 1 FROM public.reviews
      WHERE order_id = _order_id
      AND buyer_id = _user_id
    )
  );
$$;

-- Function to get admin dashboard stats
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM public.profiles),
    'total_buyers', (SELECT COUNT(*) FROM public.profiles WHERE user_type = 'buyer'),
    'total_sellers', (SELECT COUNT(*) FROM public.seller_profiles),
    'verified_sellers', (SELECT COUNT(*) FROM public.seller_profiles WHERE verification_status = 'verified'),
    'pending_verifications', (SELECT COUNT(*) FROM public.seller_profiles WHERE verification_status = 'pending'),
    'total_crops', (SELECT COUNT(*) FROM public.crops),
    'active_crops', (SELECT COUNT(*) FROM public.crops WHERE is_active = true),
    'total_orders', (SELECT COUNT(*) FROM public.orders),
    'pending_orders', (SELECT COUNT(*) FROM public.orders WHERE status = 'pending'),
    'completed_orders', (SELECT COUNT(*) FROM public.orders WHERE status = 'delivered'),
    'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders WHERE status = 'delivered')
  ) INTO result;

  RETURN result;
END;
$$;

-- 11. CREATE STORAGE POLICIES

-- Avatar storage policies
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Crop images policies
CREATE POLICY "Anyone can view crop images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'crop-images');

CREATE POLICY "Sellers can upload crop images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'crop-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Sellers can delete own crop images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'crop-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Review photos policies
CREATE POLICY "Anyone can view review photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-photos');

CREATE POLICY "Users can upload review photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'review-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own review photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'review-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Verification documents policies (private)
CREATE POLICY "Sellers can upload verification docs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'verification-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Sellers can view own verification docs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'verification-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 12. INSERT DEFAULT DATA

-- Insert default crop categories
INSERT INTO public.crop_categories (name, description) VALUES
  ('Grains', 'Cereals and grain crops like maize, rice, wheat'),
  ('Vegetables', 'Fresh vegetables including tomatoes, onions, peppers'),
  ('Fruits', 'Fresh fruits like mangoes, bananas, oranges'),
  ('Legumes', 'Beans, peas, lentils, and other pulses'),
  ('Root Crops', 'Tubers and root vegetables like cassava, sweet potatoes'),
  ('Herbs & Spices', 'Culinary herbs and spices'),
  ('Nuts & Seeds', 'Tree nuts and seeds like groundnuts, sunflower seeds')
ON CONFLICT (name) DO NOTHING;

-- Insert default admin user (password: admin123)
-- Note: In production, this should be changed immediately
INSERT INTO public.admin_users (email, password_hash, full_name, role)
VALUES (
  'admin@agroconnect.tz',
  '$2a$10$rOvHmXxJ9FNrPZVVQvEPFOxFqZ9yBpKxYm0nGmXqVgYGZKxR9L7L6',
  'System Administrator',
  'super_admin'
)
ON CONFLICT (email) DO NOTHING;

-- 13. GRANT EXECUTE PERMISSIONS ON FUNCTIONS
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_seller_id(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_verified_sellers_public() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_seller_reviews(UUID, INTEGER, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_review_order(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_stats() TO authenticated;