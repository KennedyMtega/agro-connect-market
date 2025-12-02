
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredUserType?: "buyer" | "seller";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredUserType }) => {
  const { user, profile, isLoading } = useAuth();

  // Show loading or placeholder while checking authentication
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user is not logged in, redirect to landing page
  if (!user) {
    return <Navigate to="/" />;
  }

  // If profile hasn't loaded yet, show loading
  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If a specific user type is required, check that condition
  if (requiredUserType && profile.user_type !== requiredUserType) {
    // Redirect to appropriate page based on user type
    if (profile.user_type === "buyer") {
      return <Navigate to="/search" />;
    } else if (profile.user_type === "seller") {
      return <Navigate to="/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  // User is authenticated and meets type requirements, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
