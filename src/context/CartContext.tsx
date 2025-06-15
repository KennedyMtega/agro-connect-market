import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Crop, Order, OrderItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  crop: Crop;
  quantity: number;
  unit: string;
}

interface Location {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isLiveLocation: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (crop: Crop, quantity: number) => void;
  removeFromCart: (cropId: string) => void;
  updateQuantity: (cropId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  proceedToCheckout: () => void;
  isCheckingOut: boolean;
  deliveryLocation: Location | null;
  setDeliveryLocation: (location: Location | null) => void;
  useCurrentLocation: () => void;
  isLoadingLocation: boolean;
  orders: Order[];
  getOrderById: (orderId: string) => Order | undefined;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
  proceedToCheckout: () => {},
  isCheckingOut: false,
  deliveryLocation: null,
  setDeliveryLocation: () => {},
  useCurrentLocation: () => {},
  isLoadingLocation: false,
  orders: [],
  getOrderById: () => undefined,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  const addToCart = (crop: Crop, quantity: number) => {
    // Check if the requested quantity is available
    if (quantity > crop.quantityAvailable) {
      toast({
        title: "Quantity Limit Exceeded",
        description: `Only ${crop.quantityAvailable} ${crop.unit} available for this crop.`,
        variant: "destructive",
      });
      return;
    }
    
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.crop.id === crop.id
      );

      if (existingItemIndex >= 0) {
        // Check if the updated quantity would exceed availability
        const newQuantity = prevItems[existingItemIndex].quantity + quantity;
        if (newQuantity > crop.quantityAvailable) {
          toast({
            title: "Quantity Limit Exceeded",
            description: `You can't add more than ${crop.quantityAvailable} ${crop.unit} of this crop.`,
            variant: "destructive",
          });
          return prevItems;
        }
        
        // Update quantity if item exists
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;

        toast({
          title: "Cart Updated",
          description: `Quantity of ${crop.name} updated to ${newItems[existingItemIndex].quantity}.`,
        });
        
        return newItems;
      } else {
        // Add new item if it doesn't exist
        toast({
          title: "Added to Cart",
          description: `${quantity} ${crop.unit} of ${crop.name} added to cart.`,
        });
        return [...prevItems, { crop, quantity, unit: crop.unit }];
      }
    });
  };

  const removeFromCart = (cropId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.crop.id !== cropId)
    );
    toast({
      title: "Removed from Cart",
      description: "Item removed from your cart.",
    });
  };

  const updateQuantity = (cropId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cropId);
      return;
    }

    setItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.crop.id === cropId);
      if (itemIndex === -1) return prevItems;
      
      const crop = prevItems[itemIndex].crop;
      
      // Check if the quantity exceeds availability
      if (quantity > crop.quantityAvailable) {
        toast({
          title: "Quantity Limit Exceeded",
          description: `Only ${crop.quantityAvailable} ${crop.unit} available for this crop.`,
          variant: "destructive",
        });
        return prevItems;
      }
      
      const newItems = [...prevItems];
      newItems[itemIndex].quantity = quantity;
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce(
    (total, item) => total + item.crop.pricePerUnit * item.quantity,
    0
  );

  const useCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setIsLoadingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // In a real app, we would use a reverse geocoding service
        // to get the address from coordinates
        setDeliveryLocation({
          address: "Current Location (Tap to enter details)",
          coordinates: { latitude, longitude },
          isLiveLocation: true
        });
        
        toast({
          title: "Location Updated",
          description: "Using your current location for delivery.",
        });
        
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Location Error",
          description: "Couldn't get your current location. Please enter manually.",
          variant: "destructive",
        });
        setIsLoadingLocation(false);
      }
    );
  };

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
    
    // Simulate order processing (in a real app, this would call an API)
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
      // In a real app, you would redirect to an order confirmation page
      window.location.href = "/my-orders";
    }, 2000);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        proceedToCheckout,
        isCheckingOut,
        deliveryLocation,
        setDeliveryLocation,
        useCurrentLocation,
        isLoadingLocation,
        orders,
        getOrderById,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
