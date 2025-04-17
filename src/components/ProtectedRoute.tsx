
import { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredUserType?: "buyer" | "seller";
}

const ProtectedRoute = ({ children, requiredUserType }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Show loading or placeholder while checking authentication
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If a specific user type is required, check that condition
  if (requiredUserType && user.userType !== requiredUserType) {
    // Show toast notification for better UX
    toast({
      title: "Access Restricted",
      description: `This area is only accessible to ${requiredUserType}s.`,
      variant: "destructive",
    });
    
    // Redirect to appropriate page based on user type
    if (user.userType === "buyer") {
      return <Navigate to="/search" />;
    } else if (user.userType === "seller") {
      return <Navigate to="/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  // User is authenticated and meets type requirements, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
