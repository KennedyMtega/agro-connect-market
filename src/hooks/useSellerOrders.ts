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
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, ...data } : order
      ));
      
      toast({
        title: "Order Updated",
        description: `Order status updated to ${status}.`,
      });
      return true;
    } catch (err) {
      console.error('Error updating order:', err);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user, sellerProfile]);

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    refetch: fetchOrders
  };
};