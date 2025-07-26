import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Store, TrendingUp, Users, Globe, ArrowRight, CheckCircle, BarChart3, Shield, Smartphone } from "lucide-react";

const FarmerLanding = () => {
  const navigate = useNavigate();
  
  const selectFarmerPath = () => {
    localStorage.setItem('selectedUserType', 'seller');
    navigate("/auth");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center text-green-700 font-bold text-xl">
          <Leaf className="h-6 w-6 mr-2" />
          <span>AgroConnect</span>
        </div>
        <Button variant="ghost" onClick={() => navigate("/")} className="text-green-700">
          ← Back to Home
        </Button>
      </div>
      
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
            🌾 For Farmers
          </Badge>
          <h1 className="text-5xl font-bold mb-4 text-green-900">
            Grow Your Farm Business
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect directly with customers across Tanzania. Sell your harvest at fair prices, 
            build your brand, and grow your agricultural business with our farmer-first platform.
          </p>
        </div>
        
        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
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
                Manage your farm business from your phone
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Benefits List */}
        <div className="w-full max-w-4xl mb-12">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-800 mb-6">
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
                      <span className="text-gray-700">{benefit}</span>
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
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">5,000+</div>
            <div className="text-gray-600">Active Farmers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">40%</div>
            <div className="text-gray-600">Higher Earnings</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">26</div>
            <div className="text-gray-600">Regions Covered</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-900">
            Join Tanzania's Leading Farm Network
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start selling your harvest today and be part of the agricultural revolution that's transforming Tanzania's farming communities.
          </p>
          
          <Button 
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
            onClick={selectFarmerPath}
          >
            Start Farming Business
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <div className="flex justify-center items-center mt-6 space-x-8 text-sm text-gray-500">
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
      </div>
      
      {/* Footer */}
      <div className="pb-8 pt-4 text-center text-sm text-gray-500">
        Empowering Tanzania's farmers • AgroConnect 2024
      </div>
    </div>
  );
};

export default FarmerLanding;