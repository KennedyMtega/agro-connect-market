import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin, 
  Phone,
  Timer,
  Navigation,
  User
} from "lucide-react";
import { formatTZS } from "@/utils/currency";
import { Order } from "@/hooks/useSellerOrders";
import { useDeliveryTracking } from "@/hooks/useDeliveryTracking";

interface OrderTrackingCardProps {
  order: Order;
  onCallSeller?: () => void;
}

const OrderTrackingCard: React.FC<OrderTrackingCardProps> = ({ 
  order, 
  onCallSeller 
}) => {
  const [countdown, setCountdown] = useState<string>('');
  const { tracking } = useDeliveryTracking(order.id);

  // Calculate countdown based on estimated delivery
  useEffect(() => {
    if (!tracking?.estimated_arrival || order.status === 'delivered' || order.status === 'cancelled') {
      setCountdown('');
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const estimatedArrival = new Date(tracking.estimated_arrival!);
      const diff = estimatedArrival.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown('Delivery time reached');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tracking, order.status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_transit': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <Package className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending': return 'Waiting for seller confirmation';
      case 'confirmed': return 'Order confirmed, preparing for delivery';
      case 'in_transit': return 'Package is on the way';
      case 'delivered': return 'Package delivered successfully';
      case 'cancelled': return 'Order was cancelled';
      default: return 'Processing order';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order #{order.id.slice(-8)}
          </CardTitle>
          <Badge className={getStatusColor(order.status)}>
            {getStatusIcon(order.status)}
            <span className="ml-1">{order.status.replace('_', ' ')}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Delivery Countdown */}
        {countdown && (order.status === 'confirmed' || order.status === 'in_transit') && (
          <div className="text-center p-4 bg-blue-50 rounded-lg border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Estimated Delivery</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {countdown}
            </div>
            {tracking?.estimated_arrival && (
              <p className="text-sm text-blue-600">
                Expected at {new Date(tracking.estimated_arrival).toLocaleTimeString()}
              </p>
            )}
          </div>
        )}

        {/* Order Status */}
        <div>
          <h3 className="font-medium mb-3">Order Status</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                order.status !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Order Placed</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['confirmed', 'in_transit', 'delivered'].includes(order.status)
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Order Confirmed</p>
                <p className="text-sm text-muted-foreground">
                  {['confirmed', 'in_transit', 'delivered'].includes(order.status)
                    ? 'Confirmed by seller'
                    : 'Waiting for confirmation'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['in_transit', 'delivered'].includes(order.status)
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <Truck className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Out for Delivery</p>
                <p className="text-sm text-muted-foreground">
                  {['in_transit', 'delivered'].includes(order.status)
                    ? 'Package is on the way'
                    : 'Not yet dispatched'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                order.status === 'delivered'
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Delivered</p>
                <p className="text-sm text-muted-foreground">
                  {order.status === 'delivered' ? 'Package delivered' : 'Pending delivery'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        {tracking && (
          <div>
            <h3 className="font-medium mb-3">Delivery Information</h3>
            <div className="space-y-2 text-sm">
              {tracking.driver_name && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Driver: {tracking.driver_name}</span>
                </div>
              )}
              {tracking.driver_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{tracking.driver_phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Delivering to: {order.delivery_address}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Updates */}
        {tracking?.status_updates && tracking.status_updates.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">Recent Updates</h3>
            <div className="space-y-2">
              {tracking.status_updates.slice(-3).reverse().map((update: any, index: number) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{update.message}</p>
                    <p className="text-muted-foreground">
                      {new Date(update.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Order Summary */}
        <div>
          <h3 className="font-medium mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items ({order.order_items?.length || 0})</span>
              <span>{formatTZS(order.total_amount - (order.delivery_fee || 0))}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{formatTZS(order.delivery_fee || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status</span>
              <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                {order.payment_status || 'pending'}
              </Badge>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatTZS(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {tracking?.driver_phone && order.status === 'in_transit' && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.open(`tel:${tracking.driver_phone}`)}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Driver
            </Button>
          )}
          {onCallSeller && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onCallSeller}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Seller
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTrackingCard;