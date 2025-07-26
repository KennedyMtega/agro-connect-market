import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Search, 
  Calendar, 
  Filter, 
  CheckCircle, 
  Clock, 
  Truck, 
  X, 
  Eye, 
  ArrowUpDown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSellerOrders, Order } from "@/hooks/useSellerOrders";
import { formatTZS } from "@/utils/currency";
import { Badge } from "@/components/ui/badge";
import OrderDetailModal from "@/components/orders/OrderDetailModal";

const SellerOrders = () => {
  const { user } = useAuth();
  const { orders, loading, updateOrderStatus } = useSellerOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortField, setSortField] = useState<"date" | "total">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  const filterOrders = (orders: any[]) => {
    let filtered = [...orders];
    
    if (activeTab !== "all") {
      filtered = filtered.filter(order => order.status === activeTab);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        order => 
          order.id.toLowerCase().includes(query) ||
          order.profiles?.full_name?.toLowerCase().includes(query) ||
          order.order_items?.some((item: any) => item.crops?.name?.toLowerCase().includes(query))
      );
    }
    
    filtered.sort((a, b) => {
      if (sortField === "date") {
        return sortDirection === "asc" 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return sortDirection === "asc"
          ? a.total_amount - b.total_amount
          : b.total_amount - a.total_amount;
      }
    });
    
    return filtered;
  };

  const toggleSort = (field: "date" | "total") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "in_transit":
        return <Truck className="h-4 w-4 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  const handleCloseOrderDetail = () => {
    setIsOrderDetailOpen(false);
    setSelectedOrder(null);
  };

  const displayedOrders = filterOrders(orders);

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">
              Manage and track your orders from buyers
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="in_transit">In Transit</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Order List</CardTitle>
                <CardDescription>
                  {displayedOrders.length} {activeTab === "all" ? "total" : activeTab} orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 p-3 text-sm font-medium bg-muted/50">
                    <div>Order ID</div>
                    <div>Buyer</div>
                    <div>Items</div>
                    <div className="cursor-pointer flex items-center gap-1" onClick={() => toggleSort("total")}>
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                    <div className="cursor-pointer flex items-center gap-1" onClick={() => toggleSort("date")}>
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  
                  {loading ? (
                    <div className="p-8 text-center border-t">
                      <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p>Loading orders...</p>
                    </div>
                  ) : displayedOrders.length > 0 ? (
                    displayedOrders.map((order) => (
                      <div 
                        key={order.id}
                        className="grid grid-cols-7 items-center p-3 text-sm border-t hover:bg-muted/30"
                      >
                        <div className="font-medium">#{order.id.slice(-8)}</div>
                        <div>{order.profiles?.full_name || 'Unknown'}</div>
                        <div>{order.order_items?.length || 0} items</div>
                        <div>{formatTZS(order.total_amount)}</div>
                        <div>{new Date(order.created_at).toLocaleDateString()}</div>
                        <div>
                          <Badge 
                            variant={
                              order.status === 'delivered' ? 'default' :
                              order.status === 'pending' ? 'secondary' :
                              order.status === 'confirmed' ? 'outline' :
                              order.status === 'in_transit' ? 'outline' :
                              'destructive'
                            }
                          >
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            {order.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              >
                                Accept
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center border-t">
                      <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-1">No orders found</h3>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery 
                          ? "Try adjusting your search query" 
                          : `You don't have any ${activeTab === "all" ? "" : activeTab + " "}orders yet`}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Order Detail Modal */}
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isOrderDetailOpen}
          onClose={handleCloseOrderDetail}
          onUpdateStatus={updateOrderStatus}
        />
      </div>
    </Layout>
  );
};

export default SellerOrders;
