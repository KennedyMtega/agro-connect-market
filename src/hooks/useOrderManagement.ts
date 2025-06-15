
import { useState, useEffect } from 'react';
import { Order, OrderItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from './useCartStore';
import { Location } from './useDeliveryLocation';

const ORDERS_STORAGE_KEY = 'eko-orders';

export const useOrderManagement = (
  items: CartItem[], 
  subtotal: number,
  clearCart: () => void,
  deliveryLocation: Location | null,
  setDeliveryLocation: (location: Location | null) => void,
) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const storedOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
          const parsedOrders = JSON.parse(storedOrders);
          // Make sure dates are parsed correctly
          return parsedOrders.map((o: Order) => ({
              ...o,
              createdAt: new Date(o.createdAt),
              estimatedDelivery: o.estimatedDelivery ? new Date(o.estimatedDelivery) : undefined,
              tracking: o.tracking ? {
                  ...o.tracking,
                  lastUpdate: new Date(o.tracking.lastUpdate),
                  timeline: o.tracking.timeline.map(t => ({...t, time: new Date(t.time)}))
              } : undefined
          }));
      }
      return [];
    } catch (error) {
      console.error("Error reading orders from localStorage", error);
      return [];
    }
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Error writing orders to localStorage", error);
    }
  }, [orders]);

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  // Order simulation logic
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(currentOrders =>
        currentOrders.map(order => {
          if (order.status === 'delivered' || order.status === 'cancelled') {
            return order;
          }

          const now = new Date();
          const lastUpdate = new Date(order.tracking?.lastUpdate || order.createdAt).getTime();
          const minutesSinceUpdate = (now.getTime() - lastUpdate) / (1000 * 60);

          let newStatus: Order['status'] = order.status;
          let newTracking = { ...(order.tracking!) };

          if (order.status === 'pending' && minutesSinceUpdate > 0.25) { // 15 seconds
            newStatus = 'in_transit';
            const timeline = order.tracking!.timeline.map(t => ({...t, current: false}));
            timeline.push({ status: 'On The Way', time: new Date(), completed: true, current: true });
            newTracking = {
              currentStatus: 'On The Way',
              lastUpdate: new Date(),
              driver: {
                id: 'driver-1',
                name: 'Juma Khamis',
                phone: '+255 784 123 456',
                avatar: undefined,
                vehicle: { make: 'Toyota', model: 'Hilux', color: 'White', plate: 'T123 ABC' }
              },
              currentLocation: { coordinates: { latitude: -6.7924, longitude: 39.2083 }, address: '2.5km away' },
              timeline,
            };
          } else if (order.status === 'in_transit' && minutesSinceUpdate > 0.5) { // 30 seconds after last update
            newStatus = 'delivered';
            const timeline = order.tracking!.timeline.map(t => ({...t, current: false}));
            timeline.push({ status: 'Delivered', time: new Date(), completed: true, current: true });
            newTracking = {
              ...newTracking,
              currentStatus: 'Delivered',
              lastUpdate: new Date(),
              timeline,
            };
          }

          if (newStatus !== order.status) {
            return { ...order, status: newStatus, tracking: newTracking };
          }

          return order;
        })
      );
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const proceedToCheckout = () => {
    if (!deliveryLocation) {
      toast({
        title: "Missing Delivery Location",
        description: "Please set a delivery location to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCheckingOut(true);
    
    setTimeout(() => {
      const sellerNames = [...new Set(items.map(item => item.crop.sellerName || 'Unknown Seller'))];

      const newOrderItems: OrderItem[] = items.map(item => ({
        id: item.crop.id,
        cropId: item.crop.id,
        cropName: item.crop.name,
        quantity: item.quantity,
        unit: item.unit,
        pricePerUnit: item.crop.pricePerUnit,
        totalPrice: item.crop.pricePerUnit * item.quantity,
      }));

      const newOrder: Order = {
        id: `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        buyerId: 'user-123', // Mock buyer ID
        sellerId: items[0]?.crop.sellerId || 'seller-unknown',
        sellerName: sellerNames.join(', '),
        items: newOrderItems,
        status: 'pending',
        totalAmount: subtotal + 4500, // include delivery fee
        deliveryFee: 4500,
        deliveryAddress: {
          address: deliveryLocation.address,
          coordinates: deliveryLocation.coordinates,
        },
        createdAt: new Date(),
        estimatedDelivery: new Date(new Date().getTime() + 30 * 60 * 1000), // 30 mins from now
        tracking: {
          currentStatus: 'Order Placed',
          lastUpdate: new Date(),
          timeline: [{ status: 'Order Placed', time: new Date(), completed: true, current: true }],
        },
      };

      setOrders(prevOrders => [newOrder, ...prevOrders]);
      
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been placed and is being processed.",
      });
      clearCart();
      setDeliveryLocation(null);
      setIsCheckingOut(false);
      
      window.location.href = "/my-orders";
    }, 2000);
  };
  
  return {
    orders,
    getOrderById,
    isCheckingOut,
    proceedToCheckout
  };
};

