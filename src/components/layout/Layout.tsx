
import { ReactNode, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  const { user, profile } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  // Show welcome toast and email notification when user first logs in
  useEffect(() => {
    if (user && profile && location.pathname === "/search" && sessionStorage.getItem('firstLogin') !== 'shown') {
      const welcomeMessage = `Welcome, ${profile?.full_name}! Start searching for fresh crops near you.`;
        
      toast({
        title: "Logged In Successfully",
        description: welcomeMessage,
      });

      // Show email notification for buyers if they don't have a real email
      if (profile.user_type === 'buyer' && user.email?.includes('@temp.local')) {
        setTimeout(() => {
          toast({
            title: "Complete Your Profile",
            description: "Add your email address in Profile Settings to receive important notifications.",
            variant: "default",
          });
        }, 2000);
      }
      
      sessionStorage.setItem('firstLogin', 'shown');
    }
  }, [user, location.pathname, profile?.full_name, profile?.user_type, user?.email, toast]);

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Header />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
