import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Users,
  Building2,
  Brain,
  Settings,
  LogOut,
  Shield,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    id: "analytics",
    label: "Analytics Dashboard",
    icon: BarChart3,
    description: "System metrics & KPIs",
  },
  {
    id: "users",
    label: "User Management",
    icon: Users,
    description: "Buyers & sellers",
  },
  {
    id: "businesses",
    label: "Business Approval",
    icon: Building2,
    description: "Verify & approve",
  },
  {
    id: "ml-insights",
    label: "ML Insights",
    icon: Brain,
    description: "AI analytics",
  },
  {
    id: "settings",
    label: "Admin Settings",
    icon: Settings,
    description: "System configuration",
  },
];

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast({
      title: "Logged Out",
      description: "Admin session ended successfully",
    });
    navigate("/admin/login");
  };

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  return (
    <Sidebar className="border-r bg-card">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg">AgroConnect</h2>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
          </div>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => onTabChange(item.id)}
                className={`w-full justify-start p-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground shadow-primary"
                    : "hover:bg-muted"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="mb-3 p-3 bg-muted rounded-lg">
          <p className="font-medium text-sm">{adminUser.full_name}</p>
          <p className="text-xs text-muted-foreground">{adminUser.role}</p>
          <p className="text-xs text-muted-foreground">{adminUser.email}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};