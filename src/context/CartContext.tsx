
import { createContext, useContext, ReactNode } from "react";
import { Crop, Order } from "@/types";
import { useCartStore, CartItem } from "@/hooks/useCartStore";
import { useDeliveryLocation, Location } from "@/hooks/useDeliveryLocation";
import { useOrderManagement } from "@/hooks/useOrderManagement";

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
  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  } = useCartStore();

  const {
    deliveryLocation,
    setDeliveryLocation,
    isLoadingLocation,
    useCurrentLocation
  } = useDeliveryLocation();

  const {
    orders,
    getOrderById,
    isCheckingOut,
    proceedToCheckout
  } = useOrderManagement(items, subtotal, clearCart, deliveryLocation, setDeliveryLocation);
  
  const value: CartContextType = {
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
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

