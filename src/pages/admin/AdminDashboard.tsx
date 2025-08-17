import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context/admin/AdminContext';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Building2, 
  ShoppingCart, 
  Sprout, 
  TrendingUp, 
  Calendar,
  Settings,
  LogOut
} from 'lucide-react';
import { formatTZS } from '@/utils/currency';

interface DashboardStats {
  total_sellers: number;
  verified_sellers: number;
  pending_sellers: number;
  total_buyers: number;
  total_orders: number;
  total_crops: number;
  revenue_today: number;
  orders_today: number;
}

export default function AdminDashboard() {
  const { adminUser, logout } = useAdmin();
  const { getDashboardStats, loading } = useAdminDashboard();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">AgroConnect Admin</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {adminUser?.full_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                {adminUser?.role}
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats ? (stats.total_sellers + stats.total_buyers).toLocaleString() : '---'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.total_buyers} buyers, {stats?.total_sellers} sellers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Sellers</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.verified_sellers?.toLocaleString() || '---'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.pending_sellers} pending approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.total_orders?.toLocaleString() || '---'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.orders_today} orders today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
              <Sprout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.total_crops?.toLocaleString() || '---'}
              </div>
              <p className="text-xs text-muted-foreground">
                Available for purchase
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats ? formatTZS(stats.revenue_today) : '---'}
              </div>
              <p className="text-xs text-muted-foreground">
                From {stats?.orders_today} completed orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">All Systems Operational</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="businesses" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="businesses">Businesses</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="businesses" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Business Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      {stats?.pending_sellers} businesses waiting for approval
                    </p>
                  </div>
                  <Button onClick={() => window.location.href = '/admin/businesses'}>
                    Review Businesses
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">User Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage user accounts and permissions
                    </p>
                  </div>
                  <Button onClick={() => window.location.href = '/admin/users'}>
                    Manage Users
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Order Monitoring</h3>
                    <p className="text-sm text-muted-foreground">
                      Track and manage all platform orders
                    </p>
                  </div>
                  <Button onClick={() => window.location.href = '/admin/orders'}>
                    View Orders
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">System Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure platform settings and preferences
                    </p>
                  </div>
                  <Button onClick={() => window.location.href = '/admin/settings'}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}