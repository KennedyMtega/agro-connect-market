import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Leaf, ArrowLeft, ArrowRight } from "lucide-react";

const SellerOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [businessData, setBusinessData] = useState({
    businessName: "",
    businessDescription: "",
    businessLicense: "",
    deliveryRadius: 10,
  });

  const [personalData, setPersonalData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "Dar es Salaam",
    region: "",
  });

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalData.fullName || !personalData.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
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
      
      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: personalData.fullName,
          phone_number: personalData.phoneNumber,
          address: personalData.address,
          city: personalData.city,
          region: personalData.region,
          email: user?.email, // Ensure email is stored
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center text-green-700 font-bold text-xl">
          <Leaf className="h-6 w-6 mr-2" />
          <span>AgroConnect</span>
        </div>
        <Button 
          variant="ghost" 
          className="text-green-700" 
          onClick={() => navigate('/auth')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
      
      {/* Progress */}
      <div className="px-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${currentStep >= 1 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
              Personal Info
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
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Let's start with your basic information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePersonalSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={personalData.fullName}
                      onChange={(e) => setPersonalData({...personalData, fullName: e.target.value})}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      value={personalData.phoneNumber}
                      onChange={(e) => setPersonalData({...personalData, phoneNumber: e.target.value})}
                      placeholder="+255 XXX XXX XXX"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={personalData.address}
                      onChange={(e) => setPersonalData({...personalData, address: e.target.value})}
                      placeholder="Street address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Select value={personalData.city} onValueChange={(value) => setPersonalData({...personalData, city: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dar es Salaam">Dar es Salaam</SelectItem>
                          <SelectItem value="Dodoma">Dodoma</SelectItem>
                          <SelectItem value="Mwanza">Mwanza</SelectItem>
                          <SelectItem value="Arusha">Arusha</SelectItem>
                          <SelectItem value="Mbeya">Mbeya</SelectItem>
                          <SelectItem value="Morogoro">Morogoro</SelectItem>
                          <SelectItem value="Tanga">Tanga</SelectItem>
                          <SelectItem value="Iringa">Iringa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="region">Region</Label>
                      <Input
                        id="region"
                        value={personalData.region}
                        onChange={(e) => setPersonalData({...personalData, region: e.target.value})}
                        placeholder="Region"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
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
};

export default SellerOnboarding;