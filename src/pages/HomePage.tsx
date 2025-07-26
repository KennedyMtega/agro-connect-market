import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  ShoppingCart,
  Store,
  TrendingUp,
  MapPin,
  Shield,
  Users,
  Package,
  ArrowRight,
  Sprout,
  Wheat,
  Apple,
  CheckCircle,
  Star,
  Globe,
  Smartphone,
  BarChart3,
  Truck
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-hero text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center text-white font-bold text-2xl">
            <Leaf className="h-8 w-8 mr-3" />
            <span>AgroConnect</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm px-4 py-2 bg-white/20 text-white border-white/30">
                🌱 Revolutionizing Agriculture Trade
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Where Fresh Meets 
                <span className="text-yellow-300"> Fair</span>
              </h1>
              <p className="text-xl md:text-2xl leading-relaxed opacity-90">
                Connect directly with trusted farmers and vendors. Get the freshest produce at fair prices, 
                while building sustainable agricultural communities across Tanzania.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/user">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 shadow-lg">
                  Find Fresh Produce
                  <ShoppingCart className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/farmer">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 backdrop-blur-sm">
                  Sell Your Harvest
                  <Store className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center space-x-2 text-white/90">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">5000+ Active Farmers</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <Package className="w-5 h-5" />
                <span className="text-sm font-medium">100+ Crop Varieties</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">All Regions Covered</span>
              </div>
            </div>
          </div>

          <div className="relative animate-float">
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80" 
                alt="Fresh agricultural produce marketplace" 
                className="w-full h-full object-cover"
              />
              {/* Floating Stats Cards */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg animate-fade-in-up">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-800">Live Orders: 127</span>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg animate-fade-in-up">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-800">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const stats = [
    { icon: Users, value: "5,000+", label: "Active Farmers", color: "text-green-600" },
    { icon: Package, value: "50,000+", label: "Successful Orders", color: "text-blue-600" },
    { icon: MapPin, value: "26", label: "Regions Covered", color: "text-purple-600" },
    { icon: TrendingUp, value: "98%", label: "Customer Satisfaction", color: "text-orange-600" }
  ];

  return (
    <section className="py-16 bg-gradient-nature">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center animate-fade-in-up">
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full bg-white shadow-soft flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PlatformSection = () => {
  return (
    <section className="py-20 bg-gradient-nature">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">Two Platforms, One Mission</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Users Section */}
          <div className="bg-white rounded-2xl p-8 shadow-primary">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white mr-6">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">For Food Lovers</h3>
                <p className="text-blue-600 font-medium">Restaurants • Retailers • Families</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              {[
                "Access verified farmers across Tanzania",
                "Compare prices and quality ratings",
                "Fresh produce delivered to your door",
                "Real-time inventory tracking",
                "Flexible payment options",
                "Quality guarantee on all purchases"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            
            <Link to="/user">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                Start Shopping
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Farmers Section */}
          <div className="bg-white rounded-2xl p-8 shadow-primary">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white mr-6">
                <Store className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">For Farmers</h3>
                <p className="text-green-600 font-medium">Individual Farmers • Cooperatives • Distributors</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              {[
                "Reach customers nationwide instantly",
                "Set competitive prices with market insights",
                "Manage inventory and orders efficiently",
                "Get paid securely and on time",
                "Build your agricultural brand",
                "Access agricultural financing options"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            
            <Link to="/farmer">
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                Start Farming Business
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-hero text-primary-foreground relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <Sprout className="absolute top-10 left-10 w-24 h-24 animate-float" />
        <Wheat className="absolute top-20 right-20 w-32 h-32 animate-float" style={{ animationDelay: '2s' }} />
        <Apple className="absolute bottom-20 left-1/4 w-20 h-20 animate-float" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="container px-4 mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Transform African Agriculture?
          </h2>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
            Join the platform that's connecting farmers and food lovers across Tanzania. 
            Start your journey today and be part of the agricultural revolution.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
            <Link to="/farmer">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 shadow-lg px-8 py-4 text-lg">
                Join as Farmer
                <Leaf className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <Link to="/user">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 shadow-lg px-8 py-4 text-lg">
                Find Fresh Food
                <ShoppingCart className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-white/90">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span className="font-medium">Free to join</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span className="font-medium">Verified farmers only</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span className="font-medium">24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <PlatformSection />
      <CTASection />
    </div>
  );
};

export default HomePage;