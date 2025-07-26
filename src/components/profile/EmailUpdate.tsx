import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface EmailUpdateProps {
  onComplete?: () => void;
  standalone?: boolean;
}

const EmailUpdate: React.FC<EmailUpdateProps> = ({ onComplete, standalone = false }) => {
  const { user, profile } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const hasTempEmail = user?.email?.includes('@temp.local') || user?.email?.includes('@temp.com');

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // Update the user's email in Supabase auth
      const { error: updateError } = await supabase.auth.updateUser({
        email: email.trim()
      });

      if (updateError) throw updateError;

      // Update the email in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ email: email.trim() })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      setIsVerifying(true);
      toast.success("Verification email sent! Please check your inbox to confirm your new email address.");
      
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } catch (error: any) {
      console.error('Email update error:', error);
      toast.error(error.message || "Failed to update email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    }
  };

  if (isVerifying) {
    return (
      <Card className={standalone ? "w-full max-w-md mx-auto" : ""}>
        <CardHeader className="text-center">
          <Mail className="h-8 w-8 mx-auto text-green-600 mb-2" />
          <CardTitle>Email Verification Sent</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We've sent a verification email to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Please check your inbox and click the verification link to confirm your email address.
          </p>
          {onComplete && (
            <Button onClick={onComplete} className="w-full">
              Continue
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!hasTempEmail && !standalone) {
    return null; // Don't show if user already has a real email
  }

  return (
    <Card className={standalone ? "w-full max-w-md mx-auto" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          {hasTempEmail ? 'Update Your Email' : 'Add Email Address'}
        </CardTitle>
        {hasTempEmail && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <p className="text-sm text-amber-800">
              You're currently using a temporary email. Please add your real email address.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateEmail} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              You'll continue to login with your phone number
            </p>
          </div>
          
          <div className="flex gap-2">
            {onComplete && !standalone && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
              >
                Skip for now
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isLoading}
              className={`${onComplete && !standalone ? 'flex-1' : 'w-full'}`}
            >
              {isLoading ? "Updating..." : "Update Email"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailUpdate;