
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/auth/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/context/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Auth from "./pages/Auth";
// Removed VerifyPhone - using Auth.tsx instead
import Search from "./pages/Search";
import SellerDashboard from "./pages/SellerDashboard";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";
import MyOrders from "./pages/MyOrders";
import OrderTracking from "./pages/OrderTracking";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import SellerOrders from "./pages/SellerOrders";
import SellerBusinessSetup from "./pages/SellerBusinessSetup";
import OnBoarding from "./pages/OnBoarding";
import RoleSelection from "./pages/RoleSelection";
import SellerOnboarding from "./pages/SellerOnboarding";

// Redirect component based on authentication status
const RedirectToAuth = () => {
  const { user, profile, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // If user is not logged in, redirect to role selection instead of onboarding
  if (!user) {
    return <Navigate to="/role-selection" />;
  }
  
  // If user is logged in, redirect based on type
  if (profile?.user_type === "buyer") {
    return <Navigate to="/search" />;
  } else if (profile?.user_type === "seller") {
    return <Navigate to="/dashboard" />;
  } else {
    // Fallback if user type is not set
    return <Navigate to="/auth" />;
  }
};

// Create a new instance of QueryClient
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
              {/* Root redirects based on auth status */}
              <Route path="/" element={<RedirectToAuth />} />
              
              {/* Role selection and onboarding */}
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/onboarding" element={<OnBoarding />} />
              <Route path="/seller-onboarding" element={<SellerOnboarding />} />
              
              {/* Auth routes */}
              <Route path="/auth" element={<Auth />} />
              {/* Removed /verify-phone route - using Auth.tsx instead */}
              
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
            <Route
              path="/seller-business-setup"
              element={
                <ProtectedRoute requiredUserType="seller">
                  <SellerBusinessSetup />
                </ProtectedRoute>
              }
            />
              
              {/* Shared routes */}
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
