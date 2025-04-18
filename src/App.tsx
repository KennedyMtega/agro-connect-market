
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyPhone from "./pages/VerifyPhone";
import Search from "./pages/Search";
import SellerDashboard from "./pages/SellerDashboard";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";
import MyOrders from "./pages/MyOrders";
import OrderTracking from "./pages/OrderTracking";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import SellerOrders from "./pages/SellerOrders";

// Redirect component that checks user type and redirects accordingly
const RedirectBasedOnRole = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Index />;
  }
  
  return user.userType === "buyer" ? <Navigate to="/search" /> : <Navigate to="/dashboard" />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Landing page now redirects based on user role */}
              <Route path="/" element={<RedirectBasedOnRole />} />
              
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-phone" element={<VerifyPhone />} />
              
              {/* Buyer routes */}
              <Route 
                path="/search" 
                element={
                  <ProtectedRoute requiredUserType="buyer">
                    <Search />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-orders" 
                element={
                  <ProtectedRoute requiredUserType="buyer">
                    <MyOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/order/:id/tracking" 
                element={
                  <ProtectedRoute requiredUserType="buyer">
                    <OrderTracking />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute requiredUserType="buyer">
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              
              {/* Seller routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredUserType="seller">
                    <SellerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/inventory" 
                element={
                  <ProtectedRoute requiredUserType="seller">
                    <Inventory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seller-orders" 
                element={
                  <ProtectedRoute requiredUserType="seller">
                    <SellerOrders />
                  </ProtectedRoute>
                } 
              />
              
              {/* Shared routes (both user types) */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
