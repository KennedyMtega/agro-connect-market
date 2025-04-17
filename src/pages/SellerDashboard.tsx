
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Calendar,
  Clock,
  DollarSign,
  Package,
  PieChart,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import Layout from "@/components/layout/Layout";

// Mock data for recent orders
const recentOrders = [
  {
    id: "order-1",
    customerName: "James Wilson",
    items: ["Sweet Corn", "Tomatoes"],
    total: 45.75,
    status: "pending",
    date: "2023-04-16T09:12:00",
  },
  {
    id: "order-2",
    customerName: "Emily Johnson",
    items: ["Organic Rice", "Soybeans"],
    total: 124.50,
    status: "confirmed",
    date: "2023-04-15T14:32:00",
  },
  {
    id: "order-3",
    customerName: "Michael Brown",
    items: ["Russet Potatoes", "Honeycrisp Apples"],
    total: 37.25,
    status: "in_transit",
    date: "2023-04-15T11:05:00",
  },
  {
    id: "order-4",
    customerName: "Sophia Garcia",
    items: ["Organic Rice"],
    total: 71.98,
    status: "delivered",
    date: "2023-04-14T16:47:00",
  },
];

// Mock data for inventory status
const inventoryStatus = [
  { name: "Organic Rice", stock: 430, unit: "kg", status: "In Stock" },
  { name: "Sweet Corn", stock: 126, unit: "ears", status: "Low Stock" },
  { name: "Soybeans", stock: 750, unit: "kg", status: "In Stock" },
  { name: "Russet Potatoes", stock: 48, unit: "kg", status: "Critical" },
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "in_transit":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "in_transit":
      return "In Transit";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

const getStockStatusColor = (status: string): string => {
  switch (status) {
    case "In Stock":
      return "text-green-600";
    case "Low Stock":
      return "text-amber-600";
    case "Critical":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const StatsCard = ({
  title,
  value,
  description,
  icon,
  trend,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
}) => {
  const getTrendColor = (direction: string) => {
    switch (direction) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${getTrendColor(trend.direction)}`}>
            {trend.direction === "up" ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : trend.direction === "down" ? (
              <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
            ) : null}
            <span>{trend.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SellerDashboard = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");

  // If user is not authenticated or not a seller, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.userType !== "seller") {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Apr 10 - Apr 17
            </Button>
            <Button size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Revenue"
            value="$2,856.75"
            description="Total sales this week"
            icon={<DollarSign className="h-4 w-4" />}
            trend={{ value: "12% from last week", direction: "up" }}
          />
          <StatsCard
            title="Orders"
            value="28"
            description="Total orders this week"
            icon={<ShoppingBag className="h-4 w-4" />}
            trend={{ value: "5% from last week", direction: "up" }}
          />
          <StatsCard
            title="Customers"
            value="18"
            description="New customers this week"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: "Same as last week", direction: "neutral" }}
          />
          <StatsCard
            title="Inventory"
            value="12"
            description="Products with low stock"
            icon={<Package className="h-4 w-4" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Monitor and manage your recent customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg"
                  >
                    <div className="mb-2 sm:mb-0">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.join(", ")}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(order.date)}</span>
                        <Clock className="h-3 w-3 mx-1 ml-2" />
                        <span>{formatTime(order.date)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
                      <div className="text-sm font-medium mb-2 sm:mb-0">
                        ${order.total.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/seller-orders">
                  <Button variant="outline">View All Orders</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>
                Track your inventory levels and stock status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryStatus.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.stock} {item.unit}
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${getStockStatusColor(item.status)}`}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/inventory">
                  <Button variant="outline">Manage Inventory</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Your sales performance over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded-lg bg-muted/50">
                <div className="text-center p-6">
                  <BarChart className="h-10 w-10 mb-4 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Sales Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed sales analytics will be displayed here
                  </p>
                  <Link to="/analytics">
                    <Button variant="outline">View Detailed Analytics</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fulfillment Stats</CardTitle>
              <CardDescription>
                Track your order fulfillment performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">Pending</div>
                      <div className="text-sm text-muted-foreground">Orders to process</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">3</div>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">Confirmed</div>
                      <div className="text-sm text-muted-foreground">Ready to ship</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">7</div>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">In Transit</div>
                      <div className="text-sm text-muted-foreground">Currently shipping</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">5</div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link to="/seller-orders">
                  <Button>Process Orders</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SellerDashboard;
