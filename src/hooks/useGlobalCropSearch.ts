import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SearchCrop {
  id: string;
  name: string;
  description: string;
  price_per_unit: number;
  unit: string;
  quantity_available: number;
  is_organic: boolean;
  location_lat: number;
  location_lng: number;
  seller: {
    id: string;
    business_name: string;
    business_description: string;
    average_rating: number;
    verification_status: string;
    store_location: string;
    user_id: string;
    full_name: string;
    city: string;
  };
  category: {
    name: string;
  } | null;
}

export interface SearchResult {
  crops: SearchCrop[];
  totalCount: number;
  searchQuery: string;
}

export const useGlobalCropSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResult>({
    crops: [],
    totalCount: 0,
    searchQuery: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fuzzy search function to handle typos and similar words
  const createSearchPattern = (query: string): string => {
    if (!query.trim()) return '';
    
    // Clean the query and create a flexible pattern
    const cleanQuery = query.toLowerCase().trim();
    const words = cleanQuery.split(/\s+/);
    
    // Create a pattern that allows for partial matches and typos
    const patterns = words.map(word => {
      // For words longer than 3 characters, allow for some flexibility
      if (word.length > 3) {
        return `%${word}%`;
      }
      return word;
    });
    
    return patterns.join('|');
  };

  const searchCrops = useCallback(async (query: string, limit: number = 50) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!query.trim()) {
        // If no query, return recent crops or all crops
        const { data, error, count } = await supabase
          .from('crops')
          .select(`
            *,
            seller_profiles!crops_seller_id_fkey (
              id,
              business_name,
              business_description,
              average_rating,
              verification_status,
              store_location,
              user_id,
              profiles!seller_profiles_user_id_fkey (
                full_name,
                city
              )
            ),
            crop_categories (
              name
            )
          `, { count: 'exact' })
          .eq('is_active', true)
          .not('seller_id', 'is', null)
          .not('location_lat', 'is', null)
          .not('location_lng', 'is', null)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        const transformedCrops: SearchCrop[] = (data || [])
          .filter(crop => crop.seller_profiles && crop.seller_profiles.verification_status === 'verified')
          .map(crop => ({
            id: crop.id,
            name: crop.name,
            description: crop.description || '',
            price_per_unit: crop.price_per_unit,
            unit: crop.unit,
            quantity_available: crop.quantity_available,
            is_organic: crop.is_organic || false,
            location_lat: crop.location_lat,
            location_lng: crop.location_lng,
            seller: {
              id: crop.seller_profiles.id,
              business_name: crop.seller_profiles.business_name,
              business_description: crop.seller_profiles.business_description || '',
              average_rating: crop.seller_profiles.average_rating || 0,
              verification_status: crop.seller_profiles.verification_status,
              store_location: crop.seller_profiles.store_location || '',
              user_id: crop.seller_profiles.user_id,
              full_name: crop.seller_profiles.profiles?.full_name || '',
              city: crop.seller_profiles.profiles?.city || '',
            },
            category: crop.crop_categories,
          }));

        setSearchResults({
          crops: transformedCrops,
          totalCount: count || 0,
          searchQuery: ''
        });

        return;
      }

      // Search with flexible matching
      const searchPattern = `%${query.toLowerCase()}%`;
      
      const { data, error, count } = await supabase
        .from('crops')
        .select(`
          *,
          seller_profiles!crops_seller_id_fkey (
            id,
            business_name,
            business_description,
            average_rating,
            verification_status,
            store_location,
            user_id,
            profiles!seller_profiles_user_id_fkey (
              full_name,
              city
            )
          ),
          crop_categories (
            name
          )
        `, { count: 'exact' })
        .eq('is_active', true)
        .not('seller_id', 'is', null)
        .not('location_lat', 'is', null)
        .not('location_lng', 'is', null)
        .or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Also search by category name
      const { data: categoryData, error: categoryError } = await supabase
        .from('crops')
        .select(`
          *,
          seller_profiles!crops_seller_id_fkey (
            id,
            business_name,
            business_description,
            average_rating,
            verification_status,
            store_location,
            user_id,
            profiles!seller_profiles_user_id_fkey (
              full_name,
              city
            )
          ),
          crop_categories!inner (
            name
          )
        `)
        .eq('is_active', true)
        .not('seller_id', 'is', null)
        .not('location_lat', 'is', null)
        .not('location_lng', 'is', null)
        .ilike('crop_categories.name', searchPattern)
        .limit(limit);

      if (categoryError) {
        console.warn('Category search error:', categoryError);
      }

      // Combine and deduplicate results
      const allData = [...(data || []), ...(categoryData || [])];
      const uniqueData = allData.filter((crop, index, self) => 
        index === self.findIndex(c => c.id === crop.id)
      );

      const transformedCrops: SearchCrop[] = uniqueData
        .filter(crop => crop.seller_profiles && crop.seller_profiles.verification_status === 'verified')
        .map(crop => ({
          id: crop.id,
          name: crop.name,
          description: crop.description || '',
          price_per_unit: crop.price_per_unit,
          unit: crop.unit,
          quantity_available: crop.quantity_available,
          is_organic: crop.is_organic || false,
          location_lat: crop.location_lat,
          location_lng: crop.location_lng,
          seller: {
            id: crop.seller_profiles.id,
            business_name: crop.seller_profiles.business_name,
            business_description: crop.seller_profiles.business_description || '',
            average_rating: crop.seller_profiles.average_rating || 0,
            verification_status: crop.seller_profiles.verification_status,
            store_location: crop.seller_profiles.store_location || '',
            user_id: crop.seller_profiles.user_id,
            full_name: crop.seller_profiles.profiles?.full_name || '',
            city: crop.seller_profiles.profiles?.city || '',
          },
          category: crop.crop_categories,
        }));

      setSearchResults({
        crops: transformedCrops,
        totalCount: transformedCrops.length,
        searchQuery: query
      });

      toast({
        title: "Search Complete",
        description: `Found ${transformedCrops.length} crops matching "${query}"`,
      });

    } catch (error: any) {
      console.error('Error searching crops:', error);
      setError(error.message);
      toast({
        title: "Search Error",
        description: "Failed to search crops. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const clearSearch = useCallback(() => {
    setSearchResults({
      crops: [],
      totalCount: 0,
      searchQuery: ''
    });
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    searchCrops,
    clearSearch,
  };
};