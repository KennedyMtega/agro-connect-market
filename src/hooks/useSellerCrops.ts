import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Crop {
  id: string;
  name: string;
  description?: string;
  price_per_unit: number;
  unit: string;
  quantity_available: number;
  category_id?: string;
  harvest_date?: string;
  is_organic: boolean;
  is_featured: boolean;
  is_active: boolean;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export const useSellerCrops = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCrops = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCrops(data || []);
    } catch (err) {
      console.error('Error fetching crops:', err);
      setError('Failed to load crops');
    } finally {
      setLoading(false);
    }
  };

  const addCrop = async (cropData: Omit<Crop, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('crops')
        .insert([{ ...cropData, seller_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setCrops(prev => [data, ...prev]);
      toast({
        title: "Crop Added",
        description: "Your crop has been added successfully.",
      });
      return true;
    } catch (err) {
      console.error('Error adding crop:', err);
      toast({
        title: "Error",
        description: "Failed to add crop. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCrop = async (id: string, updates: Partial<Crop>) => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCrops(prev => prev.map(crop => crop.id === id ? { ...crop, ...data } : crop));
      toast({
        title: "Crop Updated",
        description: "Your crop has been updated successfully.",
      });
      return true;
    } catch (err) {
      console.error('Error updating crop:', err);
      toast({
        title: "Error",
        description: "Failed to update crop. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteCrop = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crops')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCrops(prev => prev.filter(crop => crop.id !== id));
      toast({
        title: "Crop Deleted",
        description: "Your crop has been deleted successfully.",
      });
      return true;
    } catch (err) {
      console.error('Error deleting crop:', err);
      toast({
        title: "Error",
        description: "Failed to delete crop. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [user]);

  return {
    crops,
    loading,
    error,
    addCrop,
    updateCrop,
    deleteCrop,
    refetch: fetchCrops
  };
};