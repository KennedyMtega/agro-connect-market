import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, Filter, RefreshCw, ShoppingBag } from "lucide-react";
import { useBuyerOrders } from "@/hooks/useBuyerOrders";
import OrderTrackingCard from "@/components/orders/OrderTrackingCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const MyOrders = () => {
  const { orders, loading, refetch } = useBuyerOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Set up real-time subscription for order updates
  useEffect(() => {
    const subscription = supabase
      .channel('buyer_orders')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders'
        }, 
        (payload) => {
          console.log('Order update received:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [refetch]);

  const filterOrders = (orders: any[]) => {
    let filtered = [...orders];
    
    if (activeTab !== "all") {
      if (activeTab === "active") {
        filtered = filtered.filter(order => 
          ['pending', 'confirmed', 'in_transit'].includes(order.status)
        );
      } else if (activeTab === "completed") {
        filtered = filtered.filter(order => 
          ['delivered', 'cancelled'].includes(order.status)
        );
      }
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        order => 
          order.id.toLowerCase().includes(query) ||
          order.seller_profiles?.business_name?.toLowerCase().includes(query)
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  };

  const handleCallSeller = (order: any) => {
    const sellerPhone = "+255000000000"; // Placeholder
    window.open(`tel:${sellerPhone}`);
  };

  const displayedOrders = filterOrders(orders);

  return (
    <Layout hideFooter>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your crop purchases
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => refetch()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            <div className="space-y-6">
              {loading ? (
                // Skeleton loading cards
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-40" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-9 w-24" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : displayedOrders.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                  {displayedOrders.map((order) => (
                    <OrderTrackingCard
                      key={order.id}
                      order={order}
                      onCallSeller={() => handleCallSeller(order)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium mb-2">No orders found</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                      {searchQuery 
                        ? "Try adjusting your search query" 
                        : activeTab === "active" 
                          ? "You don't have any active orders. Your in-progress orders will appear here."
                          : activeTab === "completed"
                            ? "You don't have any completed orders yet."
                            : "You haven't placed any orders yet. Start exploring fresh produce from local farmers!"}
                    </p>
                    {searchQuery ? (
                      <Button variant="outline" onClick={() => setSearchQuery("")}>
                        Clear Search
                      </Button>
                    ) : (
                      <Button onClick={() => window.location.href = "/search"}>
                        Browse Fresh Produce
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyOrders;