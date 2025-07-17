import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Leaf, MapPin, Phone, Building, CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";

const SellerBusinessSetup = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [businessData, setBusinessData] = useState({
    businessName: "",
    businessDescription: "",
    businessNumber: "",
    businessLicense: "",
    deliveryRadius: 10,
    hasWhatsApp: false,
    whatsAppNumber: "",
    storeLocation: "",
    storeLocationLat: null as number | null,
    storeLocationLng: null as number | null,
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
  });

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessData.businessName || !businessData.businessDescription || !businessData.businessNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required business fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Check if seller profile already exists
      const { data: existingSeller } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (existingSeller) {
        // Update existing seller profile
        const { error } = await supabase
          .from('seller_profiles')
          .update({
            business_name: businessData.businessName,
            business_description: businessData.businessDescription,
            business_license: businessData.businessLicense,
            delivery_radius_km: businessData.deliveryRadius,
          })
          .eq('user_id', user?.id);

        if (error) throw error;
      } else {
        // Create new seller profile
        const { error } = await supabase
          .from('seller_profiles')
          .insert({
            user_id: user?.id,
            business_name: businessData.businessName,
            business_description: businessData.businessDescription,
            business_license: businessData.businessLicense,
            delivery_radius_km: businessData.deliveryRadius,
          });

        if (error) throw error;
      }

      toast({
        title: "Business Setup Complete!",
        description: "Your business information has been saved successfully.",
      });

      navigate('/seller-dashboard');
    } catch (error) {
      console.error('Business setup error:', error);
      toast({
        title: "Setup Failed",
        description: "There was an error saving your business information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center text-green-700 font-bold text-2xl mb-4">
            <Leaf className="h-8 w-8 mr-2" />
            <span>Business Setup</span>
          </div>
          <p className="text-muted-foreground">
            Complete your business profile to start selling on AgroConnect
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-900">
              Business Information
            </CardTitle>
            <CardDescription>
              Tell us about your agricultural business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBusinessSubmit} className="space-y-6">
              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="businessName" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Business Name *
                </Label>
                <Input
                  id="businessName"
                  value={businessData.businessName}
                  onChange={(e) => setBusinessData({...businessData, businessName: e.target.value})}
                  placeholder="Your farm or business name"
                  required
                />
              </div>
              
              {/* Business Description */}
              <div className="space-y-2">
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

              {/* Business Number */}
              <div className="space-y-2">
                <Label htmlFor="businessNumber">Business Registration Number *</Label>
                <Input
                  id="businessNumber"
                  value={businessData.businessNumber}
                  onChange={(e) => setBusinessData({...businessData, businessNumber: e.target.value})}
                  placeholder="Your business registration number"
                  required
                />
              </div>
              
              {/* Business License */}
              <div className="space-y-2">
                <Label htmlFor="businessLicense">Business License (Optional)</Label>
                <Input
                  id="businessLicense"
                  value={businessData.businessLicense}
                  onChange={(e) => setBusinessData({...businessData, businessLicense: e.target.value})}
                  placeholder="License number if available"
                />
              </div>

              {/* WhatsApp Information */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasWhatsApp"
                    checked={businessData.hasWhatsApp}
                    onCheckedChange={(checked) => setBusinessData({...businessData, hasWhatsApp: checked as boolean})}
                  />
                  <Label htmlFor="hasWhatsApp" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    I have WhatsApp for business communication
                  </Label>
                </div>
                
                {businessData.hasWhatsApp && (
                  <div className="space-y-2">
                    <Label htmlFor="whatsAppNumber">WhatsApp Number</Label>
                    <Input
                      id="whatsAppNumber"
                      value={businessData.whatsAppNumber}
                      onChange={(e) => setBusinessData({...businessData, whatsAppNumber: e.target.value})}
                      placeholder="+255 XXX XXX XXX"
                    />
                  </div>
                )}
              </div>

              {/* Store Location */}
              <div className="space-y-2">
                <Label htmlFor="storeLocation" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Store/Farm Location
                </Label>
                <Input
                  id="storeLocation"
                  value={businessData.storeLocation}
                  onChange={(e) => setBusinessData({...businessData, storeLocation: e.target.value})}
                  placeholder="Street address of your store or farm"
                />
              </div>

              {/* Owner Information */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Store Owner Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input
                      id="ownerName"
                      value={businessData.ownerName}
                      onChange={(e) => setBusinessData({...businessData, ownerName: e.target.value})}
                      placeholder="Store owner's name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone">Owner Phone</Label>
                    <Input
                      id="ownerPhone"
                      value={businessData.ownerPhone}
                      onChange={(e) => setBusinessData({...businessData, ownerPhone: e.target.value})}
                      placeholder="+255 XXX XXX XXX"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">Owner Email</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    value={businessData.ownerEmail}
                    onChange={(e) => setBusinessData({...businessData, ownerEmail: e.target.value})}
                    placeholder="owner@example.com"
                  />
                </div>
              </div>
              
              {/* Delivery Radius */}
              <div className="space-y-2">
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
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Business Information"}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SellerBusinessSetup;