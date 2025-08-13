import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Leaf, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { validateTzPhone, formatTzPhone, getTzPhoneError } from "@/utils/phoneValidation";
import EmailUpdate from "@/components/profile/EmailUpdate";

const SellerOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState("signup");

  const [businessData, setBusinessData] = useState({
    businessName: "",
    businessDescription: "",
    businessLicense: "",
    deliveryRadius: 10,
  });

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

  // Step completion state
  const [emailUpdateComplete, setEmailUpdateComplete] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!signUpData.fullName.trim()) {
        toast({
          title: "Full Name Required",
          description: "Please enter your full name.",
          variant: "destructive",
        });
        return;
      }

      if (!signUpData.email.trim() || !signUpData.email.includes('@')) {
        toast({
          title: "Email Required",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }

      const phoneError = getTzPhoneError(signUpData.phone);
      if (phoneError) {
        toast({
          title: "Invalid Phone Number",
          description: phoneError,
          variant: "destructive",
        });
        return;
      }

      if (signUpData.password.length < 6) {
        toast({
          title: "Password Too Short",
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
        });
        return;
      }

      if (signUpData.password !== signUpData.confirmPassword) {
        toast({
          title: "Passwords Don't Match",
          description: "Please make sure both passwords are identical.",
          variant: "destructive",
        });
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
        toast({
          title: "Phone Number Already Registered",
          description: "An account with this phone number already exists. Please sign in instead.",
          variant: "destructive",
        });
        return;
      }

      // Use the real email provided by user
      const { error } = await supabase.auth.signUp({
        email: signUpData.email.trim(),
        password: signUpData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            phone_number: formattedPhone,
            full_name: signUpData.fullName,
            user_type: 'seller',
          },
        },
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account Created Successfully!",
        description: "Welcome to AgroConnect! Your seller account has been created.",
      });

      // User will be redirected by AuthenticatedRedirect component
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      
      // First, get the profile to verify it's a seller and get email info
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, user_type, email')
        .eq('phone_number', formattedPhone)
        .maybeSingle();

      if (!profileData) {
        toast({
          title: "Account Not Found",
          description: "No account found with this phone number. Please sign up first.",
          variant: "destructive",
        });
        return;
      }

      if (profileData.user_type !== 'seller') {
        toast({
          title: "Account Type Mismatch",
          description: "This phone number is registered for buyers. Please use the buyer login.",
          variant: "destructive",
        });
        return;
      }

      // Try signing in with the user's actual email first, then fallback to temp email
      let signInEmail = profileData.email;
      if (!signInEmail || signInEmail.includes('@temp.local')) {
        // Use temp email format for existing accounts
        signInEmail = `${formattedPhone.replace('+', '')}@temp.local`;
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
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

      // User will be redirected by AuthenticatedRedirect component
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdateComplete = () => {
    setEmailUpdateComplete(true);
    setCurrentStep(2);
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessData.businessName || !businessData.businessDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required business fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get user's email from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      // Update user profile to mark as onboarded
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_onboarded: true,
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Create seller profile
      const { error: sellerError } = await supabase
        .from('seller_profiles')
        .insert({
          user_id: user?.id,
          business_name: businessData.businessName,
          business_description: businessData.businessDescription,
          business_license: businessData.businessLicense,
          delivery_radius_km: businessData.deliveryRadius,
        });

      if (sellerError) throw sellerError;

      toast({
        title: "Welcome to AgroConnect!",
        description: "Your seller account has been set up successfully.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Seller onboarding error:', error);
      toast({
        title: "Setup Failed",
        description: "There was an error setting up your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in and this is for profile completion
  if (user && currentStep > 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-100">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center text-green-700 font-bold text-xl">
            <Leaf className="h-6 w-6 mr-2" />
            <span>AgroConnect</span>
          </div>
        </div>
      
      {/* Progress */}
      <div className="px-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${currentStep >= 1 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
              Email Setup
            </span>
            <span className={`text-sm ${currentStep >= 2 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
              Business Details
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <Card className="w-full max-w-md shadow-lg">
          {currentStep === 1 ? (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-green-900">
                    Email Setup
                  </CardTitle>
                  <CardDescription>
                    Complete your email setup to continue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4 bg-green-50 rounded-lg mb-6">
                    <p className="text-green-800 font-medium">Account created successfully!</p>
                    <p className="text-green-600 text-sm">Please complete your email setup to proceed with business registration.</p>
                  </div>
                  
                  <EmailUpdate onComplete={handleEmailUpdateComplete} />
                  
                  <div className="text-center text-sm text-gray-500 mt-4">
                    Business location will be set when you start selling
                  </div>
                </CardContent>
              </>
          ) : (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-green-900">
                  Business Information
                </CardTitle>
                <CardDescription>
                  Tell us about your agricultural business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBusinessSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={businessData.businessName}
                      onChange={(e) => setBusinessData({...businessData, businessName: e.target.value})}
                      placeholder="Your farm or business name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="businessDescription">Business Description *</Label>
                    <Textarea
                      id="businessDescription"
                      value={businessData.businessDescription}
                      onChange={(e) => setBusinessData({...businessData, businessDescription: e.target.value})}
                      placeholder="Describe what you grow and sell..."
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="businessLicense">Business License (Optional)</Label>
                    <Input
                      id="businessLicense"
                      value={businessData.businessLicense}
                      onChange={(e) => setBusinessData({...businessData, businessLicense: e.target.value})}
                      placeholder="License number if available"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                    <Select 
                      value={businessData.deliveryRadius.toString()} 
                      onValueChange={(value) => setBusinessData({...businessData, deliveryRadius: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 km</SelectItem>
                        <SelectItem value="10">10 km</SelectItem>
                        <SelectItem value="20">20 km</SelectItem>
                        <SelectItem value="50">50 km</SelectItem>
                        <SelectItem value="100">100 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setCurrentStep(1)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={loading}
                    >
                      {loading ? "Setting up..." : "Complete Setup"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center text-green-700 font-bold text-xl">
          <Leaf className="h-6 w-6 mr-2" />
          <span>AgroConnect</span>
        </div>
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-green-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      {/* Content */}
      <div className="flex flex-col items-center justify-center px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-green-900">
            Join as a Seller 🌾
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Start selling your fresh produce to customers in your area.
          </p>
        </div>
        
        <Card className="w-full max-w-md shadow-lg border-2 border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-900">
              Seller Account
            </CardTitle>
            <CardDescription>
              Create your account to start selling fresh produce
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
                   <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                     {loading ? "Creating Account..." : "Create Seller Account"}
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
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
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

export default SellerOnboarding;