import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedOnboardingProps {
  children: ReactNode;
  userType: "buyer" | "seller";
}

const ProtectedOnboarding: React.FC<ProtectedOnboardingProps> = ({ children, userType }) => {
  const { user, profile, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user is not logged in, allow onboarding (for signup)
  if (!user) {
    return <>{children}</>;
  }

  // If user is logged in and already onboarded, redirect to their dashboard
  if (profile?.is_onboarded) {
    if (profile.user_type === "buyer") {
      return <Navigate to="/search" replace />;
    } else if (profile.user_type === "seller") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If user is logged in but trying to access wrong onboarding type
  if (profile && profile.user_type !== userType) {
    if (profile.user_type === "buyer") {
      return <Navigate to="/search" replace />;
    } else if (profile.user_type === "seller") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Allow access to onboarding
  return <>{children}</>;
};

export default ProtectedOnboarding;