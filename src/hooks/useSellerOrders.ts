import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface OrderItem {
  id: string;
  crop_id: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  crops?: {
    name: string;
    unit: string;
  };
}

export interface Order {
  id: string;
  buyer_id: string;
  total_amount: number;
  delivery_fee: number;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  payment_status?: string;
  delivery_address: string;
  phone_number: string;
  notes?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  profiles?: {
    full_name: string;
    phone_number: string;
  };
}

export const useSellerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, sellerProfile } = useAuth();
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!user || !sellerProfile) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            crops(name, unit)
          ),
          profiles(full_name, phone_number)
        `)
        .eq('seller_id', sellerProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    // Store previous state for rollback
    const previousOrders = [...orders];
    const previousOrder = orders.find(o => o.id === orderId);
    
    // Optimistic update - immediately update UI
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, updated_at: new Date().toISOString() } 
        : order
    ));
    
    // Show immediate feedback
    toast({
      title: "Updating Order...",
      description: `Changing status to ${status.replace('_', ' ')}.`,
    });

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      
      // Success - show confirmation
      toast({
        title: "Order Updated",
        description: `Order status changed to ${status.replace('_', ' ')}.`,
      });
      return true;
    } catch (err) {
      console.error('Error updating order:', err);
      
      // Rollback to previous state
      setOrders(previousOrders);
      
      toast({
        title: "Update Failed",
        description: "Could not update order status. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription for order updates
    if (!user || !sellerProfile) return;
    
    const channel = supabase
      .channel('seller-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `seller_id=eq.${sellerProfile.id}`
        },
        () => {
          // Refetch orders when any order changes
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, sellerProfile]);

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    refetch: fetchOrders
  };
};