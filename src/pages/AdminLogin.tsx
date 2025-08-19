import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, use hardcoded credentials
      // In production, this would authenticate against admin_users table
      if (email === "admin@agroconnect.tz" && password === "admin123") {
        // Store admin session in localStorage for demo
        localStorage.setItem("adminToken", "demo-admin-token");
        localStorage.setItem("adminUser", JSON.stringify({
          id: "admin-1",
          email: "admin@agroconnect.tz",
          full_name: "System Administrator",
          role: "super_admin"
        }));
        
        toast({
          title: "Login Successful",
          description: "Welcome to AgroConnect Admin Panel",
        });
        
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "Invalid Credentials",
          description: "Please check your email and password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">AgroConnect Admin</CardTitle>
          <CardDescription>
            Secure access to system administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@agroconnect.tz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Lock className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Access Admin Panel
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-muted-foreground">Email: admin@agroconnect.tz</p>
            <p className="text-xs text-muted-foreground">Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;