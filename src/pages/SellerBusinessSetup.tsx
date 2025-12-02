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
import LocationPicker from "@/components/LocationPicker";

const SellerBusinessSetup = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [businessData, setBusinessData] = useState({
    businessName: "",
    businessDescription: "",
    deliveryRadius: 10,
    hasWhatsApp: false,
    whatsAppNumber: "",
    storeLocation: "",
    storeLocationLat: null as number | null,
    storeLocationLng: null as number | null,
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerIdNumber: "",
    brelaCertificate: "",
    businessCertificate: "",
    tinCertificate: "",
  });

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setBusinessData({
      ...businessData,
      storeLocation: location.address,
      storeLocationLat: location.lat,
      storeLocationLng: location.lng,
    });
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessData.businessName || !businessData.businessDescription || 
        !businessData.ownerName || !businessData.ownerIdNumber || !businessData.brelaCertificate || 
        !businessData.businessCertificate || !businessData.tinCertificate || !businessData.storeLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including business location and documents.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Use upsert to handle both insert and update in one operation
      const { data, error } = await supabase
        .from('seller_profiles')
        .upsert({
          user_id: user?.id,
          business_name: businessData.businessName,
          business_description: businessData.businessDescription,
          delivery_radius_km: businessData.deliveryRadius,
          has_whatsapp: businessData.hasWhatsApp,
          whatsapp_number: businessData.whatsAppNumber,
          store_location: businessData.storeLocation,
          store_location_lat: businessData.storeLocationLat,
          store_location_lng: businessData.storeLocationLng,
          phone_number: businessData.ownerPhone || profile?.phone_number || "",
          business_registration_number: businessData.ownerIdNumber,
          verification_documents: {
            brela_certificate: businessData.brelaCertificate,
            business_certificate: businessData.businessCertificate,
            tin_certificate: businessData.tinCertificate,
          },
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Business Setup Complete!",
        description: "Your business information has been saved successfully. You can now start selling!",
      });

      // Route to inventory page to add first crops
      navigate('/inventory');
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
    <Layout hideFooter>
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

              {/* Location Picker */}
              <LocationPicker 
                onLocationSelect={handleLocationSelect}
                currentLocation={
                  businessData.storeLocationLat && businessData.storeLocationLng 
                    ? {
                        lat: businessData.storeLocationLat,
                        lng: businessData.storeLocationLng,
                        address: businessData.storeLocation
                      }
                    : undefined
                }
              />

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
                  <Label htmlFor="ownerIdNumber">Owner ID Number *</Label>
                  <Input
                    id="ownerIdNumber"
                    value={businessData.ownerIdNumber}
                    onChange={(e) => setBusinessData({...businessData, ownerIdNumber: e.target.value})}
                    placeholder="Enter national ID number"
                    required
                  />
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

              {/* Business Documents Section */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Business Documents</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="brelaCertificate">BRELA Certificate Number *</Label>
                    <Input
                      id="brelaCertificate"
                      value={businessData.brelaCertificate}
                      onChange={(e) => setBusinessData({...businessData, brelaCertificate: e.target.value})}
                      placeholder="Enter BRELA certificate number"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessCertificate">Business Certificate Number *</Label>
                    <Input
                      id="businessCertificate"
                      value={businessData.businessCertificate}
                      onChange={(e) => setBusinessData({...businessData, businessCertificate: e.target.value})}
                      placeholder="Enter business certificate number"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tinCertificate">TIN Certificate Number *</Label>
                    <Input
                      id="tinCertificate"
                      value={businessData.tinCertificate}
                      onChange={(e) => setBusinessData({...businessData, tinCertificate: e.target.value})}
                      placeholder="Enter TIN certificate number"
                      required
                    />
                  </div>
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