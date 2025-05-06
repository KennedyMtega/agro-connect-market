
import React, { useState } from "react";
import { Vendor } from "@/types/map";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/formatUtils";
import { Crop } from "@/types";

interface CropSearchResultsProps {
  vendors: Vendor[];
  onSelectVendor: (vendor: Vendor) => void;
  searchQuery: string;
}

interface CropItemProps {
  crop: Crop;
  vendorName: string;
  vendorDistance: number;
}

const CropItem: React.FC<CropItemProps> = ({ crop, vendorName, vendorDistance }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const handleIncrement = () => {
    if (quantity < crop.quantityAvailable) {
      setQuantity(q => q + 1);
    } else {
      toast({
        title: "Maximum quantity reached",
        description: `Only ${crop.quantityAvailable} ${crop.unit} available.`,
        variant: "destructive"
      });
    }
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(crop, quantity);
    setQuantity(1);
  };
  
  return (
    <Card className="mb-3 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-lg">{crop.name}</h4>
            <p className="text-sm text-muted-foreground">
              {vendorName} • {vendorDistance.toFixed(1)} km away
            </p>
            <p className="text-green-700 font-semibold mt-1">
              {formatCurrency(crop.pricePerUnit)} / {crop.unit}
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full border-green-500 text-green-600"
                onClick={handleDecrement}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-6 text-center">
                {quantity}
              </span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full border-green-500 text-green-600"
                onClick={handleIncrement}
                disabled={quantity >= crop.quantityAvailable}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-sm h-8"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CropSearchResults: React.FC<CropSearchResultsProps> = ({
  vendors,
  onSelectVendor,
  searchQuery
}) => {
  // Filter crops that match the search query
  const matchingCrops = vendors.flatMap(vendor => 
    vendor.crops
      .filter(crop => 
        crop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        crop.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(crop => ({ crop, vendor }))
  );
  
  if (matchingCrops.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No crops found matching "{searchQuery}"</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {matchingCrops.map(({ crop, vendor }) => (
        <CropItem
          key={`${vendor.id}-${crop.id}`}
          crop={crop}
          vendorName={vendor.name}
          vendorDistance={vendor.distance}
        />
      ))}
      
      <div className="p-4">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={() => window.location.href = "/cart"}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          View Cart
        </Button>
      </div>
    </div>
  );
};

export default CropSearchResults;
