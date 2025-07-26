import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, ShoppingCart, MapPin, Shield, Star, ArrowRight, CheckCircle, Clock, Truck, Package } from "lucide-react";

const UserLanding = () => {
  const navigate = useNavigate();
  
  const selectUserPath = () => {
    localStorage.setItem('selectedUserType', 'buyer');
    navigate("/auth");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center text-blue-700 font-bold text-xl">
          <Leaf className="h-6 w-6 mr-2" />
          <span>AgroConnect</span>
        </div>
        <Button variant="ghost" onClick={() => navigate("/")} className="text-blue-700">
          ← Back to Home
        </Button>
      </div>
      
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
            🛒 For Food Lovers
          </Badge>
          <h1 className="text-5xl font-bold mb-4 text-blue-900">
            Fresh Food, Direct From Farms
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the freshest produce from verified farmers across Tanzania. 
            Skip the middleman and get farm-fresh quality at fair prices.
          </p>
        </div>
        
        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold text-blue-900">
                Local & Fresh
              </CardTitle>
              <CardDescription>
                Find farmers near you for the freshest produce
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
                All farmers are verified for quality and safety
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

        {/* Benefits List */}
        <div className="w-full max-w-4xl mb-12">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-800 mb-6">
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
                      <span className="text-gray-700">{benefit}</span>
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
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-900">
            Ready to Taste the Difference?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of families enjoying fresh, quality produce directly from Tanzania's best farmers.
          </p>
          
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            onClick={selectUserPath}
          >
            Start Shopping Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <div className="flex justify-center items-center mt-6 space-x-8 text-sm text-gray-500">
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
      </div>
      
      {/* Footer */}
      <div className="pb-8 pt-4 text-center text-sm text-gray-500">
        Fresh food from trusted farmers • AgroConnect 2024
      </div>
    </div>
  );
};

export default UserLanding;