
import React from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vendor } from '@/types/map';
import { formatCurrency } from '@/utils/formatUtils';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, ShoppingCart, Star, MapPin } from 'lucide-react';

interface SearchResultsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: Vendor[];
  searchQuery: string;
  onVendorSelect: (vendor: Vendor) => void;
}

const SearchResultsDrawer: React.FC<SearchResultsDrawerProps> = ({
  isOpen,
  onClose,
  vendors,
  searchQuery,
  onVendorSelect
}) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Filter and sort crops based on search query and distance
  const searchResults = vendors
    .flatMap(vendor => 
      vendor.crops
        .filter(crop => 
          crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crop.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(crop => ({ crop, vendor }))
    )
    .sort((a, b) => a.vendor.distance - b.vendor.distance);

  const handleAddToCart = (crop: any, vendor: Vendor) => {
    addToCart(crop, 1);
    toast({
      title: "Added to Cart",
      description: `${crop.name} from ${vendor.name} added to cart`,
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[70vh] rounded-t-xl">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                Search Results for "{searchQuery}"
              </h3>
              <p className="text-sm text-gray-600">
                {searchResults.length} items found • Sorted by distance
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No crops found matching "{searchQuery}"
              </div>
            ) : (
              searchResults.map(({ crop, vendor }) => (
                <Card key={`${vendor.id}-${crop.id}`} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{crop.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <span className="font-medium">{vendor.name}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{vendor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{vendor.distance.toFixed(1)} km</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-600">
                            {formatCurrency(crop.pricePerUnit)}/{crop.unit}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {crop.quantityAvailable} {crop.unit} available
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onVendorSelect(vendor)}
                        >
                          View Seller
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAddToCart(crop, vendor)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="mt-4 pt-4 border-t">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => window.location.href = '/cart'}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              View Cart
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchResultsDrawer;
