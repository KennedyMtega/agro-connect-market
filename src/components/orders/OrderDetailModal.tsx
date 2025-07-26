import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  Package,
  Timer,
  Navigation,
  AlertCircle
} from "lucide-react";
import { formatTZS } from "@/utils/currency";
import { Order } from "@/hooks/useSellerOrders";
import { useDeliveryTracking } from "@/hooks/useDeliveryTracking";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => Promise<boolean>;
}

interface DeliveryEstimate {
  packagingTime: number; // minutes
  deliveryTime: number; // minutes
  totalTime: number; // minutes
  estimatedArrival: Date;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState<DeliveryEstimate | null>(null);
  const [countdown, setCountdown] = useState<string>('');
  const { tracking, createDeliveryTracking, updateDeliveryStatus } = useDeliveryTracking(order?.id);

  // Calculate delivery estimate based on distance
  const calculateDeliveryEstimate = (order: Order): DeliveryEstimate => {
    // Mock distance calculation - in real app, use Google Maps Distance Matrix API
    const baseDeliveryTime = 30; // Base 30 minutes
    const packagingTime = 10; // 10 minutes for packaging
    const randomVariation = Math.floor(Math.random() * 20); // 0-20 minutes variation
    
    const deliveryTime = baseDeliveryTime + randomVariation;
    const totalTime = packagingTime + deliveryTime;
    const estimatedArrival = new Date(Date.now() + totalTime * 60000);

    return {
      packagingTime,
      deliveryTime,
      totalTime,
      estimatedArrival
    };
  };

  // Update countdown timer
  useEffect(() => {
    if (!deliveryEstimate || !order || order.status === 'delivered' || order.status === 'cancelled') {
      setCountdown('');
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = deliveryEstimate.estimatedArrival.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown('Delivered');
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
  }, [deliveryEstimate, order]);

  // Calculate delivery estimate when order changes
  useEffect(() => {
    if (order && (order.status === 'confirmed' || order.status === 'in_transit')) {
      setDeliveryEstimate(calculateDeliveryEstimate(order));
    } else {
      setDeliveryEstimate(null);
    }
  }, [order]);

  const handleStatusUpdate = async (status: Order['status']) => {
    if (!order) return;
    
    setIsUpdating(true);
    
    try {
      // Update order status
      const success = await onUpdateStatus(order.id, status);
      
      if (success) {
        // Create delivery tracking when order is confirmed
        if (status === 'confirmed') {
          const estimate = calculateDeliveryEstimate(order);
          setDeliveryEstimate(estimate);
          
          // Create delivery tracking record
          await createDeliveryTracking(order.id, estimate.estimatedArrival);
        }
        
        // Update delivery tracking when status changes
        if (tracking && (status === 'in_transit' || status === 'delivered')) {
          const statusMessage = status === 'in_transit' 
            ? 'Package is out for delivery' 
            : 'Package has been delivered successfully';
            
          await updateDeliveryStatus(
            tracking.id, 
            status, 
            statusMessage,
            status === 'delivered' ? order.delivery_address : 'En route'
          );
        }
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending': return 'confirmed';
      case 'confirmed': return 'in_transit';
      case 'in_transit': return 'delivered';
      default: return null;
    }
  };

  const getStatusAction = (status: string) => {
    switch (status) {
      case 'pending': return 'Accept Order';
      case 'confirmed': return 'Start Delivery';
      case 'in_transit': return 'Mark Delivered';
      default: return null;
    }
  };

  if (!order) return null;

  const nextStatus = getNextStatus(order.status);
  const statusAction = getStatusAction(order.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order #{order.id.slice(-8)}
            <Badge className={getStatusColor(order.status)}>
              {order.status.replace('_', ' ')}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {order.profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{order.profiles?.full_name || 'Unknown Customer'}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {order.phone_number}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Delivery Address</p>
                    <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                  </div>
                </div>
                {order.notes && (
                  <div>
                    <p className="text-sm font-medium">Special Instructions</p>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items ({order.order_items?.length || 0} items)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.order_items?.map((item, index) => (
                    <div key={item.id} className="flex justify-between items-center p-3 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.crops?.name || 'Unknown Item'}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} {item.crops?.unit || 'units'} × {formatTZS(item.price_per_unit)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatTZS(item.total_price)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatTZS(order.total_amount - (order.delivery_fee || 0))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{formatTZS(order.delivery_fee || 0)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{formatTZS(order.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Status & Actions */}
          <div className="space-y-6">
            {/* Delivery Tracking */}
            {deliveryEstimate && (order.status === 'confirmed' || order.status === 'in_transit') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Delivery Countdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {countdown || 'Calculating...'}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Estimated arrival: {deliveryEstimate.estimatedArrival.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        Packaging
                      </span>
                      <span>{deliveryEstimate.packagingTime} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        Delivery
                      </span>
                      <span>{deliveryEstimate.deliveryTime} min</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total Time</span>
                      <span>{deliveryEstimate.totalTime} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                          ? new Date(order.updated_at).toLocaleString()
                          : 'Pending confirmation'}
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
                          ? 'In progress'
                          : 'Not started'}
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
                        {order.status === 'delivered' ? 'Completed' : 'Pending delivery'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {nextStatus && statusAction && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleStatusUpdate(nextStatus)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : statusAction}
                  </Button>
                )}
                
                {order.status === 'pending' && (
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={isUpdating}
                  >
                    Reject Order
                  </Button>
                )}

                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={isUpdating}
                  >
                    Cancel Order
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;