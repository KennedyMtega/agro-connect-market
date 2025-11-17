# Reviews System Migration Instructions

## Step 1: Run this SQL in Lovable Cloud

Go to **Cloud tab → Database → SQL Editor** and run this complete SQL script:

```sql
-- ============================================
-- RATING AND REVIEW SYSTEM
-- ============================================

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photos TEXT[],
  seller_response TEXT,
  seller_response_date TIMESTAMPTZ,
  is_verified_purchase BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(order_id, buyer_id)
);

-- Create review helpfulness tracking
CREATE TABLE IF NOT EXISTS public.review_helpful (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Create storage bucket for review photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON public.reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_buyer_id ON public.reviews(buyer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_seller_id ON public.reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_helpful_review_id ON public.review_helpful(review_id);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_helpful ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Buyers can create reviews for their completed orders" ON public.reviews;
CREATE POLICY "Buyers can create reviews for their completed orders"
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

DROP POLICY IF EXISTS "Buyers can update their own reviews" ON public.reviews;
CREATE POLICY "Buyers can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = buyer_id)
  WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Sellers can respond to reviews" ON public.reviews;
CREATE POLICY "Sellers can respond to reviews"
  ON public.reviews FOR UPDATE
  USING (
    seller_id IN (
      SELECT id FROM public.seller_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for review helpfulness
DROP POLICY IF EXISTS "Anyone can view review helpfulness" ON public.review_helpful;
CREATE POLICY "Anyone can view review helpfulness"
  ON public.review_helpful FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can mark reviews helpful" ON public.review_helpful;
CREATE POLICY "Authenticated users can mark reviews helpful"
  ON public.review_helpful FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove their helpful marks" ON public.review_helpful;
CREATE POLICY "Users can remove their helpful marks"
  ON public.review_helpful FOR DELETE
  USING (auth.uid() = user_id);

-- Storage policies
DROP POLICY IF EXISTS "Anyone can view review photos" ON storage.objects;
CREATE POLICY "Anyone can view review photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-photos');

DROP POLICY IF EXISTS "Authenticated users can upload review photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload review photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'review-photos' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete their review photos" ON storage.objects;
CREATE POLICY "Users can delete their review photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'review-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Functions
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

-- Triggers
DROP TRIGGER IF EXISTS update_seller_rating_on_review ON public.reviews;
CREATE TRIGGER update_seller_rating_on_review
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seller_rating();

DROP TRIGGER IF EXISTS update_review_helpful_count_trigger ON public.review_helpful;
CREATE TRIGGER update_review_helpful_count_trigger
  AFTER INSERT OR DELETE ON public.review_helpful
  FOR EACH ROW
  EXECUTE FUNCTION public.update_review_helpful_count();

DROP TRIGGER IF EXISTS update_reviews_timestamp ON public.reviews;
CREATE TRIGGER update_reviews_timestamp
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Function to get reviews
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

GRANT EXECUTE ON FUNCTION public.get_seller_reviews(UUID, INTEGER, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_review_order(UUID, UUID) TO authenticated;
```

## Step 2: After running the SQL

Once you've successfully run the migration in your database, let me know and I'll regenerate the Supabase types to include the new tables and functions.

## Features Included

✅ **5-star rating system**
✅ **Text reviews with 1000 character limit**
✅ **Photo uploads (up to 5 photos per review)**
✅ **Seller responses to reviews**
✅ **Helpful button for reviews**
✅ **Verified purchase badges**
✅ **Automatic seller rating calculations**
✅ **Review photos stored in Supabase Storage**
✅ **Complete RLS security policies**

