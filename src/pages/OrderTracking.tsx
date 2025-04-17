
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Truck,
  MapPin,
  Phone,
  Package,
  ShoppingBag,
  Store,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock order data with tracking details
const mockOrderWithTracking = {
  id: "ord-002",
  date: "2023-05-12",
  seller: {
    name: "Sunshine Produce",
    address: "123 Farm Road, Centerville, OH",
    phone: "+1 (555) 987-6543"
  },
  items: [
    { id: "item-2", name: "Sweet Corn", quantity: 50, unit: "ear", price: 0.75 },
    { id: "item-3", name: "Red Potatoes", quantity: 10, unit: "kg", price: 2.49 }
  ],
  total: 62.40,
  status: "in_transit",
  estimatedDelivery: "May 15, 2023 • 12:15 PM",
  deliveryAddress: "456 Main Street, Apt 3B, Springfield, IL",
  tracking: {
    currentStatus: "On The Way",
    lastUpdate: "May 15, 2023 • 10:30 AM",
    driver: {
      name: "Alex Johnson",
      phone: "+1 (555) 123-4567",
      avatar: null,
      vehicle: {
        make: "Toyota",
        model: "Hilux",
        color: "White",
        plate: "ABC-1234"
      }
    },
    currentLocation: "2.5 miles away",
    estimatedArrival: "15 minutes",
    progress: 65, // percentage of delivery progress
    timeline: [
      { status: "Order Placed", time: "May 12, 2023 • 2:45 PM", completed: true },
      { status: "Order Confirmed", time: "May 12, 2023 • 3:15 PM", completed: true },
      { status: "Preparing Your Order", time: "May 15, 2023 • 9:00 AM", completed: true },
      { status: "Driver Assigned", time: "May 15, 2023 • 9:30 AM", completed: true },
      { status: "On The Way", time: "May 15, 2023 • 10:30 AM", completed: true, current: true },
      { status: "Arrived at Location", time: null, completed: false },
      { status: "Order Delivered", time: null, completed: false }
    ]
  }
};

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch the order data with the tracking information
    // For this demo, we'll simulate a network request
    setTimeout(() => {
      setOrder(mockOrderWithTracking);
      setLoading(false);
    }, 1000);
  }, [id]);

  useEffect(() => {
    // In a real app, we would load a map here
    if (!loading && order) {
      const timer = setTimeout(() => {
        setMapLoaded(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [loading, order]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading order tracking information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find the order you're looking for.
              </p>
              <Link to="/my-orders">
                <Button>Back to My Orders</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/my-orders" className="text-primary hover:underline inline-flex items-center gap-1 mb-2">
              ← Back to My Orders
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Tracking Order #{order.id}</h1>
            <p className="text-muted-foreground">
              Placed on {order.date} • Estimated delivery by {order.estimatedDelivery}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-8 lg:grid-cols-12">
          {/* Tracking Map */}
          <div className="md:col-span-5 lg:col-span-8">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Live Tracking</CardTitle>
                <CardDescription>
                  Your driver is on the way with your items
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!mapLoaded ? (
                  <div className="h-[400px] bg-slate-100 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading map...</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-[400px] bg-slate-100 rounded-md overflow-hidden">
                    {/* This would be replaced with an actual map component */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl">🗺️</div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/90 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="bg-background rounded-lg p-3 shadow-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Truck className="h-4 w-4 text-primary" />
                            <span>{order.tracking.currentStatus}</span>
                          </div>
                          <div className="text-sm">{order.tracking.estimatedArrival} away</div>
                        </div>
                        <Progress value={order.tracking.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Tracking Info */}
          <div className="md:col-span-3 lg:col-span-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Driver information */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Driver Information</h4>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {order.tracking.driver.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{order.tracking.driver.name}</p>
                      <p className="text-sm text-muted-foreground">Bolt Driver</p>
                    </div>
                    <Button variant="outline" size="icon" className="rounded-full ml-auto">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vehicle</span>
                      <span className="font-medium">
                        {order.tracking.driver.vehicle.color} {order.tracking.driver.vehicle.make} {order.tracking.driver.vehicle.model}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">License Plate</span>
                      <span className="font-medium">{order.tracking.driver.vehicle.plate}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Delivery information */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Delivery Information</h4>
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <Store className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Pickup Location</p>
                        <p className="text-sm text-muted-foreground">{order.seller.name}</p>
                        <p className="text-sm text-muted-foreground">{order.seller.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Delivery Location</p>
                        <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Order summary */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Order Summary</h4>
                  <div className="text-sm space-y-2">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.quantity} × {item.name}
                        </span>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <Separator className="my-1" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Delivery Timeline */}
          <div className="md:col-span-8 lg:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* The vertical timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-muted"></div>
                  
                  <div className="space-y-8">
                    {order.tracking.timeline.map((event: any, index: number) => (
                      <div key={index} className="flex items-start">
                        <div className={`relative flex items-center justify-center w-12 h-12 rounded-full mr-4 flex-shrink-0
                          ${event.completed 
                            ? event.current 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-primary/10 text-primary' 
                            : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {event.status === "Order Placed" && <ShoppingBag className="h-5 w-5" />}
                          {event.status === "Order Confirmed" && <CheckCircle className="h-5 w-5" />}
                          {event.status === "Preparing Your Order" && <Package className="h-5 w-5" />}
                          {event.status === "Driver Assigned" && <Truck className="h-5 w-5" />}
                          {event.status === "On The Way" && <Truck className="h-5 w-5" />}
                          {event.status === "Arrived at Location" && <MapPin className="h-5 w-5" />}
                          {event.status === "Order Delivered" && <CheckCircle className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${event.current ? 'text-primary' : ''}`}>
                            {event.status}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {event.time || "Pending"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderTracking;
