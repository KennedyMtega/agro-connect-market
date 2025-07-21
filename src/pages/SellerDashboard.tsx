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
import { formatTZS } from "@/utils/currency";
import { useNavigate } from "react-router-dom";

// All data will be loaded from database - no mock data

const SellerDashboard = () => {
  const { user, profile, sellerProfile } = useAuth();
  const navigate = useNavigate();
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
          <div className="flex gap-2">
            <Button onClick={() => navigate('/seller-business-setup')}>
              Edit Business Info
            </Button>
            <Button>+ Add New Crop</Button>
          </div>
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
                  <div className="text-2xl font-bold">{formatTZS(0)}</div>
                  <p className="text-xs text-muted-foreground">
                    No sales yet
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
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    No orders yet
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
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    No buyers yet
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
                  <div className="text-2xl font-bold">{sellerProfile?.average_rating || 0}/5</div>
                  <p className="text-xs text-muted-foreground">
                    Based on {sellerProfile?.total_ratings || 0} reviews
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
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent orders yet</p>
                      <p className="text-sm">Orders will appear here once customers start purchasing</p>
                    </div>
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
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No crops added yet</p>
                      <p className="text-sm">Add crops to your inventory to start selling</p>
                    </div>
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
                  
                  <div className="text-center py-8 text-muted-foreground border-t">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No orders yet</p>
                    <p className="text-sm">Orders from customers will appear here</p>
                  </div>
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
                  
                  <div className="text-center py-8 text-muted-foreground border-t">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No crops in inventory</p>
                    <p className="text-sm">Add crops to start managing your inventory</p>
                  </div>
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
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No sales data available</p>
                      <p className="text-sm">Sales analytics will appear once you start selling</p>
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
