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

      // First search for sellers by business name/description (public-safe RPC)
      const { data: businessMatches, error: businessError } = await (supabase as any)
        .rpc('search_verified_sellers_public', { _query: query });

      if (businessError) throw businessError;

      // Then search crops and map to their sellers
      const { data: cropRows, error: cropError } = await supabase
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
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

      if (cropError) throw cropError;

      const sellerIdsFromCrops = Array.from(new Set((cropRows || []).map((c: any) => c.seller_id)));

      let sellersFromCrops: any[] = [];
      if (sellerIdsFromCrops.length > 0) {
        const { data: sellersByIds, error: idsError } = await (supabase as any)
          .rpc('get_verified_sellers_by_ids', { _ids: sellerIdsFromCrops });
        if (idsError) throw idsError;
        sellersFromCrops = (sellersByIds as any[]) || [];
      }

      // Combine and deduplicate seller results
      const combinedResults: any[] = ([...(businessMatches as any[] || []), ...sellersFromCrops]);
      const uniqueResults = combinedResults.filter((seller, index, self) => 
        index === self.findIndex((s) => s.id === seller.id)
      );

      // Fetch all active crops for the resulting sellers
      const { data: allCrops, error: allCropsError } = await supabase
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
        .in('seller_id', uniqueResults.map((s: any) => s.id));

      if (allCropsError) throw allCropsError;

      const cropsBySeller: Record<string, any[]> = {};
      (allCrops || []).forEach((c: any) => {
        if (!cropsBySeller[c.seller_id]) cropsBySeller[c.seller_id] = [];
        cropsBySeller[c.seller_id].push(c);
      });

      // Transform the data to match our interface
      const transformedSellers: Seller[] = (uniqueResults || []).map((seller: any) => ({
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
        distance: Math.floor(Math.random() * 50) + 1, // Global search can show farther distances
        estimatedDelivery: "45-60 min", // Longer delivery for global search
        online: Math.random() > 0.3,
      }));

      console.log(`Search for "${query}" found ${transformedSellers.length} sellers`);
      if (transformedSellers.length === 0) {
        console.log('No sellers found. Query used:', query);
        console.log('Business matches:', (businessMatches as any[])?.length || 0);
        console.log('Crop seller IDs count:', sellerIdsFromCrops.length || 0);
      }
      
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