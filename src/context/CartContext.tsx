
import { createContext, useContext, useState, ReactNode } from "react";
import { Crop } from "@/types";

interface CartItem {
  crop: Crop;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (crop: Crop, quantity: number) => void;
  removeFromCart: (cropId: string) => void;
  updateQuantity: (cropId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (crop: Crop, quantity: number) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.crop.id === crop.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new item if it doesn't exist
        return [...prevItems, { crop, quantity }];
      }
    });
  };

  const removeFromCart = (cropId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.crop.id !== cropId)
    );
  };

  const updateQuantity = (cropId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cropId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.crop.id === cropId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce(
    (total, item) => total + item.crop.pricePerUnit * item.quantity,
    0
  );

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
