
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, MapPin, CreditCard, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart, proceedToCheckout, isCheckingOut } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  
  const deliveryFee = 5.99;
  const total = subtotal + deliveryFee;

  const handleQuantityChange = (cropId: string, newQuantity: number) => {
    updateQuantity(cropId, newQuantity);
  };

  const handleCheckout = () => {
    if (!deliveryAddress.trim()) {
      toast({
        title: "Missing Delivery Address",
        description: "Please enter a delivery address to continue.",
        variant: "destructive",
      });
      return;
    }
    
    proceedToCheckout();
  };

  if (isCheckingOut) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Processing Your Order</h2>
            <p className="text-muted-foreground mb-2">
              Please wait while we process your order...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="max-w-md mx-auto text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-muted-foreground mb-4">
              Looks like you haven't added any crops to your cart yet.
            </p>
            <Button onClick={() => navigate("/search")}>
              Browse Crops
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Shopping Cart</h1>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({items.length})</CardTitle>
                <CardDescription>
                  Review your selected items before checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.crop.id} className="flex items-center gap-4 py-4 border-b last:border-0">
                      <div className="h-20 w-20 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden">
                        {item.crop.images && item.crop.images.length > 0 ? (
                          <img 
                            src={item.crop.images[0]} 
                            alt={item.crop.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ShoppingCart className="h-8 w-8 text-slate-400" />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium">{item.crop.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${item.crop.pricePerUnit.toFixed(2)} per {item.crop.unit}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Seller: {item.crop.sellerName || "Unknown Seller"}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.crop.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.crop.id, item.quantity + 1)}
                          disabled={item.quantity >= item.crop.quantityAvailable}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.crop.pricePerUnit * item.quantity).toFixed(2)}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.crop.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span className="text-xs">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/search")}>
                  Continue Shopping
                </Button>
                <Button variant="ghost" onClick={clearCart}>
                  Clear Cart
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Delivery Address</span>
                  </div>
                  <Input 
                    placeholder="Enter your delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>
                
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Payment Method</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-primary/5">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm">Pay on Delivery</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleCheckout}>
                  <Truck className="h-4 w-4 mr-2" />
                  Place Order
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
