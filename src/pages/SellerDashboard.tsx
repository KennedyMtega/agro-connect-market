import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  LineChart, 
  CreditCard, 
  DollarSign, 
  Users, 
  Package, 
  TrendingUp, 
  Truck,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";

// Mock data for seller dashboard
const mockOrdersData = [
  { id: "ord-001", buyer: "John Doe", crop: "Organic Rice", quantity: 25, unit: "kg", total: 899.75, status: "pending", time: "10:15 AM" },
  { id: "ord-002", buyer: "Sarah Lee", crop: "Fresh Tomatoes", quantity: 15, unit: "kg", total: 44.85, status: "confirmed", time: "9:30 AM" },
  { id: "ord-003", buyer: "Mike Wilson", crop: "Sweet Corn", quantity: 50, unit: "ear", total: 37.50, status: "in_transit", time: "Yesterday" },
  { id: "ord-004", buyer: "Emily Chen", crop: "Russet Potatoes", quantity: 30, unit: "kg", total: 37.50, status: "delivered", time: "Yesterday" },
];

const mockInventoryData = [
  { id: "crop-1", name: "Organic Rice", quantity: 500, unit: "kg", price: 35.99, status: "in_stock" },
  { id: "crop-2", name: "Fresh Tomatoes", quantity: 100, unit: "kg", price: 2.99, status: "low_stock" },
  { id: "crop-3", name: "Sweet Corn", quantity: 200, unit: "ear", price: 0.75, status: "in_stock" },
  { id: "crop-4", name: "Russet Potatoes", quantity: 30, unit: "kg", price: 1.25, status: "low_stock" },
];

const SellerDashboard = () => {
  const { user, profile, sellerProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.full_name || "Seller"}! Here's what's happening today.
            </p>
          </div>
          <Button>+ Add New Crop</Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>Overview</TabsTrigger>
            <TabsTrigger value="orders" onClick={() => setActiveTab("orders")}>Recent Orders</TabsTrigger>
            <TabsTrigger value="inventory" onClick={() => setActiveTab("inventory")}>Inventory</TabsTrigger>
            <TabsTrigger value="analytics" onClick={() => setActiveTab("analytics")}>Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$4,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Orders
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Buyers
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground">
                    +5 new this month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Seller Rating
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.9/5</div>
                  <p className="text-xs text-muted-foreground">
                    Based on 27 reviews
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Weekly Sales</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[200px] w-full bg-slate-100 rounded flex items-center justify-center">
                    <BarChart className="h-8 w-8 text-slate-400" />
                    <span className="ml-2 text-slate-500">Sales Chart Placeholder</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your most recent orders and activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOrdersData.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center gap-4">
                        <div className="rounded-full p-2 bg-primary/10">
                          <Truck className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {order.crop} - {order.quantity} {order.unit}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Ordered by {order.buyer}
                          </p>
                        </div>
                        <div className="text-xs text-right">
                          <p>${order.total.toFixed(2)}</p>
                          <p className="text-muted-foreground">{order.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                  <CardDescription>
                    Current stock levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockInventoryData.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className={`text-xs ${item.status === 'low_stock' ? 'text-amber-500' : 'text-green-500'}`}>
                            {item.status === 'low_stock' ? 'Low Stock' : 'In Stock'}
                          </p>
                        </div>
                        <Progress
                          value={item.status === 'low_stock' ? 20 : 70}
                          className={item.status === 'low_stock' ? 'bg-amber-100' : 'bg-green-100'}
                        />
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} {item.unit} available
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[250px] w-full bg-slate-100 rounded flex items-center justify-center">
                    <LineChart className="h-8 w-8 text-slate-400" />
                    <span className="ml-2 text-slate-500">Earnings Chart Placeholder</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Manage your recent crop orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-3 text-sm font-medium">
                    <div>Order ID</div>
                    <div>Buyer</div>
                    <div>Item</div>
                    <div>Total</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  
                  {mockOrdersData.map((order) => (
                    <div 
                      key={order.id}
                      className="grid grid-cols-6 items-center p-3 text-sm border-t"
                    >
                      <div className="font-medium">{order.id}</div>
                      <div>{order.buyer}</div>
                      <div>{order.crop} ({order.quantity} {order.unit})</div>
                      <div>${order.total.toFixed(2)}</div>
                      <div>
                        <span 
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${order.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : order.status === 'confirmed' 
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'in_transit'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                            }`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  Manage your crop inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-3 text-sm font-medium">
                    <div>Crop Name</div>
                    <div>Quantity</div>
                    <div>Price</div>
                    <div>Status</div>
                    <div>Last Updated</div>
                    <div>Actions</div>
                  </div>
                  
                  {mockInventoryData.map((item) => (
                    <div 
                      key={item.id}
                      className="grid grid-cols-6 items-center p-3 text-sm border-t"
                    >
                      <div className="font-medium">{item.name}</div>
                      <div>{item.quantity} {item.unit}</div>
                      <div>${item.price.toFixed(2)}/{item.unit}</div>
                      <div>
                        <span 
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${item.status === 'low_stock' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                            }`}
                        >
                          {item.status === 'low_stock' ? 'Low Stock' : 'In Stock'}
                        </span>
                      </div>
                      <div className="text-muted-foreground">2 days ago</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] w-full bg-slate-100 rounded flex items-center justify-center">
                    <BarChart className="h-8 w-8 text-slate-400" />
                    <span className="ml-2 text-slate-500">Sales Analytics Chart Placeholder</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Crops</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Organic Rice</p>
                        <p className="text-sm">350 kg sold</p>
                      </div>
                      <Progress value={80} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Fresh Tomatoes</p>
                        <p className="text-sm">120 kg sold</p>
                      </div>
                      <Progress value={65} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Sweet Corn</p>
                        <p className="text-sm">180 ears sold</p>
                      </div>
                      <Progress value={50} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Russet Potatoes</p>
                        <p className="text-sm">90 kg sold</p>
                      </div>
                      <Progress value={40} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Buyer Demographics</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[220px] w-full bg-slate-100 rounded flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-slate-400" />
                    <span className="ml-2 text-slate-500">Demographics Chart Placeholder</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SellerDashboard;
