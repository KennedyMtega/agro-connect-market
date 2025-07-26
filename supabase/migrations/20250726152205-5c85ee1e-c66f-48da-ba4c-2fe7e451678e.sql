-- Add payment status to orders table
ALTER TABLE public.orders 
ADD COLUMN payment_status TEXT DEFAULT 'pending';

-- Add real-time updates for orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Add real-time updates for delivery_tracking table  
ALTER TABLE public.delivery_tracking REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_tracking;

-- Add real-time updates for notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;  
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Add real-time updates for crops table for inventory
ALTER TABLE public.crops REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crops;

-- Create function to manage inventory when order status changes
CREATE OR REPLACE FUNCTION public.handle_order_inventory()
RETURNS TRIGGER AS $$
BEGIN
    -- When order is cancelled, restore inventory
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE public.crops 
        SET quantity_available = quantity_available + oi.quantity
        FROM public.order_items oi
        WHERE oi.order_id = NEW.id AND crops.id = oi.crop_id;
        
        RETURN NEW;
    END IF;
    
    -- When order is confirmed, reduce inventory (if not already reduced)
    IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
        UPDATE public.crops 
        SET quantity_available = quantity_available - oi.quantity
        FROM public.order_items oi
        WHERE oi.order_id = NEW.id AND crops.id = oi.crop_id;
        
        RETURN NEW;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for inventory management
CREATE TRIGGER order_inventory_trigger
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_order_inventory();