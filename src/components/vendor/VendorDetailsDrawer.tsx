
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Vendor, Crop } from '@/types/map';
import { useCart } from '@/context/CartContext';
import { Star, MapPin, ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatUtils';

// A component for a single crop item in the drawer
const CropListItem = ({ crop, vendor }: { crop: any, vendor: Vendor }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({ ...crop, sellerId: vendor.id, sellerName: vendor.name }, quantity);
        setQuantity(1);
    };

    const handleIncrement = () => setQuantity(q => q < crop.quantityAvailable ? q + 1 : q);
    const handleDecrement = () => setQuantity(q => q > 1 ? q - 1 : 1);

    return (
        <div className="flex items-center justify-between p-3 border-b last:border-b-0">
            <div>
                <h4 className="font-medium">{crop.name}</h4>
                <p className="text-sm text-green-600 font-semibold">{formatCurrency(crop.pricePerUnit)} / {crop.unit}</p>
                <p className="text-xs text-muted-foreground">{crop.quantityAvailable} available</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleDecrement} disabled={quantity <= 1}><Minus className="h-4 w-4" /></Button>
                    <span className="w-6 text-center font-medium">{quantity}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleIncrement} disabled={quantity >= crop.quantityAvailable}><Plus className="h-4 w-4" /></Button>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleAddToCart}>
                    <ShoppingCart className="h-4 w-4 mr-2" /> Add
                </Button>
            </div>
        </div>
    );
};

interface VendorDetailsDrawerProps {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
}

const VendorDetailsDrawer: React.FC<VendorDetailsDrawerProps> = ({ vendor, isOpen, onClose }) => {
  if (!vendor) return null;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <div className="relative">
          <DrawerHeader className="text-left pr-12">
            <DrawerTitle className="text-xl font-bold">{vendor.name}</DrawerTitle>
            <DrawerDescription>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{vendor.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{vendor.distance.toFixed(1)} km away</span>
                </div>
                {vendor.online && <Badge className="bg-green-100 text-green-800 border-green-200">Online</Badge>}
              </div>
            </DrawerDescription>
          </DrawerHeader>

          <Button variant="ghost" size="icon" className="absolute top-3 right-3 rounded-full" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>

          <div className="overflow-y-auto px-4 pb-4 max-h-[calc(85vh-180px)]">
            <h3 className="text-md font-semibold mb-2 mt-2">All Products</h3>
            <div className="border rounded-lg overflow-hidden">
                {vendor.crops.map(crop => (
                    <CropListItem key={crop.id} crop={crop} vendor={vendor} />
                ))}
            </div>
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => window.location.href='/cart'}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Cart
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default VendorDetailsDrawer;
