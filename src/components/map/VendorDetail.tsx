
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, MessageCircle, Navigation, ShoppingCart, Star } from "lucide-react";
import { Vendor } from '@/types/map';

interface VendorDetailProps {
  vendor: Vendor;
  selectedCrop: string;
  setSelectedCrop: (id: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  onBack: () => void;
  onPurchase: () => void;
  isMessageOpen: boolean;
  setIsMessageOpen: (isOpen: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  onNavigate: () => void;
}

const VendorDetail: React.FC<VendorDetailProps> = ({
  vendor,
  selectedCrop,
  setSelectedCrop,
  quantity,
  setQuantity,
  onBack,
  onPurchase,
  isMessageOpen,
  setIsMessageOpen,
  message,
  setMessage,
  onSendMessage,
  onNavigate
}) => {
  return (
    <div className="absolute bottom-4 left-2 right-2 z-10">
      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-lg flex items-center">
                {vendor.name}
                {vendor.online && (
                  <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </CardTitle>
              <div className="flex items-center">
                <div className="flex items-center text-amber-500 mr-2">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="ml-1 text-xs">{vendor.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {vendor.distance} km • {vendor.estimatedDelivery}
                </span>
              </div>
            </div>
          </div>
          <div className="flex">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-1" 
              onClick={() => setIsMessageOpen(!isMessageOpen)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onNavigate}>
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        {/* Message panel */}
        {isMessageOpen && (
          <div className="mx-4 mb-2 p-3 bg-muted rounded-md">
            <h4 className="text-sm font-medium mb-2">Message to Vendor</h4>
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="text-sm"
              />
              <Button size="sm" onClick={onSendMessage}>Send</Button>
            </div>
          </div>
        )}
        
        <CardContent className="p-4 pt-2">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="crop-select">
                Select Crop
              </label>
              <select
                id="crop-select"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              >
                <option value="">Select a crop</option>
                {vendor.crops.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name} - ${crop.pricePerUnit}/{crop.unit} ({crop.quantityAvailable} available)
                  </option>
                ))}
              </select>
            </div>
            
            {selectedCrop && (
              <div>
                <label className="text-sm font-medium" htmlFor="quantity">
                  Quantity
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <span>-</span>
                  </Button>
                  <Input 
                    id="quantity"
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
            
            {selectedCrop && (
              <div className="bg-muted p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Order Summary</h4>
                <div className="flex justify-between text-sm">
                  <span>Price:</span>
                  <span>
                    ${(
                      (vendor.crops.find(c => c.id === selectedCrop)?.pricePerUnit || 0) * 
                      quantity
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee:</span>
                  <span>$2.99</span>
                </div>
                <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span>
                    ${(
                      (vendor.crops.find(c => c.id === selectedCrop)?.pricePerUnit || 0) * 
                      quantity + 2.99
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full" 
            onClick={onPurchase}
            disabled={!selectedCrop}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Purchase Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VendorDetail;
