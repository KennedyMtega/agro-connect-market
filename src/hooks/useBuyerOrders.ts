import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface BuyerOrder {
  id: string;
  seller_id: string;
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
  order_items?: BuyerOrderItem[];
  seller_profiles?: {
    business_name: string;
  };
}

export interface BuyerOrderItem {
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

export const useBuyerOrders = () => {
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOrders = async () => {
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
          ),
          seller_profiles(business_name)
        `)
        .eq('buyer_id', user.id)
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

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription for order updates
    if (!user) return;
    
    const channel = supabase
      .channel('buyer-orders-changes')
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
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders
  };
};