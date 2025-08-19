import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  Users,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Mail,
  Bell,
  Database,
  Server,
  Key,
  Globe,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login: string;
  created_at: string;
}

const mockAdmins: AdminUser[] = [
  {
    id: "1",
    full_name: "System Administrator",
    email: "admin@agroconnect.tz",
    role: "super_admin",
    is_active: true,
    last_login: new Date().toISOString(),
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    full_name: "Business Manager",
    email: "business@agroconnect.tz",
    role: "admin",
    is_active: true,
    last_login: new Date(Date.now() - 86400000).toISOString(),
    created_at: "2024-02-15T00:00:00Z",
  },
];

export const AdminSettings = () => {
  const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins);
  const [newAdmin, setNewAdmin] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [systemSettings, setSystemSettings] = useState({
    platform_name: "AgroConnect",
    support_email: "support@agroconnect.tz",
    maintenance_mode: false,
    email_notifications: true,
    sms_notifications: true,
    auto_approve_sellers: false,
    max_order_amount: 1000000,
    platform_commission: 5,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateAdmin = () => {
    if (!newAdmin.full_name || !newAdmin.email || !newAdmin.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const admin: AdminUser = {
      id: Date.now().toString(),
      ...newAdmin,
      is_active: true,
      last_login: "",
      created_at: new Date().toISOString(),
    };

    setAdmins([...admins, admin]);
    setNewAdmin({ full_name: "", email: "", password: "", role: "admin" });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Admin user created successfully",
    });
  };

  const handleDeleteAdmin = (id: string) => {
    setAdmins(admins.filter(admin => admin.id !== id));
    toast({
      title: "Success",
      description: "Admin user deleted successfully",
    });
  };

  const handleToggleAdmin = (id: string) => {
    setAdmins(admins.map(admin => 
      admin.id === id ? { ...admin, is_active: !admin.is_active } : admin
    ));
  };

  const handleSaveSettings = () => {
    toast({
      title: "Success",
      description: "System settings saved successfully",
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Badge className="bg-red-100 text-red-800">Super Admin</Badge>;
      case "admin":
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
      case "moderator":
        return <Badge variant="secondary">Moderator</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="w-8 h-8" />
          Admin Settings
        </h1>
      </div>

      <Tabs defaultValue="admins" className="space-y-4">
        <TabsList>
          <TabsTrigger value="admins">Admin Users</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Admin User Management
                </CardTitle>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Admin User</DialogTitle>
                      <DialogDescription>
                        Add a new administrator to the system
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newAdmin.full_name}
                          onChange={(e) => setNewAdmin({...newAdmin, full_name: e.target.value})}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                          placeholder="admin@agroconnect.tz"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newAdmin.password}
                          onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                          placeholder="Enter password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <select
                          id="role"
                          value={newAdmin.role}
                          onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                          className="w-full px-3 py-2 border border-input rounded-md"
                        >
                          <option value="admin">Admin</option>
                          <option value="moderator">Moderator</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleCreateAdmin}>Create Admin</Button>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.full_name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{getRoleBadge(admin.role)}</TableCell>
                      <TableCell>
                        <Badge variant={admin.is_active ? "default" : "secondary"}>
                          {admin.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {admin.last_login 
                          ? new Date(admin.last_login).toLocaleDateString()
                          : "Never"
                        }
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleAdmin(admin.id)}>
                              <Shield className="mr-2 h-4 w-4" />
                              {admin.is_active ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteAdmin(admin.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Platform Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="platform_name">Platform Name</Label>
                  <Input
                    id="platform_name"
                    value={systemSettings.platform_name}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      platform_name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="support_email">Support Email</Label>
                  <Input
                    id="support_email"
                    type="email"
                    value={systemSettings.support_email}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      support_email: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="commission">Platform Commission (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    value={systemSettings.platform_commission}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      platform_commission: parseFloat(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="max_order">Max Order Amount (TSh)</Label>
                  <Input
                    id="max_order"
                    type="number"
                    value={systemSettings.max_order_amount}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      max_order_amount: parseFloat(e.target.value)
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  System Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable the platform for maintenance
                    </p>
                  </div>
                  <Switch
                    id="maintenance"
                    checked={systemSettings.maintenance_mode}
                    onCheckedChange={(checked) => setSystemSettings({
                      ...systemSettings,
                      maintenance_mode: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto_approve">Auto-approve Sellers</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve seller applications
                    </p>
                  </div>
                  <Switch
                    id="auto_approve"
                    checked={systemSettings.auto_approve_sellers}
                    onCheckedChange={(checked) => setSystemSettings({
                      ...systemSettings,
                      auto_approve_sellers: checked
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email_notif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications to users
                  </p>
                </div>
                <Switch
                  id="email_notif"
                  checked={systemSettings.email_notifications}
                  onCheckedChange={(checked) => setSystemSettings({
                    ...systemSettings,
                    email_notifications: checked
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms_notif">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send SMS notifications to users
                  </p>
                </div>
                <Switch
                  id="sms_notif"
                  checked={systemSettings.sms_notifications}
                  onCheckedChange={(checked) => setSystemSettings({
                    ...systemSettings,
                    sms_notifications: checked
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  API Keys & Secrets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Google Maps API</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Used for location services and mapping
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">SMS Gateway</span>
                    <Badge variant="secondary">Inactive</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    SMS notifications and verification
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  Manage API Keys
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database & Backup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database Size</span>
                    <span>2.3 GB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Backup</span>
                    <span>2 hours ago</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Backup Status</span>
                    <Badge variant="default">Healthy</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Manual Backup
                </Button>
                <Button variant="outline" className="w-full">
                  Backup Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};