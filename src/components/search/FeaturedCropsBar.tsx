import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { formatTZS } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Crop } from "@/types";

interface FeaturedCrop {
  id: string;
  name: string;
  description: string | null;
  price_per_unit: number;
  unit: string;
  quantity_available: number;
  images: string[] | null;
  seller_id: string;
  business_name: string;
  store_location: string;
}

export const FeaturedCropsBar = () => {
  const [crops, setCrops] = useState<FeaturedCrop[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedCrops();
  }, []);

  const fetchFeaturedCrops = async () => {
    try {
      const { data, error } = await supabase.rpc('get_featured_crops');
      
      if (error) throw error;
      setCrops(data || []);
    } catch (error) {
      console.error('Error fetching featured crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (featuredCrop: FeaturedCrop) => {
    // Convert FeaturedCrop to Crop type for addToCart
    const crop: Crop = {
      id: featuredCrop.id,
      name: featuredCrop.name,
      description: featuredCrop.description || undefined,
      pricePerUnit: featuredCrop.price_per_unit,
      unit: featuredCrop.unit,
      quantityAvailable: featuredCrop.quantity_available,
      sellerId: featuredCrop.seller_id,
      sellerName: featuredCrop.business_name,
      images: featuredCrop.images || undefined,
      category: "featured",
    };
    
    addToCart(crop, 1);
    
    toast({
      title: "Added to Cart",
      description: `${featuredCrop.name} from ${featuredCrop.business_name} added to your cart.`,
    });
  };

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('featured-crops-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Always show the bar - show loading state, then crops or "no featured" message
  if (loading) {
    return (
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm border-t shadow-lg">
        <div className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold text-sm">Featured Crops</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-48 rounded-lg border bg-card p-3">
                <Skeleton className="h-16 w-full rounded mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show message when no featured crops available
  if (crops.length === 0) {
    return (
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm border-t shadow-lg">
        <div className="p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold text-sm">Featured Crops</span>
            <Badge variant="secondary" className="text-xs">
              No featured crops available
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm border-t shadow-lg">
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold text-sm">Featured Crops</span>
            <Badge variant="secondary" className="text-xs">
              {crops.length} available
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => scrollContainer('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => scrollContainer('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div 
          id="featured-crops-container"
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {crops.map((crop) => (
            <div 
              key={crop.id} 
              className="flex-shrink-0 w-52 rounded-lg border bg-card p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-3">
                {crop.images?.[0] ? (
                  <img 
                    src={crop.images[0]} 
                    alt={crop.name}
                    className="h-14 w-14 rounded-md object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🌾</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{crop.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{crop.business_name}</p>
                  <p className="text-sm font-semibold text-green-600 mt-1">
                    {formatTZS(crop.price_per_unit)}/{crop.unit}
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="w-full mt-2 h-8 bg-green-600 hover:bg-green-700"
                onClick={() => handleAddToCart(crop)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
