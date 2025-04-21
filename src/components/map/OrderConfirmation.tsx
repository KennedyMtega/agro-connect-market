
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import { Vendor } from '@/types/map';

interface OrderConfirmationProps {
  vendor: Vendor;
  onReset: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ vendor, onReset }) => {
  return (
    <div className="absolute bottom-4 left-2 right-2 z-10">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-1">Order Confirmed!</h3>
            <p className="text-muted-foreground mb-4">
              Your order from {vendor.name} is on its way.
            </p>
            <div className="w-full bg-muted p-3 rounded-md mb-4">
              <h4 className="text-sm font-medium mb-2">Estimated Delivery Time</h4>
              <p className="text-lg font-semibold">{vendor.estimatedDelivery}</p>
            </div>
            <Button variant="outline" onClick={onReset} className="w-full">
              Back to Search
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmation;
