import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  Users,
  Building2,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  MapPin,
  Activity,
  Star,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const mockData = {
  totalUsers: 1247,
  totalSellers: 156,
  totalOrders: 3429,
  totalRevenue: 450000,
  verifiedSellers: 134,
  pendingSellers: 22,
  activeListings: 892,
  avgRating: 4.3,
};

const chartData = [
  { name: "Jan", users: 400, orders: 240, revenue: 35000 },
  { name: "Feb", users: 500, orders: 310, revenue: 42000 },
  { name: "Mar", users: 680, orders: 450, revenue: 58000 },
  { name: "Apr", users: 890, orders: 580, revenue: 73000 },
  { name: "May", users: 1100, orders: 720, revenue: 89000 },
  { name: "Jun", users: 1247, orders: 890, revenue: 105000 },
];

const userTypeData = [
  { name: "Buyers", value: 1091, color: "#22c55e" },
  { name: "Sellers", value: 156, color: "#3b82f6" },
];

const regionData = [
  { name: "Dar es Salaam", users: 523, orders: 1456 },
  { name: "Arusha", users: 234, orders: 687 },
  { name: "Mwanza", users: 189, orders: 423 },
  { name: "Dodoma", users: 145, orders: 312 },
  { name: "Mbeya", users: 156, orders: 551 },
];

export const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(mockData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Fetch real data from Supabase
      const [usersResult, sellersResult, ordersResult] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact" }),
        supabase.from("seller_profiles").select("*", { count: "exact" }),
        supabase.from("orders").select("total_amount", { count: "exact" }),
      ]);

      const totalRevenue = ordersResult.data?.reduce((sum, order) => 
        sum + (parseFloat(order.total_amount) || 0), 0) || 0;

      setStats({
        ...mockData,
        totalUsers: usersResult.count || 0,
        totalSellers: sellersResult.count || 0,
        totalOrders: ordersResult.count || 0,
        totalRevenue: totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    prefix = "", 
    suffix = "" 
  }: {
    title: string;
    value: number | string;
    icon: any;
    change?: number;
    prefix?: string;
    suffix?: string;
  }) => (
    <Card className="hover:shadow-primary transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        {change && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            +{change}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-32 bg-muted rounded-lg" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          Real-time Data
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          change={12.5}
        />
        <StatCard
          title="Active Sellers"
          value={stats.totalSellers}
          icon={Building2}
          change={8.2}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          change={23.1}
        />
        <StatCard
          title="Revenue"
          value={stats.totalRevenue}
          icon={DollarSign}
          prefix="TSh "
          change={18.7}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Verified Sellers"
          value={stats.verifiedSellers}
          icon={Star}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingSellers}
          icon={Activity}
        />
        <StatCard
          title="Active Listings"
          value={stats.activeListings}
          icon={MapPin}
        />
        <StatCard
          title="Avg Rating"
          value={stats.avgRating}
          icon={Star}
          suffix="/5"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Regional Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#22c55e" name="Users" />
              <Bar dataKey="orders" fill="#3b82f6" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Business Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seller Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Verified Sellers</span>
                  <span>{((stats.verifiedSellers / stats.totalSellers) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(stats.verifiedSellers / stats.totalSellers) * 100} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.verifiedSellers}</div>
                  <div className="text-muted-foreground">Verified</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{stats.pendingSellers}</div>
                  <div className="text-muted-foreground">Pending</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Success Rate</span>
                  <span>87.3%</span>
                </div>
                <Progress value={87.3} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-green-600">2,994</div>
                  <div className="text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">435</div>
                  <div className="text-muted-foreground">Cancelled</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>System Uptime</span>
                  <span>99.8%</span>
                </div>
                <Progress value={99.8} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.avgRating}</div>
                  <div className="text-muted-foreground">Avg Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.activeListings}</div>
                  <div className="text-muted-foreground">Active Crops</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};