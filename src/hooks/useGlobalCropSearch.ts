import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Seller } from './useSellers';

export const useGlobalCropSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const searchCropsGlobally = async (query: string): Promise<Seller[]> => {
    if (!query.trim()) {
      return [];
    }

    try {
      setIsSearching(true);

      // First search for sellers by business name/description
      const { data: businessMatches, error: businessError } = await supabase
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
        .or(`business_name.ilike.%${query}%,business_description.ilike.%${query}%`)
        .not('store_location_lat', 'is', null)
        .not('store_location_lng', 'is', null);

      // Then search for sellers that have crops matching the query
      const { data: cropMatches, error: cropError } = await supabase
        .from('seller_profiles')
        .select(`
          *,
          profiles!seller_profiles_user_id_fkey (
            full_name,
            city
          ),
          crops!inner (
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
        .eq('crops.is_active', true)
        .or(`crops.name.ilike.%${query}%,crops.description.ilike.%${query}%`)
        .not('store_location_lat', 'is', null)
        .not('store_location_lng', 'is', null);

      if (businessError) throw businessError;
      if (cropError) throw cropError;

      // Combine and deduplicate results
      const combinedResults = [...(businessMatches || []), ...(cropMatches || [])];
      const uniqueResults = combinedResults.filter((seller, index, self) => 
        index === self.findIndex(s => s.id === seller.id)
      );

      // Transform the data to match our interface
      const transformedSellers: Seller[] = (uniqueResults || []).map(seller => ({
        id: seller.id,
        business_name: seller.business_name,
        business_description: seller.business_description || '',
        average_rating: seller.average_rating || 0,
        delivery_radius_km: seller.delivery_radius_km || 10,
        verification_status: seller.verification_status || 'pending',
        user_id: seller.user_id,
        crops: (seller.crops || [])
          .filter((crop: any) => crop.is_active && crop.quantity_available > 0)
          .map((crop: any) => ({
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
        distance: Math.floor(Math.random() * 50) + 1, // Global search can show farther distances
        estimatedDelivery: "45-60 min", // Longer delivery for global search
        online: Math.random() > 0.3,
      }));

      console.log(`Search for "${query}" found ${transformedSellers.length} sellers`);
      return transformedSellers;
    } catch (error: any) {
      console.error('Error searching crops:', error);
      toast({
        title: "Search Error",
        description: "Could not search for crops. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchCropsGlobally,
    isSearching,
  };
};