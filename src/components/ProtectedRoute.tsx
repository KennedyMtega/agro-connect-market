
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredUserType?: "buyer" | "seller";
}

const ProtectedRoute = ({ children, requiredUserType }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

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
    return <Navigate to="/" />;
  }

  // User is authenticated and meets type requirements, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
