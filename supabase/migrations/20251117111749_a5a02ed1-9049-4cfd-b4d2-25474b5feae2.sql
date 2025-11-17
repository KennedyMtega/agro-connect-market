-- ============================================
-- RLS POLICIES, FUNCTIONS, AND TRIGGERS
-- ============================================

-- 6. CREATE SECURITY DEFINER FUNCTIONS

-- Function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Function to get user's seller profile ID
CREATE OR REPLACE FUNCTION public.get_user_seller_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.seller_profiles WHERE user_id = _user_id LIMIT 1;
$$;

-- 7. CREATE AUTOMATION FUNCTIONS

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number, email, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', NEW.phone),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'user_type')::public.user_type, 'buyer')
  );
  RETURN NEW;
END;
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function to update seller ratings
CREATE OR REPLACE FUNCTION public.update_seller_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.seller_profiles
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.reviews
      WHERE seller_id = NEW.seller_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE seller_id = NEW.seller_id
    ),
    updated_at = NOW()
  WHERE id = NEW.seller_id;
  
  RETURN NEW;
END;
$$;

-- Function to update review helpful count
CREATE OR REPLACE FUNCTION public.update_review_helpful_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.reviews
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.reviews
    SET helpful_count = helpful_count - 1
    WHERE id = OLD.review_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 8. CREATE TRIGGERS

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_seller_profiles_timestamp
  BEFORE UPDATE ON public.seller_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_crops_timestamp
  BEFORE UPDATE ON public.crops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_orders_timestamp
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_delivery_tracking_timestamp
  BEFORE UPDATE ON public.delivery_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_reviews_timestamp
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Triggers for review system
CREATE TRIGGER update_seller_rating_on_review
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seller_rating();

CREATE TRIGGER update_review_helpful_count_trigger
  AFTER INSERT OR DELETE ON public.review_helpful
  FOR EACH ROW
  EXECUTE FUNCTION public.update_review_helpful_count();

-- 9. CREATE RLS POLICIES

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Public profiles viewable"
  ON public.profiles FOR SELECT
  USING (true);

-- Seller profiles policies
CREATE POLICY "Anyone can view verified sellers"
  ON public.seller_profiles FOR SELECT
  USING (verification_status = 'verified' OR user_id = auth.uid());

CREATE POLICY "Sellers can insert own profile"
  ON public.seller_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Sellers can update own profile"
  ON public.seller_profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Crop categories (public read)
CREATE POLICY "Anyone can view categories"
  ON public.crop_categories FOR SELECT
  USING (true);

-- Crops policies
CREATE POLICY "Anyone can view active crops"
  ON public.crops FOR SELECT
  USING (is_active = true OR seller_id = public.get_user_seller_id(auth.uid()));

CREATE POLICY "Sellers can insert crops"
  ON public.crops FOR INSERT
  WITH CHECK (seller_id = public.get_user_seller_id(auth.uid()));

CREATE POLICY "Sellers can update crops"
  ON public.crops FOR UPDATE
  USING (seller_id = public.get_user_seller_id(auth.uid()));

CREATE POLICY "Sellers can delete crops"
  ON public.crops FOR DELETE
  USING (seller_id = public.get_user_seller_id(auth.uid()));

-- Orders policies
CREATE POLICY "Buyers view own orders"
  ON public.orders FOR SELECT
  USING (buyer_id = auth.uid());

CREATE POLICY "Sellers view their orders"
  ON public.orders FOR SELECT
  USING (seller_id IN (SELECT id FROM public.seller_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND buyer_id = auth.uid());

CREATE POLICY "Sellers update their orders"
  ON public.orders FOR UPDATE
  USING (seller_id IN (SELECT id FROM public.seller_profiles WHERE user_id = auth.uid()));

-- Order items policies
CREATE POLICY "View order items for own orders"
  ON public.order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM public.orders 
      WHERE buyer_id = auth.uid() 
      OR seller_id IN (SELECT id FROM public.seller_profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Insert order items for own orders"
  ON public.order_items FOR INSERT
  WITH CHECK (
    order_id IN (SELECT id FROM public.orders WHERE buyer_id = auth.uid())
  );

-- Notifications policies
CREATE POLICY "Users view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Delivery tracking policies
CREATE POLICY "Users view tracking for own orders"
  ON public.delivery_tracking FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM public.orders 
      WHERE buyer_id = auth.uid() 
      OR seller_id IN (SELECT id FROM public.seller_profiles WHERE user_id = auth.uid())
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Buyers create reviews for completed orders"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = buyer_id 
    AND EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id 
      AND buyer_id = auth.uid() 
      AND status = 'delivered'
    )
  );

CREATE POLICY "Buyers update own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers respond to reviews"
  ON public.reviews FOR UPDATE
  USING (seller_id IN (SELECT id FROM public.seller_profiles WHERE user_id = auth.uid()));

-- Review helpful policies
CREATE POLICY "Anyone view review helpful"
  ON public.review_helpful FOR SELECT
  USING (true);

CREATE POLICY "Users mark reviews helpful"
  ON public.review_helpful FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users remove helpful marks"
  ON public.review_helpful FOR DELETE
  USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins access admin_users"
  ON public.admin_users FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins access sessions"
  ON public.admin_sessions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins view audit logs"
  ON public.admin_audit_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins view verification logs"
  ON public.business_verification_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage user roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));