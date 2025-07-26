import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useToast } from '@/hooks/use-toast';
import { validateTzPhone, formatTzPhone, getTzPhoneError } from '@/utils/phoneValidation';
import { UserType } from '@/types/database';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign In Form
  const [signInData, setSignInData] = useState({
    phone: '',
    password: '',
  });


  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();

  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const phoneError = getTzPhoneError(signInData.phone);
      if (phoneError) {
        toast({
          title: "Invalid Phone Number",
          description: phoneError,
          variant: "destructive",
        });
        return;
      }

      const formattedPhone = formatTzPhone(signInData.phone);
      
      // First, get the email associated with this phone number
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', formattedPhone)
        .single();

      if (profileError || !profiles) {
        toast({
          title: "Account Not Found",
          description: "No account found with this phone number. Please sign up first.",
          variant: "destructive",
        });
        return;
      }

      // Use email format: phone@temp.local for authentication
      const email = `${formattedPhone.replace('+', '')}@temp.local`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: signInData.password,
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      // Will be redirected by RedirectToAuth component
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-800">
              AgroConnect
            </CardTitle>
            <CardDescription>
              Tanzania's premier agricultural marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-phone">Phone Number</Label>
                <Input
                  id="signin-phone"
                  type="tel"
                  placeholder="+255712345678 or 0712345678"
                  value={signInData.phone}
                  onChange={(e) => setSignInData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              
              <div className="text-center text-sm text-gray-600 mt-4">
                Don't have an account? 
                <Link to="/" className="text-green-600 hover:text-green-700 font-medium ml-1">
                  Sign up here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
