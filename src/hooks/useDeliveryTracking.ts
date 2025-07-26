import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DeliveryTracking {
  id: string;
  order_id: string;
  driver_name?: string;
  driver_phone?: string;
  current_lat?: number;
  current_lng?: number;
  estimated_arrival?: string;
  distance_to_destination?: number;
  status_updates: any[];
  vehicle_details?: any;
  created_at: string;
  updated_at: string;
}

export const useDeliveryTracking = (orderId?: string) => {
  const [tracking, setTracking] = useState<DeliveryTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createDeliveryTracking = useCallback(async (
    orderId: string,
    estimatedArrival: Date,
    driverInfo?: { name: string; phone: string }
  ) => {
    try {
      setLoading(true);
      
      const trackingData = {
        order_id: orderId,
        driver_name: driverInfo?.name || 'Delivery Driver',
        driver_phone: driverInfo?.phone || '+255000000000',
        estimated_arrival: estimatedArrival.toISOString(),
        status_updates: [{
          timestamp: new Date().toISOString(),
          status: 'order_confirmed',
          message: 'Order confirmed and preparing for delivery',
          location: 'Seller Location'
        }],
        vehicle_details: {
          type: 'motorcycle',
          plate_number: 'MC-' + Math.random().toString(36).substr(2, 6).toUpperCase()
        }
      };

      const { data, error } = await supabase
        .from('delivery_tracking')
        .insert([trackingData])
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion for the returned data
      const trackingResult = data as DeliveryTracking;
      setTracking(trackingResult);
      return trackingResult;
    } catch (err) {
      console.error('Error creating delivery tracking:', err);
      setError('Failed to create delivery tracking');
      toast({
        title: "Error",
        description: "Failed to create delivery tracking. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateDeliveryStatus = useCallback(async (
    trackingId: string,
    status: string,
    message: string,
    location?: string,
    coordinates?: { lat: number; lng: number }
  ) => {
    if (!tracking) return;

    try {
      const newStatusUpdate = {
        timestamp: new Date().toISOString(),
        status,
        message,
        location: location || 'En route',
        coordinates
      };

      const updatedStatusUpdates = [...tracking.status_updates, newStatusUpdate];
      
      const updateData: any = {
        status_updates: updatedStatusUpdates,
        updated_at: new Date().toISOString()
      };

      if (coordinates) {
        updateData.current_lat = coordinates.lat;
        updateData.current_lng = coordinates.lng;
      }

      const { data, error } = await supabase
        .from('delivery_tracking')
        .update(updateData)
        .eq('id', trackingId)
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion for the returned data
      const trackingResult = data as DeliveryTracking;
      setTracking(trackingResult);
      return trackingResult;
    } catch (err) {
      console.error('Error updating delivery status:', err);
      toast({
        title: "Error",
        description: "Failed to update delivery status.",
        variant: "destructive",
      });
      return null;
    }
  }, [tracking, toast]);

  const fetchDeliveryTracking = useCallback(async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('delivery_tracking')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }
      
      // Type assertion for the returned data
      setTracking((data as DeliveryTracking) || null);
    } catch (err) {
      console.error('Error fetching delivery tracking:', err);
      setError('Failed to load delivery tracking');
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time subscription for delivery updates
  useEffect(() => {
    if (!orderId) return;

    fetchDeliveryTracking(orderId);

    const subscription = supabase
      .channel(`delivery_tracking_${orderId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'delivery_tracking',
          filter: `order_id=eq.${orderId}`
        }, 
        (payload) => {
          console.log('Delivery tracking update:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            // Type assertion for real-time updates
            setTracking(payload.new as DeliveryTracking);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [orderId, fetchDeliveryTracking]);

  return {
    tracking,
    loading,
    error,
    createDeliveryTracking,
    updateDeliveryStatus,
    refetch: orderId ? () => fetchDeliveryTracking(orderId) : undefined
  };
};