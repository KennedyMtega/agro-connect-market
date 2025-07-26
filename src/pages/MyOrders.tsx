import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Truck, 
  Package, 
  CheckCircle, 
  ShoppingBag, 
  XCircle,
  MapPin,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useBuyerOrders, BuyerOrder } from "@/hooks/useBuyerOrders";
import { formatTZS } from "@/utils/currency";

const OrderCard = ({ order }: { order: BuyerOrder }) => {

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
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
            <CardDescription>Placed on {new Date(order.created_at).toLocaleDateString()}</CardDescription>
          </div>
          <div className="text-right">
            <span className="font-bold">{formatTZS(order.total_amount)}</span>
            <div className="text-xs text-muted-foreground">From {order.seller_profiles?.business_name || 'Unknown Seller'}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Order Items</h4>
            <div className="space-y-2">
              {(order.order_items || []).map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity} × {item.crops?.name || 'Unknown Crop'}
                  </span>
                  <span className="font-medium">
                    {formatTZS(item.total_price)}
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
                <span className="text-sm">In Transit</span>
              </div>
            )}
            
            {order.status === "delivered" && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">Delivered on {new Date(order.updated_at).toLocaleDateString()}</span>
              </div>
            )}
            
            {order.status === "cancelled" && (
              <div className="flex items-center text-red-600">
                <XCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">Cancelled</span>
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
              
              <Link to={`/order/${order.id}/tracking`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
          
          {order.status === "in_transit" && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>On the way to {order.delivery_address}</span>
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
  const { orders, loading } = useBuyerOrders();
  
  const activeOrders = orders.filter(order => 
    order.status === "pending" || order.status === "in_transit"
  );
  
  const completedOrders = orders.filter(order => 
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
            {loading ? (
              <div className="text-center py-8">Loading orders...</div>
            ) : orders.length > 0 ? (
              orders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <EmptyState type="all" />
            )}
          </TabsContent>
          
          <TabsContent value="active">
            {loading ? (
              <div className="text-center py-8">Loading orders...</div>
            ) : activeOrders.length > 0 ? (
              activeOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <EmptyState type="active" />
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {loading ? (
              <div className="text-center py-8">Loading orders...</div>
            ) : completedOrders.length > 0 ? (
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
