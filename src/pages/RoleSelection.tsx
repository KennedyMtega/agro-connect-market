import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, Store } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();
  
  const selectRole = (role: 'buyer' | 'seller') => {
    // Store selected role for use in auth flow
    localStorage.setItem('selectedUserType', role);
    navigate("/auth");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="p-4 flex justify-center">
        <div className="flex items-center text-green-700 font-bold text-xl">
          <Leaf className="h-6 w-6 mr-2" />
          <span>AgroConnect</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-green-900">
            Welcome to AgroConnect
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Tanzania's premier agricultural marketplace. Choose how you'd like to get started.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Buyer Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300" onClick={() => selectRole('buyer')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-900">
                I'm a Buyer
              </CardTitle>
              <CardDescription className="text-base">
                Looking to purchase fresh agricultural products
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• Browse local farm products</li>
                <li>• Find crops near your location</li>
                <li>• Direct communication with farmers</li>
                <li>• Secure ordering and delivery</li>
              </ul>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                size="lg"
                onClick={() => selectRole('buyer')}
              >
                Continue as Buyer
              </Button>
            </CardContent>
          </Card>

          {/* Seller Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300" onClick={() => selectRole('seller')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                <Store className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-900">
                I'm a Seller
              </CardTitle>
              <CardDescription className="text-base">
                Ready to sell my agricultural products
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• List your farm products</li>
                <li>• Reach local and distant buyers</li>
                <li>• Manage orders and inventory</li>
                <li>• Grow your agricultural business</li>
              </ul>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                size="lg"
                onClick={() => selectRole('seller')}
              >
                Continue as Seller
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <div className="pb-8 pt-4 text-center text-sm text-gray-500">
        Tanzania's trusted agricultural marketplace since 2024
      </div>
    </div>
  );
};

export default RoleSelection;