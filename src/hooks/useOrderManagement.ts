
import { useState, useEffect } from 'react';
import { Order, OrderItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from './useCartStore';
import { Location } from './useDeliveryLocation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const ORDERS_STORAGE_KEY = 'eko-orders';

export const useOrderManagement = (
  items: CartItem[], 
  subtotal: number,
  clearCart: () => void,
  deliveryLocation: Location | null,
  setDeliveryLocation: (location: Location | null) => void,
) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchUserOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            crops(name, unit)
          )
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Safely fetch seller names via RPC
      const sellerIds = Array.from(new Set((data || []).map((o: any) => o.seller_id).filter(Boolean)));
      let sellerNameMap: Record<string, string> = {};
      if (sellerIds.length > 0) {
        const { data: sellersByIds, error: idsError } = await (supabase as any)
          .rpc('get_verified_sellers_by_ids', { _ids: sellerIds });
        if (idsError) throw idsError;
        (sellersByIds as any[]).forEach((s: any) => {
          sellerNameMap[s.id] = s.business_name;
        });
      }

      // Transform database orders to our Order type
      const transformedOrders: Order[] = (data || []).map(order => ({
        id: order.id,
        buyerId: order.buyer_id,
        sellerId: order.seller_id,
        sellerName: sellerNameMap[order.seller_id] || 'Unknown Seller',
        items: (order.order_items || []).map((item: any) => ({
          id: item.id,
          cropId: item.crop_id,
          cropName: item.crops?.name || 'Unknown Crop',
          quantity: item.quantity,
          unit: item.crops?.unit || 'kg',
          pricePerUnit: item.price_per_unit,
          totalPrice: item.total_price,
        })),
        status: order.status,
        totalAmount: order.total_amount,
        deliveryFee: order.delivery_fee,
        deliveryAddress: {
          address: order.delivery_address,
          coordinates: {
            latitude: order.delivery_lat,
            longitude: order.delivery_lng,
          },
        },
        createdAt: new Date(order.created_at),
        estimatedDelivery: order.estimated_delivery ? new Date(order.estimated_delivery) : undefined,
        tracking: {
          currentStatus: order.status,
          lastUpdate: new Date(order.updated_at),
          timeline: [
            { status: 'Order Placed', time: new Date(order.created_at), completed: true, current: order.status === 'pending' },
            { status: 'Confirmed', time: new Date(order.updated_at), completed: order.status !== 'pending', current: order.status === 'confirmed' },
            { status: 'In Transit', time: new Date(order.updated_at), completed: ['in_transit', 'delivered'].includes(order.status), current: order.status === 'in_transit' },
            { status: 'Delivered', time: new Date(order.updated_at), completed: order.status === 'delivered', current: order.status === 'delivered' },
          ],
        },
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
    
    // Set up real-time subscription for order updates
    if (!user) return;
    
    const channel = supabase
      .channel('order-management-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `buyer_id=eq.${user.id}`
        },
        () => {
          // Refetch orders when any order changes
          fetchUserOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  const proceedToCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      return;
    }

    if (!deliveryLocation) {
      toast({
        title: "Missing Delivery Location",
        description: "Please set a delivery location to continue.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCheckingOut(true);
    
    try {
      // Get the seller ID from the first item (assuming all items are from same seller)
      const firstItem = items[0];
      if (!firstItem?.crop.sellerId) {
        throw new Error('Seller information not found');
      }

      // Get user profile to ensure we have the latest phone number
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }

      const userPhoneNumber = userProfile?.phone_number || user.phone || '+255000000000';

      // Create the order
      const orderData = {
        buyer_id: user.id,
        seller_id: firstItem.crop.sellerId,
        total_amount: subtotal + 4500, // include delivery fee
        delivery_fee: 4500,
        delivery_lat: deliveryLocation.coordinates.latitude,
        delivery_lng: deliveryLocation.coordinates.longitude,
        delivery_address: deliveryLocation.address,
        phone_number: userPhoneNumber,
        notes: null,
        payment_status: 'pending',
        estimated_delivery: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(), // 30 mins from now
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItemsData = items.map(item => ({
        order_id: order.id,
        crop_id: item.crop.id,
        quantity: item.quantity,
        price_per_unit: item.crop.pricePerUnit,
        total_price: item.crop.pricePerUnit * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      toast({
        title: "Order Placed Successfully",
        description: "Your order has been placed and the seller has been notified.",
      });
      
      clearCart();
      setDeliveryLocation(null);
      
      // Refresh orders to show the new one
      await fetchUserOrders();
      
      window.location.href = "/my-orders";
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  return {
    orders,
    getOrderById,
    isCheckingOut,
    proceedToCheckout
  };
};

