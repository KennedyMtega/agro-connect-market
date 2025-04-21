
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";
import { Vendor } from '@/types/map';

interface VendorListProps {
  vendors: Vendor[];
  searchTerm: string;
  onSelectVendor: (vendor: Vendor) => void;
  onReset: () => void;
}

const VendorList: React.FC<VendorListProps> = ({ 
  vendors, 
  searchTerm, 
  onSelectVendor, 
  onReset 
}) => {
  return (
    <div className="absolute bottom-4 left-2 right-2 z-10">
      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Vendors with "{searchTerm}"</CardTitle>
            <p className="text-sm text-muted-foreground">{vendors.length} vendors found</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onReset}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-2 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            {vendors.map((vendor) => (
              <Card 
                key={vendor.id} 
                className="cursor-pointer hover:bg-accent transition-colors" 
                onClick={() => onSelectVendor(vendor)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium flex items-center">
                        {vendor.name}
                        {vendor.online && (
                          <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                      </h3>
                      <div className="flex items-center text-amber-500 mt-1 text-sm">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="ml-1">{vendor.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{vendor.distance} km away</div>
                      <div className="text-xs text-muted-foreground">
                        {vendor.estimatedDelivery}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorList;
