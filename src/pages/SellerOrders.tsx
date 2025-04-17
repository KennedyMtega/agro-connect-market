
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
import { useAuth } from "@/context/AuthContext";

// Mock data for seller orders
const mockOrdersData = [
  { 
    id: "ord-001", 
    buyer: "John Doe", 
    buyerId: "buyer-1",
    crop: "Organic Rice", 
    quantity: 25, 
    unit: "kg", 
    total: 899.75, 
    status: "pending", 
    time: "Today, 10:15 AM",
    address: "123 Main St, Seattle, WA",
    createdAt: new Date(2023, 3, 15)
  },
  { 
    id: "ord-002", 
    buyer: "Sarah Lee", 
    buyerId: "buyer-2",
    crop: "Fresh Tomatoes", 
    quantity: 15, 
    unit: "kg", 
    total: 44.85, 
    status: "confirmed", 
    time: "Today, 9:30 AM",
    address: "456 Oak Ave, Portland, OR",
    createdAt: new Date(2023, 3, 15)
  },
  { 
    id: "ord-003", 
    buyer: "Mike Wilson", 
    buyerId: "buyer-3",
    crop: "Sweet Corn", 
    quantity: 50, 
    unit: "ear", 
    total: 37.50, 
    status: "in_transit", 
    time: "Yesterday, 2:45 PM",
    address: "789 Pine St, San Francisco, CA",
    createdAt: new Date(2023, 3, 14)
  },
  { 
    id: "ord-004", 
    buyer: "Emily Chen", 
    buyerId: "buyer-4",
    crop: "Russet Potatoes", 
    quantity: 30, 
    unit: "kg", 
    total: 37.50, 
    status: "delivered", 
    time: "Yesterday, 11:20 AM",
    address: "101 Maple Dr, Eugene, OR",
    createdAt: new Date(2023, 3, 14)
  },
  { 
    id: "ord-005", 
    buyer: "James Brown", 
    buyerId: "buyer-5",
    crop: "Organic Carrots", 
    quantity: 20, 
    unit: "kg", 
    total: 59.80, 
    status: "delivered", 
    time: "Apr 13, 3:15 PM",
    address: "202 Cedar Ln, Boise, ID",
    createdAt: new Date(2023, 3, 13)
  },
  { 
    id: "ord-006", 
    buyer: "Lisa Garcia", 
    buyerId: "buyer-6",
    crop: "Red Onions", 
    quantity: 15, 
    unit: "kg", 
    total: 29.85, 
    status: "cancelled", 
    time: "Apr 12, 9:45 AM",
    address: "303 Birch Rd, Tacoma, WA",
    createdAt: new Date(2023, 3, 12)
  },
];

const SellerOrders = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortField, setSortField] = useState<"date" | "total">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const filterOrders = (orders: typeof mockOrdersData) => {
    let filtered = [...orders];
    
    // Filter by tab/status
    if (activeTab !== "all") {
      filtered = filtered.filter(order => order.status === activeTab);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        order => 
          order.id.toLowerCase().includes(query) ||
          order.buyer.toLowerCase().includes(query) ||
          order.crop.toLowerCase().includes(query)
      );
    }
    
    // Sort orders
    filtered.sort((a, b) => {
      if (sortField === "date") {
        return sortDirection === "asc" 
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        return sortDirection === "asc"
          ? a.total - b.total
          : b.total - a.total;
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

  const displayedOrders = filterOrders(mockOrdersData);

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
                  
                  {displayedOrders.length > 0 ? (
                    displayedOrders.map((order) => (
                      <div 
                        key={order.id}
                        className="grid grid-cols-7 items-center p-3 text-sm border-t hover:bg-muted/30"
                      >
                        <div className="font-medium">{order.id}</div>
                        <div>{order.buyer}</div>
                        <div>{order.crop} ({order.quantity} {order.unit})</div>
                        <div>${order.total.toFixed(2)}</div>
                        <div>{order.time}</div>
                        <div>
                          <span 
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium gap-1
                              ${order.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : order.status === 'confirmed' 
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'in_transit'
                                ? 'bg-purple-100 text-purple-800'
                                : order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            {order.status === 'pending' && (
                              <Button size="sm">
                                Accept
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
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
      </div>
    </Layout>
  );
};

export default SellerOrders;
