import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, User, Phone, Mail, ArrowRight, Leaf, Eye, EyeOff, ArrowLeft } from "lucide-react";
import EmailUpdate from "@/components/profile/EmailUpdate";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateTzPhone, formatTzPhone, getTzPhoneError } from "@/utils/phoneValidation";

const UserOnboarding = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState("signup");
  
  // Sign Up Form
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Sign In Form
  const [signInData, setSignInData] = useState({
    phone: "",
    password: "",
  });

  // Profile Form (for existing users) - simplified to only essential missing info
  const [formData, setFormData] = useState({
    deliveryAddress: "",
    city: "",
    region: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!signUpData.fullName.trim()) {
        toast.error("Please enter your full name.");
        return;
      }

      if (!signUpData.email.trim() || !signUpData.email.includes('@')) {
        toast.error("Please enter a valid email address.");
        return;
      }

      const phoneError = getTzPhoneError(signUpData.phone);
      if (phoneError) {
        toast.error(phoneError);
        return;
      }

      if (signUpData.password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }

      if (signUpData.password !== signUpData.confirmPassword) {
        toast.error("Passwords don't match.");
        return;
      }

      const formattedPhone = formatTzPhone(signUpData.phone);
      
      // Check if phone number already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', formattedPhone)
        .maybeSingle();

      if (existingProfile) {
        toast.error("An account with this phone number already exists. Please sign in instead.");
        return;
      }

      // Use phone number as the email for authentication (unique identifier)
      const authEmail = `${formattedPhone.replace('+', '')}@agroconnect.tz`;
      
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: signUpData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/search`,
          data: {
            phone_number: formattedPhone,
            full_name: signUpData.fullName.trim(),
            user_type: 'buyer',
            real_email: signUpData.email.trim(), // Store real email separately
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Mark buyer as onboarded immediately since they don't need additional setup
      if (data.user) {
        // Wait a bit for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            is_onboarded: true,
            email: signUpData.email.trim()
          })
          .eq('id', data.user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
        }
      }

      toast.success("Account created successfully! Welcome to AgroConnect!");
      // Navigate directly to search page for buyers
      navigate("/search", { replace: true });
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const phoneError = getTzPhoneError(signInData.phone);
      if (phoneError) {
        toast.error(phoneError);
        return;
      }

      const formattedPhone = formatTzPhone(signInData.phone);
      
      // Use phone number as email for authentication
      const authEmail = `${formattedPhone.replace('+', '')}@agroconnect.tz`;
      
      // Sign in directly with the constructed email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: signInData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error("Invalid phone number or password. Please check your credentials.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      // Ensure buyer is marked as onboarded
      if (data.user) {
        // Wait for profile to be available
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_onboarded')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (profileData && !profileData.is_onboarded) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ is_onboarded: true })
            .eq('id', data.user.id);
          
          if (updateError) {
            console.error('Error updating profile:', updateError);
          }
        }
      }

      toast.success("Welcome back!");
      navigate("/search", { replace: true });
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Since name and phone are already set during signup, just mark as onboarded
      const { error } = await supabase
        .from('profiles')
        .update({
          is_onboarded: true
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Welcome to AgroConnect! Let's find some fresh produce.");
      navigate("/search");
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error("Failed to complete setup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in and this is for profile completion
  if (user && profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        {/* Header */}
        <div className="p-4 flex justify-center">
          <div className="flex items-center text-blue-700 font-bold text-xl">
            <Leaf className="h-6 w-6 mr-2" />
            <span>AgroConnect</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex flex-col items-center justify-center px-6 py-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-blue-900">
              Welcome to Fresh Food Paradise! 🥬
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              Let's set up your profile to find the best local farmers near you.
            </p>
          </div>
          
          <Card className="w-full max-w-md shadow-lg border-2 border-blue-200">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-900">
                Complete Your Profile
              </CardTitle>
              <CardDescription>
                Help us personalize your fresh food experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg mb-6">
                <p className="text-blue-800 font-medium">Welcome {profile?.full_name}!</p>
                <p className="text-blue-600 text-sm">Your account is ready. You can start shopping immediately or add optional details below.</p>
              </div>

              {/* Email Update Section */}
              <EmailUpdate onComplete={handleComplete} />

              <div className="text-center text-sm text-gray-500 mt-4">
                Location permissions will be requested when you start shopping
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center text-blue-700 font-bold text-xl">
          <Leaf className="h-6 w-6 mr-2" />
          <span>AgroConnect</span>
        </div>
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      {/* Content */}
      <div className="flex flex-col items-center justify-center px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-blue-900">
            Join as a Buyer 🛒
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Discover fresh, local produce from farmers near you.
          </p>
        </div>
        
        <Card className="w-full max-w-md shadow-lg border-2 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-900">
              Buyer Account
            </CardTitle>
            <CardDescription>
              Create your account to start shopping for fresh produce
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="signin">Sign In</TabsTrigger>
              </TabsList>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+255712345678 or 0712345678"
                      value={signUpData.phone}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="signup-email">Email Address</Label>
                     <Input
                       id="signup-email"
                       type="email"
                       placeholder="your@email.com"
                       value={signUpData.email}
                       onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                       required
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="signup-password">Password</Label>
                     <div className="relative">
                       <Input
                         id="signup-password"
                         type={showPassword ? "text" : "password"}
                         placeholder="At least 6 characters"
                         value={signUpData.password}
                         onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
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
                   <div className="space-y-2">
                     <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                     <Input
                       id="signup-confirm-password"
                       type="password"
                       placeholder="Re-enter your password"
                       value={signUpData.confirmPassword}
                       onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                       required
                     />
                   </div>
                   <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                     {isLoading ? "Creating Account..." : "Create Buyer Account"}
                   </Button>
                </form>
              </TabsContent>

              <TabsContent value="signin">
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
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserOnboarding;