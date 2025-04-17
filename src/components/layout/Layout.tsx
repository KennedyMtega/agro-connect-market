
import { ReactNode, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Show welcome toast when user first logs in
  useEffect(() => {
    if (user && location.pathname === "/") {
      // Determine message based on user type
      const welcomeMessage = user.userType === "buyer" 
        ? `Welcome, ${user.fullName}! You're logged in as a buyer.`
        : `Welcome, ${user.fullName}! You're logged in as a seller.`;
        
      toast({
        title: "Logged In Successfully",
        description: welcomeMessage,
      });
    }
  }, [user, location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
