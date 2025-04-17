
import { createContext, useContext, useState, ReactNode } from "react";
import { Crop } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  crop: Crop;
  quantity: number;
  unit: string;
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
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
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

  const proceedToCheckout = () => {
    setIsCheckingOut(true);
    
    // Simulate order processing (in a real app, this would call an API)
    setTimeout(() => {
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been placed and is being processed.",
      });
      clearCart();
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
