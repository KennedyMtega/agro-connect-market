
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Truck, 
  Package, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  ShoppingBag, 
  XCircle,
  MapPin
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock data for orders
const mockOrders = [
  {
    id: "ord-001",
    date: "2023-05-15",
    seller: "Green Valley Farms",
    items: [
      { id: "item-1", name: "Organic Rice", quantity: 25, unit: "kg", price: 35.99 }
    ],
    total: 899.75,
    status: "pending",
    estimatedDelivery: "May 16, 2023 • 2:30 PM",
    tracking: {
      currentStatus: "Order Received",
      lastUpdate: "May 15, 2023 • 3:45 PM",
      driverName: null,
      driverPhone: null,
      currentLocation: null
    }
  },
  {
    id: "ord-002",
    date: "2023-05-12",
    seller: "Sunshine Produce",
    items: [
      { id: "item-2", name: "Sweet Corn", quantity: 50, unit: "ear", price: 0.75 },
      { id: "item-3", name: "Red Potatoes", quantity: 10, unit: "kg", price: 2.49 }
    ],
    total: 62.40,
    status: "in_transit",
    estimatedDelivery: "May 15, 2023 • 12:15 PM",
    tracking: {
      currentStatus: "On The Way",
      lastUpdate: "May 15, 2023 • 10:30 AM",
      driverName: "Alex Johnson",
      driverPhone: "+1 (555) 123-4567",
      currentLocation: "2.5 miles away"
    }
  },
  {
    id: "ord-003",
    date: "2023-05-05",
    seller: "Harvest Moon Organics",
    items: [
      { id: "item-4", name: "Honey Crisp Apples", quantity: 5, unit: "kg", price: 3.99 },
      { id: "item-5", name: "Red Lentils", quantity: 2, unit: "kg", price: 4.50 }
    ],
    total: 28.95,
    status: "delivered",
    estimatedDelivery: "May 6, 2023 • 1:30 PM",
    delivery: {
      deliveredAt: "May 6, 2023 • 1:15 PM",
      driverName: "Sarah Williams"
    }
  },
  {
    id: "ord-004",
    date: "2023-05-01",
    seller: "Green Valley Farms",
    items: [
      { id: "item-6", name: "Fresh Tomatoes", quantity: 3, unit: "kg", price: 2.99 }
    ],
    total: 8.97,
    status: "cancelled",
    cancellation: {
      reason: "Requested by customer",
      cancelledAt: "May 1, 2023 • 5:20 PM"
    }
  }
];

const OrderCard = ({ order }: { order: any }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Order #{order.id}</CardTitle>
              <Badge
                variant={
                  order.status === "pending" 
                    ? "outline" 
                    : order.status === "in_transit" 
                    ? "secondary"
                    : order.status === "delivered" 
                    ? "default"
                    : "destructive"
                }
              >
                {order.status === "in_transit" ? "In Transit" : 
                  order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <CardDescription>Placed on {order.date}</CardDescription>
          </div>
          <div className="text-right">
            <span className="font-bold">${order.total.toFixed(2)}</span>
            <div className="text-xs text-muted-foreground">From {order.seller}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Order Items</h4>
            <div className="space-y-2">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity} × {item.name}
                  </span>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            {order.status === "pending" && (
              <div className="flex items-center text-amber-600">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">Processing order</span>
              </div>
            )}
            
            {order.status === "in_transit" && (
              <div className="flex items-center text-blue-600">
                <Truck className="h-4 w-4 mr-2" />
                <span className="text-sm">{order.tracking.currentStatus}</span>
              </div>
            )}
            
            {order.status === "delivered" && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">Delivered on {order.delivery.deliveredAt}</span>
              </div>
            )}
            
            {order.status === "cancelled" && (
              <div className="flex items-center text-red-600">
                <XCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">{order.cancellation.reason}</span>
              </div>
            )}
            
            <div className="flex gap-2">
              {order.status === "in_transit" && (
                <Link to={`/order/${order.id}/tracking`}>
                  <Button variant="outline" size="sm">
                    Track Order
                  </Button>
                </Link>
              )}
              
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
          
          {order.status === "in_transit" && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>Currently {order.tracking.currentLocation}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState = ({ type }: { type: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="bg-muted rounded-full p-3 mb-4">
      {type === "all" ? (
        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
      ) : type === "active" ? (
        <Truck className="h-6 w-6 text-muted-foreground" />
      ) : (
        <Package className="h-6 w-6 text-muted-foreground" />
      )}
    </div>
    <h3 className="text-lg font-medium mb-1">No orders found</h3>
    <p className="text-muted-foreground text-center max-w-md">
      {type === "all" 
        ? "You haven't placed any orders yet. Start by browsing crops in the marketplace."
        : type === "active" 
        ? "You don't have any active orders at the moment."
        : "You don't have any completed orders yet."
      }
    </p>
    <Link to="/search">
      <Button className="mt-4">Browse Crops</Button>
    </Link>
  </div>
);

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const activeOrders = mockOrders.filter(order => 
    order.status === "pending" || order.status === "in_transit"
  );
  
  const completedOrders = mockOrders.filter(order => 
    order.status === "delivered" || order.status === "cancelled"
  );

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your crop purchases
            </p>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger 
              value="all" 
              onClick={() => setActiveTab("all")}
            >
              All Orders
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              onClick={() => setActiveTab("active")}
            >
              Active Orders
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {mockOrders.length > 0 ? (
              mockOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <EmptyState type="all" />
            )}
          </TabsContent>
          
          <TabsContent value="active">
            {activeOrders.length > 0 ? (
              activeOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <EmptyState type="active" />
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedOrders.length > 0 ? (
              completedOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <EmptyState type="completed" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyOrders;
