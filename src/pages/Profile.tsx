
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { user, buyerProfile, sellerProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
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
                <CardDescription>{user?.userType.charAt(0).toUpperCase() + user?.userType.slice(1)}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user?.email || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{user?.phoneNumber || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground">{user?.createdAt?.toLocaleDateString() || "Unknown"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Phone Verification</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.isPhoneVerified ? "Verified ✓" : "Not Verified"}
                  </p>
                </div>
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
                          Configure your preferred delivery options and times
                        </p>
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
                            <p className="text-sm font-medium">{sellerProfile?.verificationStatus.toUpperCase() || "PENDING"}</p>
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
