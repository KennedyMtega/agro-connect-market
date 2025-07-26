
import { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredUserType?: "buyer" | "seller";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredUserType }) => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use useEffect at top level to avoid conditional hooks
  useEffect(() => {
    if (requiredUserType && profile?.user_type !== requiredUserType && !isLoading && user) {
      toast({
        title: "Access Restricted",
        description: `This area is only accessible to ${requiredUserType}s.`,
        variant: "destructive",
      });
    }
  }, [requiredUserType, profile?.user_type, isLoading, user, toast]);

  // Show loading or placeholder while checking authentication
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user is not logged in, redirect to landing page
  if (!user) {
    return <Navigate to="/" />;
  }

  // If a specific user type is required, check that condition
  if (requiredUserType && profile?.user_type !== requiredUserType) {
    // Redirect to appropriate page based on user type
    if (profile?.user_type === "buyer") {
      return <Navigate to="/search" />;
    } else if (profile?.user_type === "seller") {
      return <Navigate to="/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  // User is authenticated and meets type requirements, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
