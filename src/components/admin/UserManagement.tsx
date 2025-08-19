import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Eye,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  user_type: "buyer" | "seller";
  city: string;
  region: string;
  is_phone_verified: boolean;
  is_onboarded: boolean;
  created_at: string;
  last_login?: string;
  total_orders?: number;
  total_spent?: number;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, activeTab]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Mock additional data for demo
      const enrichedUsers = data?.map(user => ({
        ...user,
        last_login: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        total_orders: Math.floor(Math.random() * 50),
        total_spent: Math.floor(Math.random() * 500000),
      })) || [];

      setUsers(enrichedUsers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by user type
    if (activeTab !== "all") {
      filtered = filtered.filter(user => user.user_type === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone_number.includes(searchTerm)
      );
    }

    setFilteredUsers(filtered);
  };

  const getUserStatusBadge = (user: User) => {
    if (!user.is_onboarded) {
      return <Badge variant="outline">Not Onboarded</Badge>;
    }
    if (!user.is_phone_verified) {
      return <Badge variant="secondary">Unverified Phone</Badge>;
    }
    return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
  };

  const UserDetailDialog = ({ user }: { user: User }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {user.full_name}
          {getUserStatusBadge(user)}
        </DialogTitle>
        <DialogDescription>
          {user.user_type === "buyer" ? "Buyer" : "Seller"} Account Details
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Contact Information</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{user.phone_number}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{user.city}, {user.region}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Account Statistics</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
            {user.user_type === "buyer" && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span>{user.total_orders} total orders</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span>TSh {user.total_spent?.toLocaleString()} spent</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button variant="outline" size="sm">
          <MessageCircle className="w-4 h-4 mr-2" />
          Send Message
        </Button>
        <Button variant="outline" size="sm">
          <Phone className="w-4 h-4 mr-2" />
          Call User
        </Button>
      </div>
    </DialogContent>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Card>
          <CardContent className="h-96 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading users...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="text-sm text-muted-foreground">
          {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {users.filter(u => u.user_type === "buyer").length}
            </div>
            <div className="text-sm text-muted-foreground">Buyers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {users.filter(u => u.user_type === "seller").length}
            </div>
            <div className="text-sm text-muted-foreground">Sellers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {users.filter(u => u.is_phone_verified).length}
            </div>
            <div className="text-sm text-muted-foreground">Verified</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Directory</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="buyer">Buyers</TabsTrigger>
              <TabsTrigger value="seller">Sellers</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.user_type === "buyer" ? "default" : "secondary"}>
                          {user.user_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.city}</TableCell>
                      <TableCell>{getUserStatusBadge(user)}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <UserDetailDialog user={user} />
                            </Dialog>
                            <DropdownMenuItem>
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Verify Account
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <UserX className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};