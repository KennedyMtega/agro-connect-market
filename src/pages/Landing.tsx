import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Leaf, 
  ShoppingCart, 
  MapPin, 
  Shield, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Truck, 
  Package,
  Store,
  TrendingUp,
  Users,
  Globe,
  BarChart3,
  Smartphone
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("buyers");
  
  const selectUserPath = (userType: 'buyer' | 'seller') => {
    localStorage.setItem('selectedUserType', userType);
    navigate("/auth");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center text-primary font-bold text-xl">
          <Leaf className="h-6 w-6 mr-2" />
          <span>AgroConnect</span>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="hidden md:flex">
            Tanzania's #1 Farm-to-Table Platform
          </Badge>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Fresh Food, Fair Trade
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Connecting Tanzania's farmers directly with food lovers. 
            Skip the middleman, support local agriculture, and enjoy the freshest produce at fair prices.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">5,000+</div>
              <div className="text-sm text-muted-foreground">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">50K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">26</div>
              <div className="text-sm text-muted-foreground">Regions Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">4.9★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
        
        {/* Platform Selection Tabs */}
        <div className="w-full max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="buyers" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                For Food Lovers
              </TabsTrigger>
              <TabsTrigger value="sellers" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                For Farmers
              </TabsTrigger>
            </TabsList>
            
            {/* Buyers Section */}
            <TabsContent value="buyers" className="space-y-8">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
                  🛒 Fresh Food Direct to You
                </Badge>
                <h2 className="text-4xl font-bold mb-4 text-blue-900">
                  Farm-Fresh Quality at Your Doorstep
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Discover the freshest produce from verified farmers across Tanzania. 
                  Get premium quality at fair prices, delivered fresh to your table.
                </p>
              </div>
              
              {/* Features for Buyers */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-blue-900">
                      Local & Fresh
                    </CardTitle>
                    <CardDescription>
                      Find farmers near you for the freshest produce possible
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-blue-900">
                      Verified Quality
                    </CardTitle>
                    <CardDescription>
                      All farmers are verified for quality and safety standards
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Truck className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-blue-900">
                      Fast Delivery
                    </CardTitle>
                    <CardDescription>
                      From farm to your table in hours, not days
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {/* Benefits for Buyers */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-foreground mb-6">
                    Why Choose AgroConnect?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {[
                        "Browse fresh produce from verified farmers",
                        "Compare prices and quality ratings",
                        "Order directly with no middleman markup",
                        "Track your orders in real-time"
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {[
                        "Secure payment with multiple options",
                        "Quality guarantee on all purchases",
                        "Support local farming communities",
                        "Get seasonal produce notifications"
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA for Buyers */}
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4 text-blue-900">
                  Ready to Taste the Difference?
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of families enjoying fresh, quality produce directly from Tanzania's best farmers.
                </p>
                
                <Button 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                  onClick={() => selectUserPath('buyer')}
                >
                  Start Shopping Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <div className="flex justify-center items-center mt-6 space-x-8 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span>4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-blue-500 mr-1" />
                    <span>50,000+ Orders</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-green-500 mr-1" />
                    <span>Same Day Delivery</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Sellers Section */}
            <TabsContent value="sellers" className="space-y-8">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
                  🌾 Grow Your Farm Business
                </Badge>
                <h2 className="text-4xl font-bold mb-4 text-green-900">
                  Connect Directly with Customers
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Sell your harvest at fair prices, build your brand, and grow your agricultural 
                  business with Tanzania's leading farm-to-table platform.
                </p>
              </div>
              
              {/* Features for Sellers */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Globe className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-green-900">
                      Nationwide Reach
                    </CardTitle>
                    <CardDescription>
                      Sell to customers across all regions of Tanzania
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-green-900">
                      Better Prices
                    </CardTitle>
                    <CardDescription>
                      Earn up to 40% more by selling directly to customers
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Smartphone className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-green-900">
                      Mobile First
                    </CardTitle>
                    <CardDescription>
                      Manage your entire farm business from your phone
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {/* Benefits for Sellers */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-foreground mb-6">
                    Transform Your Farm Business
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {[
                        "List your products with photos and descriptions",
                        "Set your own prices based on market insights",
                        "Receive orders directly from customers",
                        "Get paid securely within 24 hours"
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {[
                        "Access to agricultural financing options",
                        "Build your farm brand and reputation",
                        "Real-time market pricing analytics",
                        "Connect with farming communities"
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Stats for Sellers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2">5,000+</div>
                  <div className="text-muted-foreground">Active Farmers</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2">40%</div>
                  <div className="text-muted-foreground">Higher Earnings</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2">26</div>
                  <div className="text-muted-foreground">Regions Covered</div>
                </div>
              </div>

              {/* CTA for Sellers */}
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4 text-green-900">
                  Join Tanzania's Leading Farm Network
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Start selling your harvest today and be part of the agricultural revolution 
                  that's transforming Tanzania's farming communities.
                </p>
                
                <Button 
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                  onClick={() => selectUserPath('seller')}
                >
                  Start Farming Business
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <div className="flex justify-center items-center mt-6 space-x-8 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-1" />
                    <span>Verified Platform</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="w-4 h-4 text-blue-500 mr-1" />
                    <span>Market Analytics</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-purple-500 mr-1" />
                    <span>Community Support</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Footer */}
      <div className="pb-8 pt-4 text-center text-sm text-muted-foreground bg-white/50">
        <div className="flex justify-center items-center space-x-8">
          <span>Fresh food from trusted farmers</span>
          <span>•</span>
          <span>Empowering Tanzania's agriculture</span>
          <span>•</span>
          <span>AgroConnect 2024</span>
        </div>
      </div>
    </div>
  );
};

export default Landing;