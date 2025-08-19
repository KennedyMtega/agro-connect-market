import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { UserManagement } from "@/components/admin/UserManagement";
import { BusinessApproval } from "@/components/admin/BusinessApproval";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { MLInsights } from "@/components/admin/MLInsights";

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem("adminToken");
    setIsAuthenticated(!!adminToken);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsContent value="analytics" className="h-full">
                <AnalyticsDashboard />
              </TabsContent>
              
              <TabsContent value="users" className="h-full">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="businesses" className="h-full">
                <BusinessApproval />
              </TabsContent>
              
              <TabsContent value="ml-insights" className="h-full">
                <MLInsights />
              </TabsContent>
              
              <TabsContent value="settings" className="h-full">
                <AdminSettings />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;