
import { useState, useEffect, useCallback } from 'react';
import { Crop } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  crop: Crop;
  quantity: number;
  unit: string;
}

const CART_STORAGE_KEY = 'eko-cart-items';

export const useCartStore = () => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const storedItems = window.localStorage.getItem(CART_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return [];
    }
  });
  
  const { toast } = useToast();

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [items]);

  const addToCart = useCallback((crop: Crop, quantity: number) => {
    if (quantity > crop.quantityAvailable) {
      toast({
        title: "Quantity Limit Exceeded",
        description: `Only ${crop.quantityAvailable} ${crop.unit} available.`,
        variant: "destructive",
      });
      return;
    }

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.crop.id === crop.id);

      if (existingItemIndex >= 0) {
        const newQuantity = prevItems[existingItemIndex].quantity + quantity;
        if (newQuantity > crop.quantityAvailable) {
          toast({
            title: "Quantity Limit Exceeded",
            description: `You can't add more than ${crop.quantityAvailable} ${crop.unit} of this crop.`,
            variant: "destructive",
          });
          return prevItems;
        }

        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity = newQuantity;
        toast({
          title: "Cart Updated",
          description: `Quantity of ${crop.name} updated to ${newItems[existingItem-1] ? newItems[existingItemIndex].quantity : ''}.`,
        });
        return newItems;
      } else {
        toast({
          title: "Added to Cart",
          description: `${quantity} ${crop.unit} of ${crop.name} added.`,
        });
        return [...prevItems, { crop, quantity, unit: crop.unit }];
      }
    });
  }, [toast]);

  const removeFromCart = useCallback((cropId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.crop.id !== cropId));
    toast({
      title: "Removed from Cart",
      description: "Item removed from your cart.",
    });
  }, [toast]);

  const updateQuantity = useCallback((cropId:string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cropId);
      return;
    }

    setItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.crop.id === cropId);
      if (itemIndex === -1) return prevItems;
      
      const crop = prevItems[itemIndex].crop;
      
      if (quantity > crop.quantityAvailable) {
        toast({
          title: "Quantity Limit Exceeded",
          description: `Only ${crop.quantityAvailable} ${crop.unit} available.`,
          variant: "destructive",
        });
        return prevItems;
      }
      
      const newItems = [...prevItems];
      newItems[itemIndex].quantity = quantity;
      return newItems;
    });
  }, [removeFromCart, toast]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);
  
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.crop.pricePerUnit * item.quantity, 0);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  };
};

