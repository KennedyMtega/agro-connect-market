
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, MapPin, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

interface SellerCardProps {
  seller: any;
  selectedCropType: string;
}

const SellerCard: React.FC<SellerCardProps> = ({ seller, selectedCropType }) => {
  const { addToCart } = useCart();
  const [selectedCrop, setSelectedCrop] = useState(seller.crops[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const filteredCrops = selectedCropType 
    ? seller.crops.filter((crop: any) => crop.category.toLowerCase() === selectedCropType.toLowerCase())
    : seller.crops;
  
  if (filteredCrops.length === 0) return null;

  const handleAddToCart = () => {
    const crop = seller.crops.find((c: any) => c.id === selectedCrop);
    if (!crop) return;
    
    addToCart({...crop, sellerId: seller.id, sellerName: seller.name}, quantity);

    toast({
      title: "Added to cart",
      description: `${quantity} ${crop.unit} of ${crop.name} from ${seller.name}`,
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              {seller.name}
              {seller.online && (
                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </CardTitle>
            <div className="flex items-center text-amber-500 mt-1">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm">{seller.rating}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{seller.distance} km away</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-end">
              <Clock className="h-3 w-3 mr-1" />
              <span>{seller.estimatedDelivery}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{seller.location}</span>
        </div>
        
        <div className="mt-4 space-y-3">
          <div>
            <Label htmlFor={`crop-${seller.id}`}>Select Crop</Label>
            <Select 
              value={selectedCrop} 
              onValueChange={setSelectedCrop}
            >
              <SelectTrigger id={`crop-${seller.id}`}>
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                {filteredCrops.map((crop: any) => (
                  <SelectItem key={crop.id} value={crop.id}>
                    {crop.name} - ${crop.pricePerUnit}/{crop.unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedCrop && (
            <div>
              <Label htmlFor={`quantity-${seller.id}`}>Quantity</Label>
              <div className="flex items-center gap-2 mt-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <span>-</span>
                </Button>
                <Input 
                  id={`quantity-${seller.id}`}
                  type="number" 
                  min="1" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <span>+</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          disabled={!selectedCrop}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SellerCard;
