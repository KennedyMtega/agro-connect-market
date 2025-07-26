import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Leaf, Plus } from 'lucide-react';
import { SearchCrop } from '@/hooks/useGlobalCropSearch';
import { formatTZS } from '@/utils/currency';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface CropSearchCardProps {
  crop: SearchCrop;
  onSellerSelect?: (sellerId: string) => void;
}

export const CropSearchCard: React.FC<CropSearchCardProps> = ({ 
  crop, 
  onSellerSelect 
}) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const cropForCart = {
      id: crop.id,
      name: crop.name,
      description: crop.description,
      category: crop.category?.name || 'General',
      pricePerUnit: crop.price_per_unit,
      unit: crop.unit,
      quantityAvailable: crop.quantity_available,
      sellerId: crop.seller.id,
      sellerName: crop.seller.business_name,
      images: [],
      isOrganic: crop.is_organic,
      location: {
        coordinates: {
          latitude: crop.location_lat,
          longitude: crop.location_lng,
        },
        address: crop.seller.store_location,
      },
    };

    addToCart(cropForCart, 1);
    toast({
      title: "Added to Cart",
      description: `${crop.name} has been added to your cart.`,
    });
  };

  const handleSellerClick = () => {
    if (onSellerSelect) {
      onSellerSelect(crop.seller.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {crop.name}
              {crop.is_organic && (
                <Badge variant="secondary" className="text-green-600">
                  <Leaf className="h-3 w-3 mr-1" />
                  Organic
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              {crop.description}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">
              {formatTZS(crop.price_per_unit)}/{crop.unit}
            </div>
            <div className="text-sm text-muted-foreground">
              {crop.quantity_available} {crop.unit} available
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Seller Information */}
          <div 
            className="p-3 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={handleSellerClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">{crop.seller.business_name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs ml-1">
                      {crop.seller.average_rating.toFixed(1)}
                    </span>
                  </div>
                  {crop.seller.city && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {crop.seller.city}
                    </div>
                  )}
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                className="ml-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Category */}
          {crop.category && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Category:</span>
              <Badge variant="outline">{crop.category.name}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};