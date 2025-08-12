import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Seller {
  id: string;
  business_name: string;
  business_description: string;
  average_rating: number;
  delivery_radius_km: number;
  verification_status: string;
  crops: Crop[];
  distance?: number;
  estimatedDelivery?: string;
  online?: boolean;
  user_id: string;
  profile?: {
    full_name: string;
    location_lat: number;
    location_lng: number;
    city: string;
  };
}

export interface Crop {
  id: string;
  name: string;
  description: string;
  price_per_unit: number;
  unit: string;
  quantity_available: number;
  is_organic: boolean;
  category?: {
    name: string;
  };
}

export const useSellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch verified sellers (public-safe RPC)
      const { data: sellersData, error: sellersError } = await (supabase as any)
        .rpc('get_verified_sellers_public');

      if (sellersError) {
        throw sellersError;
      }

      const sellersList: any[] = (sellersData as any[]) || [];
      const sellerIds = sellersList.map((s: any) => s.id);

      // Fetch active crops for these sellers
      const { data: cropsData, error: cropsError } = await supabase
        .from('crops')
        .select(`
          id,
          name,
          description,
          price_per_unit,
          unit,
          quantity_available,
          is_organic,
          is_active,
          seller_id,
          crop_categories ( name )
        `)
        .eq('is_active', true)
        .in('seller_id', sellerIds);

      if (cropsError) {
        throw cropsError;
      }

      const cropsBySeller: Record<string, any[]> = {};
      (cropsData || []).forEach((c: any) => {
        if (!cropsBySeller[c.seller_id]) cropsBySeller[c.seller_id] = [];
        cropsBySeller[c.seller_id].push(c);
      });

      if (sellersError) {
        throw sellersError;
      }

      // Transform the data to match our interface
      const transformedSellers: Seller[] = sellersList.map((seller: any) => ({
        id: seller.id,
        business_name: seller.business_name,
        business_description: seller.business_description || '',
        average_rating: Number(seller.average_rating || 0),
        delivery_radius_km: seller.delivery_radius_km || 10,
        verification_status: seller.verification_status || 'pending',
        user_id: seller.user_id,
        crops: (cropsBySeller[seller.id] || []).map((crop: any) => ({
          id: crop.id,
          name: crop.name,
          description: crop.description || '',
          price_per_unit: crop.price_per_unit,
          unit: crop.unit,
          quantity_available: crop.quantity_available,
          is_organic: crop.is_organic || false,
          category: crop.crop_categories ? { name: crop.crop_categories.name } : undefined,
        })),
        profile: undefined,
        // Add default values for UI
        distance: Math.floor(Math.random() * 10) + 1, // TODO: Calculate actual distance
        estimatedDelivery: "30-45 min", // TODO: Calculate based on distance
        online: Math.random() > 0.3, // TODO: Track actual online status
      }));

      setSellers(transformedSellers);
    } catch (error: any) {
      console.error('Error fetching sellers:', error);
      setError(error.message);
      toast({
        title: "Error Loading Sellers",
        description: "Could not load seller data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  return {
    sellers,
    loading,
    error,
    refetch: fetchSellers,
  };
};