import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, User, Phone, Mail, ArrowRight, Leaf } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateTzPhone, formatTzPhone, getTzPhoneError } from "@/utils/phoneValidation";

const UserOnboarding = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    phoneNumber: profile?.phone_number || "",
    deliveryAddress: "",
    city: "",
    region: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = async () => {
    if (!user) return;
    
    // Validate required fields
    if (!formData.fullName || !formData.phoneNumber) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validate phone number
    const phoneError = getTzPhoneError(formData.phoneNumber);
    if (phoneError) {
      toast.error(phoneError);
      return;
    }
    
    setIsLoading(true);
    try {
      // Format phone number properly
      const formattedPhone = formatTzPhone(formData.phoneNumber);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone_number: formattedPhone,
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
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center text-sm font-medium">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="border-blue-200 focus:border-blue-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center text-sm font-medium">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                placeholder="+255 XXX XXX XXX or 0XXX XXX XXX"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="border-blue-200 focus:border-blue-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryAddress" className="flex items-center text-sm font-medium">
                <MapPin className="w-4 h-4 mr-2" />
                Delivery Address
              </Label>
              <Input
                id="deliveryAddress"
                placeholder="Street address for deliveries"
                value={formData.deliveryAddress}
                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                className="border-blue-200 focus:border-blue-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="Your city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region" className="text-sm font-medium">
                  Region
                </Label>
                <Input
                  id="region"
                  placeholder="Your region"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
              onClick={handleComplete}
              disabled={isLoading || !formData.fullName || !formData.phoneNumber}
            >
              {isLoading ? "Setting up..." : "Start Shopping"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <div className="text-center text-sm text-gray-500">
              You can update these details anytime in your profile
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserOnboarding;