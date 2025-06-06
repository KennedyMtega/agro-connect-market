
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vendor } from '@/types/map';
import { formatCurrency } from '@/utils/formatUtils';
import { Star, MapPin, Clock } from 'lucide-react';

interface BottomCardProps {
  vendor: Vendor | null;
  onClose: () => void;
  onViewDetails: (vendor: Vendor) => void;
}

const BottomCard: React.FC<BottomCardProps> = ({ vendor, onClose, onViewDetails }) => {
  if (!vendor) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
      <Card className="bg-white shadow-lg border-0 rounded-t-2xl">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{vendor.name}</h3>
                {vendor.online && (
                  <Badge className="bg-green-100 text-green-700 text-xs">Online</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{vendor.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{vendor.distance.toFixed(1)} km away</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{vendor.estimatedDelivery}</span>
                </div>
              </div>

              <div className="flex gap-2 mb-3">
                {vendor.crops.slice(0, 3).map((crop) => (
                  <Badge key={crop.id} variant="outline" className="text-xs">
                    {crop.name} - {formatCurrency(crop.pricePerUnit)}/{crop.unit}
                  </Badge>
                ))}
                {vendor.crops.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{vendor.crops.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Continue Shopping
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onViewDetails(vendor)}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BottomCard;
