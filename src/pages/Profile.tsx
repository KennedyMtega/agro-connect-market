
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Mail, Calendar, Check, User, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { user, buyerProfile, sellerProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.userType === "buyer" ? buyerProfile?.deliveryPreferences?.defaultAddress || "" : "",
  });

  const isBuyer = user?.userType === "buyer";
  const isSeller = user?.userType === "seller";

  const handleSaveProfile = () => {
    // In a real app, this would send data to an API
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const useCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setIsLoadingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, we would use reverse geocoding to get the address
        setProfileForm({
          ...profileForm,
          address: "Current Location (Automatic Detection)",
        });
        
        toast({
          title: "Location Updated",
          description: "Your current location has been set as your default address.",
        });
        
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Location Error",
          description: "Couldn't get your current location. Please enter manually.",
          variant: "destructive",
        });
        setIsLoadingLocation(false);
      }
    );
  };

  // Helper function to safely format dates
  const formatDate = (dateValue: any) => {
    if (!dateValue) return "Unknown";
    
    try {
      // If it's already a Date object
      if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        return dateValue.toLocaleDateString();
      }
      
      // If it's a string or number, try to convert to Date
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
      
      return "Unknown date format";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown";
    }
  };

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">My Profile</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                  <AvatarFallback>{user?.fullName ? getInitials(user.fullName) : 'U'}</AvatarFallback>
                </Avatar>
                <CardTitle>{user?.fullName}</CardTitle>
                <CardDescription>{user?.userType === "buyer" ? "Buyer" : "Seller"}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-y-1">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user?.email || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center space-y-1">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{user?.phoneNumber || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center space-y-1">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Account Created</p>
                    <p className="text-sm text-muted-foreground">{formatDate(user?.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center space-y-1">
                  <Check className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone Verification</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.isPhoneVerified ? "Verified ✓" : "Not Verified"}
                    </p>
                  </div>
                </div>
                {isBuyer && (
                  <div className="flex items-center space-y-1">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Default Location</p>
                      <p className="text-sm text-muted-foreground">
                        {buyerProfile?.deliveryPreferences?.defaultAddress || "Not set"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      value={profileForm.fullName} 
                      onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileForm.email} 
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={profileForm.phoneNumber} 
                      onChange={(e) => setProfileForm({...profileForm, phoneNumber: e.target.value})}
                    />
                  </div>
                  
                  {isBuyer && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="address">Default Delivery Location</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={useCurrentLocation}
                          disabled={isLoadingLocation}
                        >
                          {isLoadingLocation ? (
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-1"></div>
                          ) : (
                            <Navigation className="h-3 w-3 mr-1" />
                          )}
                          Use Current Location
                        </Button>
                      </div>
                      <Input
                        id="address"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                        placeholder="Enter your default address in Tanzania"
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue={isBuyer ? "preferences" : "business"}>
                  <TabsList className="mb-4">
                    {isBuyer && <TabsTrigger value="preferences">Preferences</TabsTrigger>}
                    {isSeller && <TabsTrigger value="business">Business Profile</TabsTrigger>}
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  </TabsList>
                  
                  {isBuyer && (
                    <TabsContent value="preferences" className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Delivery Preferences</h3>
                        <p className="text-sm text-muted-foreground">
                          Configure your preferred delivery options and locations
                        </p>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <h3 className="flex items-center text-lg font-medium">
                          <MapPin className="h-5 w-5 mr-2 text-primary" />
                          Default Delivery Location
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {buyerProfile?.deliveryPreferences?.defaultAddress || "No default address set"}
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => setIsEditing(true)}
                        >
                          Update Location
                        </Button>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Payment Methods</h3>
                        <p className="text-sm text-muted-foreground">
                          Add or manage your payment methods
                        </p>
                        <Button variant="outline" className="mt-2">Add Payment Method</Button>
                      </div>
                    </TabsContent>
                  )}
                  
                  {isSeller && (
                    <TabsContent value="business" className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Business Information</h3>
                        <div className="grid gap-2">
                          <div className="flex justify-between">
                            <p className="text-sm text-muted-foreground">Business Name</p>
                            <p className="text-sm font-medium">{sellerProfile?.businessName || "Not set"}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm text-muted-foreground">Verification Status</p>
                            <p className="text-sm font-medium">{sellerProfile?.verificationStatus?.toUpperCase() || "PENDING"}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm text-muted-foreground">Average Rating</p>
                            <p className="text-sm font-medium">{sellerProfile?.averageRating || 0}/5 ({sellerProfile?.totalRatings || 0} reviews)</p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Business Description</h3>
                        <p className="text-sm text-muted-foreground">
                          {sellerProfile?.businessDescription || "No business description provided."}
                        </p>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Business Location</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Set your farm or business location for buyers to find you
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => setIsEditing(true)}
                        >
                          Update Business Location
                        </Button>
                      </div>
                    </TabsContent>
                  )}
                  
                  <TabsContent value="security" className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Security Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your account security preferences
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <Button variant="outline">Change Password</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Notification Preferences</h3>
                      <p className="text-sm text-muted-foreground">
                        Control how and when you receive notifications
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure which emails you'd like to receive
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
