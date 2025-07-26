
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EmailNotification = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Check if user has a real email (not the temp format)
    if (user?.email && !user.email.includes('@temp.local')) {
      setEmail(user.email);
      setShowNotification(false);
    } else {
      setShowNotification(true);
      // Set current email in input field for editing
      setEmail(user?.email || "");
    }
  }, [user?.email]);

  const handleEmailUpdate = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Update the user's email in auth
      const { error } = await supabase.auth.updateUser({
        email: email,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Update profile with email
      await updateProfile({
        email: email,
      });

      toast({
        title: "Email Updated",
        description: "Your email has been updated successfully. Please check your inbox for verification.",
      });

      setShowNotification(false);
    } catch (error) {
      console.error('Email update error:', error);
      toast({
        title: "Error",
        description: "Failed to update email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show if user already has a real email
  if (!showNotification) {
    return (
      <Card className="border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Email verified</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertCircle className="h-5 w-5" />
          Add Your Email Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-50">
          <Mail className="h-4 w-4" />
          <AlertDescription className="text-orange-800">
            Complete your profile by adding a valid email address. This will help you receive important notifications about your orders and account.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleEmailUpdate} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Updating..." : "Add Email"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmailNotification;
