import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Leaf, ShoppingCart, Phone, Mail, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateTzPhone, formatTzPhone, getTzPhoneError } from "@/utils/phoneValidation";

const BuyerAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sign Up Form State
  const [signUpForm, setSignUpForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  // Sign In Form State
  const [signInForm, setSignInForm] = useState({
    phoneNumber: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!signUpForm.fullName.trim()) {
        toast({
          title: "Error",
          description: "Please enter your full name",
          variant: "destructive",
        });
        return;
      }

      if (!signUpForm.email.trim()) {
        toast({
          title: "Error",
          description: "Please enter your email address",
          variant: "destructive",
        });
        return;
      }

      // Validate phone number
      const phoneError = getTzPhoneError(signUpForm.phoneNumber);
      if (phoneError) {
        toast({
          title: "Error",
          description: phoneError,
          variant: "destructive",
        });
        return;
      }

      if (!signUpForm.password || signUpForm.password.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        return;
      }

      const formattedPhone = formatTzPhone(signUpForm.phoneNumber);

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: signUpForm.email,
        password: signUpForm.password,
        options: {
          emailRedirectTo: `${window.location.origin}/search`,
          data: {
            full_name: signUpForm.fullName,
            phone_number: formattedPhone,
            user_type: 'buyer',
            email: signUpForm.email,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account Already Exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        toast({
          title: "Welcome to AgroConnect!",
          description: "Your account has been created successfully. You can now start shopping for fresh produce.",
        });
        
        // Navigate to search page
        navigate("/search");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate phone number
      const phoneError = getTzPhoneError(signInForm.phoneNumber);
      if (phoneError) {
        toast({
          title: "Error",
          description: phoneError,
          variant: "destructive",
        });
        return;
      }

      if (!signInForm.password) {
        toast({
          title: "Error",
          description: "Please enter your password",
          variant: "destructive",
        });
        return;
      }

      const formattedPhone = formatTzPhone(signInForm.phoneNumber);

      // First, try to find the user by phone number
      const { data: profiles } = await supabase
        .from('profiles')
        .select('email')
        .eq('phone_number', formattedPhone)
        .eq('user_type', 'buyer')
        .single();

      if (!profiles?.email) {
        toast({
          title: "Account Not Found",
          description: "No buyer account found with this phone number. Please sign up first.",
          variant: "destructive",
        });
        return;
      }

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profiles.email,
        password: signInForm.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Sign In Failed",
            description: "Invalid phone number or password. Please check your credentials and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign In Failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        
        // Navigate to search page
        navigate("/search");
      }
    } catch (error) {
      console.error("Sign in error:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-white/95 backdrop-blur-sm border-b">
        <div className="flex items-center text-primary font-bold text-xl">
          <Leaf className="h-6 w-6 mr-2" />
          <span>AgroConnect</span>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-primary"
        >
          ← Back to Home
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join AgroConnect
          </h1>
          <p className="text-gray-600">
            Start shopping for fresh produce from local farmers
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-gray-900">Buyer Account</CardTitle>
            <CardDescription className="text-center">
              Access fresh produce from verified farmers across Tanzania
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="signin">Sign In</TabsTrigger>
              </TabsList>

              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpForm.fullName}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+255712345678 or 0712345678"
                      value={signUpForm.phoneNumber}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min. 6 characters)"
                        value={signUpForm.password}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign In Tab */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signinPhone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="signinPhone"
                      type="tel"
                      placeholder="+255712345678 or 0712345678"
                      value={signInForm.phoneNumber}
                      onChange={(e) => setSignInForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signinPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="signinPassword"
                        type={showSignInPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signInForm.password}
                        onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                      >
                        {showSignInPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyerAuth;