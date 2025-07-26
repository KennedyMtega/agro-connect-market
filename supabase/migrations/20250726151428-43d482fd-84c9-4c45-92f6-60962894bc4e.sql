-- Add INSERT policy for delivery_tracking table to allow sellers to create tracking records for their orders
CREATE POLICY "Sellers can create tracking for their orders" ON delivery_tracking
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM orders o
    JOIN seller_profiles sp ON sp.id = o.seller_id
    WHERE o.id = delivery_tracking.order_id 
    AND sp.user_id = auth.uid()
  )
);