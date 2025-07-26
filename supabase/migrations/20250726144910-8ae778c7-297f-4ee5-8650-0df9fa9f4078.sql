-- Fix the notification trigger functions to use correct notification type

-- Update the handle_new_order function
CREATE OR REPLACE FUNCTION public.handle_new_order()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
        'order_update'::notification_type,  -- Changed from 'order' to 'order_update'
        NEW.id
    FROM seller_profiles sp
    WHERE sp.id = NEW.seller_id;
    
    RETURN NEW;
END;
$function$;

-- Update the handle_order_status_change function  
CREATE OR REPLACE FUNCTION public.handle_order_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
            'order_update'::notification_type,  -- Changed from 'order' to 'order_update'
            NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$function$;