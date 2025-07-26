-- Create order creation function to handle automatic notifications
CREATE OR REPLACE FUNCTION public.handle_new_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Create notification for seller
    INSERT INTO public.notifications (
        user_id,
        title,
        message,
        type,
        order_id
    )
    SELECT 
        sp.user_id,
        'New Order Received',
        'You have received a new order #' || substr(NEW.id::text, 1, 8),
        'order'::notification_type,
        NEW.id
    FROM seller_profiles sp
    WHERE sp.id = NEW.seller_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create order status update function to handle notifications
CREATE OR REPLACE FUNCTION public.handle_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create notification if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- Create notification for buyer
        INSERT INTO public.notifications (
            user_id,
            title,
            message,
            type,
            order_id
        )
        VALUES (
            NEW.buyer_id,
            'Order Status Updated',
            'Your order #' || substr(NEW.id::text, 1, 8) || ' is now ' || NEW.status,
            'order'::notification_type,
            NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for order notifications
DROP TRIGGER IF EXISTS on_order_created ON public.orders;
CREATE TRIGGER on_order_created
    AFTER INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_order();

DROP TRIGGER IF EXISTS on_order_status_updated ON public.orders;
CREATE TRIGGER on_order_status_updated
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_order_status_change();