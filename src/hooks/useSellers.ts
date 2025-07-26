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

      // Fetch verified sellers with their crops and profiles
      const { data: sellersData, error: sellersError } = await supabase
        .from('seller_profiles')
        .select(`
          *,
          profiles!seller_profiles_user_id_fkey (
            full_name,
            city
          ),
          crops (
            id,
            name,
            description,
            price_per_unit,
            unit,
            quantity_available,
            is_organic,
            is_active,
            crop_categories (
              name
            )
          )
        `)
        .eq('verification_status', 'verified')
        .not('store_location_lat', 'is', null)
        .not('store_location_lng', 'is', null);

      if (sellersError) {
        throw sellersError;
      }

      // Transform the data to match our interface
      const transformedSellers: Seller[] = (sellersData || []).map(seller => ({
        id: seller.id,
        business_name: seller.business_name,
        business_description: seller.business_description || '',
        average_rating: seller.average_rating || 0,
        delivery_radius_km: seller.delivery_radius_km || 10,
        verification_status: seller.verification_status || 'pending',
        user_id: seller.user_id,
        crops: (seller.crops || []).map((crop: any) => ({
          id: crop.id,
          name: crop.name,
          description: crop.description || '',
          price_per_unit: crop.price_per_unit,
          unit: crop.unit,
          quantity_available: crop.quantity_available,
          is_organic: crop.is_organic || false,
          category: crop.crop_categories ? { name: crop.crop_categories.name } : undefined,
        })),
        profile: seller.profiles ? {
          full_name: seller.profiles.full_name,
          location_lat: seller.store_location_lat,
          location_lng: seller.store_location_lng,
          city: seller.profiles.city,
        } : undefined,
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