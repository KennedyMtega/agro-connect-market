import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Vendor } from '@/types/map';

export const useMapVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVerifiedSellers = async () => {
    setLoading(true);
    try {
      const { data: sellers, error } = await supabase
        .from('seller_profiles')
        .select(`
          *,
          profiles!seller_profiles_user_id_fkey(
            full_name,
            avatar_url
          ),
          crops!crops_seller_id_fkey(
            id,
            name,
            price_per_unit,
            unit,
            quantity_available,
            is_active,
            images
          )
        `)
        .eq('verification_status', 'verified')
        .not('store_location_lat', 'is', null)
        .not('store_location_lng', 'is', null);

      if (error) throw error;

      // Transform seller data to vendor format
      const vendorData: Vendor[] = sellers?.map(seller => ({
        id: seller.id,
        name: seller.business_name,
        location: {
          lat: Number(seller.store_location_lat),
          lng: Number(seller.store_location_lng)
        },
        distance: 0, // Will be calculated based on user location
        rating: seller.average_rating || 0,
        crops: seller.crops?.filter((crop: any) => crop.is_active && crop.quantity_available > 0)
          .map((crop: any) => ({
            id: crop.id,
            name: crop.name,
            category: 'General', // Default category
            pricePerUnit: crop.price_per_unit,
            unit: crop.unit,
            quantityAvailable: crop.quantity_available
          })) || [],
        estimatedDelivery: '30-45 mins', // Default estimate
        online: true // Assume verified sellers are online
      })) || [];

      setVendors(vendorData);
    } catch (error) {
      console.error('Error fetching verified sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiedSellers();
    // Removed real-time subscription to prevent interference with search results
  }, []);

  return {
    vendors,
    setVendors,
    loading,
    refetch: fetchVerifiedSellers
  };
};