import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Vendor } from '@/types/map';

export const useMapVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVerifiedSellers = async () => {
    setLoading(true);
    try {
      const { data: sellers, error } = await (supabase as any)
        .rpc('get_verified_sellers_public');

      if (error) throw error;

      const sellerIds = (sellers as any[] || []).map((s: any) => s.id);

      const { data: cropsData, error: cropsError } = await supabase
        .from('crops')
        .select(`
          id,
          name,
          price_per_unit,
          unit,
          quantity_available,
          is_active,
          seller_id,
          images
        `)
        .eq('is_active', true)
        .in('seller_id', sellerIds);

      if (cropsError) throw cropsError;

      const cropsBySeller: Record<string, any[]> = {};
      (cropsData || []).forEach((c: any) => {
        if (!cropsBySeller[c.seller_id]) cropsBySeller[c.seller_id] = [];
        cropsBySeller[c.seller_id].push(c);
      });

      // Transform seller data to vendor format
      const vendorData: Vendor[] = (sellers as any[] || []).map((seller: any) => ({
        id: seller.id,
        name: seller.business_name,
        location: {
          lat: Number(seller.store_location_lat),
          lng: Number(seller.store_location_lng)
        },
        distance: 0, // Will be calculated based on user location
        rating: Number(seller.average_rating || 0),
        crops: (cropsBySeller[seller.id] || []).map((crop: any) => ({
          id: crop.id,
          name: crop.name,
          category: 'General', // Default category
          pricePerUnit: crop.price_per_unit,
          unit: crop.unit,
          quantityAvailable: crop.quantity_available
        })),
        estimatedDelivery: '30-45 mins', // Default estimate
        online: true // Assume verified sellers are online
      }));

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