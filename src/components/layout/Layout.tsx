
import { ReactNode, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  const { user, profile } = useAuth();
  const location = useLocation();
  
  // Show welcome toast when user first logs in
  useEffect(() => {
    if (user && location.pathname === "/search" && sessionStorage.getItem('firstLogin') !== 'shown') {
      const welcomeMessage = `Welcome, ${profile?.full_name}! Start searching for fresh crops near you.`;
        
      toast({
        title: "Logged In Successfully",
        description: welcomeMessage,
      });
      
      sessionStorage.setItem('firstLogin', 'shown');
    }
  }, [user, location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Header />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
