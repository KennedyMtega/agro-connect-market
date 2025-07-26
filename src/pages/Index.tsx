import { useAuth } from "@/hooks/useAuth";
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
  Clock,
  Award,
  Truck,
  Star,
  Globe,
  Smartphone,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sprout,
  Wheat,
  Apple
} from "lucide-react";
import Layout from "@/components/layout/Layout";

const HeroSection = () => {
  const { user, profile } = useAuth();

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-hero text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container px-4 mx-auto relative z-10">
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
                Connect directly with trusted farmers and buyers. Get the freshest produce at fair prices, 
                while building sustainable agricultural communities across Tanzania.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {!user ? (
                <>
                  <Link to="/role-selection">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 shadow-lg">
                      Start Trading Today
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 backdrop-blur-sm">
                      View Marketplace
                    </Button>
                  </Link>
                </>
              ) : profile?.user_type === "buyer" ? (
                <Link to="/search">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-lg">
                    Explore Fresh Produce
                    <Leaf className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-lg">
                    Manage Your Farm
                    <Store className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              )}
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

const FeaturesSection = () => {
  const features = [
    {
      icon: Leaf,
      title: "Farm-Fresh Quality",
      description: "Direct from farm to table. Every product is verified for freshness and quality by our agricultural experts.",
      gradient: "from-green-400 to-green-600"
    },
    {
      icon: MapPin,
      title: "Location Intelligence",
      description: "Smart location-based matching connects you with the nearest suppliers, reducing costs and delivery time.",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Advanced payment protection and seller verification ensure every transaction is safe and reliable.",
      gradient: "from-purple-400 to-purple-600"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Trade on-the-go with our mobile-first platform designed for farmers and buyers in rural areas.",
      gradient: "from-pink-400 to-pink-600"
    },
    {
      icon: BarChart3,
      title: "Market Analytics",
      description: "Real-time pricing insights and market trends help you make informed trading decisions.",
      gradient: "from-orange-400 to-orange-600"
    },
    {
      icon: Truck,
      title: "Logistics Support",
      description: "Integrated delivery network ensures your produce reaches buyers fresh and on time.",
      gradient: "from-cyan-400 to-cyan-600"
    }
  ];

  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Empowering Agricultural Trade</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with deep agricultural expertise to create 
            the most efficient marketplace for farmers and buyers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-primary transition-all duration-300 border-0 shadow-soft">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
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
        <h2 className="text-4xl font-bold text-center mb-16">Two Sides, One Marketplace</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Buyers Section */}
          <div className="bg-white rounded-2xl p-8 shadow-primary">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white mr-6">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">For Buyers</h3>
                <p className="text-blue-600 font-medium">Restaurants • Retailers • Wholesalers</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              {[
                "Access verified suppliers across Tanzania",
                "Compare prices and quality ratings",
                "Bulk ordering with volume discounts",
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
            
            <Link to="/role-selection">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                Start Buying
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Sellers Section */}
          <div className="bg-white rounded-2xl p-8 shadow-primary">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white mr-6">
                <Store className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">For Sellers</h3>
                <p className="text-green-600 font-medium">Farmers • Cooperatives • Distributors</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              {[
                "Reach buyers nationwide instantly",
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
            
            <Link to="/role-selection">
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                Start Selling
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Users,
      title: "Create Your Account",
      description: "Sign up in minutes as a buyer or seller. Complete verification to build trust in the marketplace.",
      step: "01"
    },
    {
      icon: Leaf,
      title: "List or Browse Products",
      description: "Farmers upload fresh produce with photos and details. Buyers search by location, price, and quality.",
      step: "02"
    },
    {
      icon: Package,
      title: "Connect & Trade",
      description: "Direct communication between buyers and sellers. Negotiate prices and arrange delivery.",
      step: "03"
    },
    {
      icon: TrendingUp,
      title: "Track & Grow",
      description: "Monitor orders in real-time. Build relationships and grow your agricultural business.",
      step: "04"
    }
  ];

  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple Process, Powerful Results</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From farm to market in four easy steps. Join thousands of successful traders already using AgroConnect.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-green-600 flex items-center justify-center text-white shadow-primary group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-10 h-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 text-yellow-900 font-bold text-sm flex items-center justify-center">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent -translate-x-1/2 z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria Mwangi",
      role: "Tomato Farmer, Morogoro",
      text: "AgroConnect changed my life! I now sell directly to restaurants in Dar es Salaam and earn 40% more than traditional markets.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b217?auto=format&fit=crop&q=80&w=120&h=120",
      rating: 5,
      crop: "🍅"
    },
    {
      name: "John Kimani",
      role: "Restaurant Owner, Arusha",
      text: "The quality of produce I get through AgroConnect is exceptional. Fresh vegetables delivered the same day they're harvested!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120",
      rating: 5,
      crop: "🥬"
    },
    {
      name: "Grace Shayo",
      role: "Maize Cooperative Leader",
      text: "Our cooperative now reaches buyers across three regions. The platform's logistics support made expansion possible.",
      avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=120&h=120",
      rating: 5,
      crop: "🌽"
    }
  ];

  return (
    <section className="py-20 bg-gradient-nature">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Real Stories from Real Farmers</h2>
          <p className="text-xl text-muted-foreground">
            See how AgroConnect is transforming agricultural communities across Tanzania
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-soft border-0 hover:shadow-primary transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 text-2xl">{testimonial.crop}</div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Badge variant="secondary" className="text-lg px-6 py-3">
            Join 5,000+ successful traders today! 🌱
          </Badge>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  const { user, profile } = useAuth();
  
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
            Join the platform that's connecting farmers and buyers across Tanzania. 
            Start trading fresh produce today and be part of the agricultural revolution.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
              <Link to="/role-selection">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 shadow-lg px-8 py-4 text-lg">
                  Join as Farmer
                  <Leaf className="ml-2 w-6 h-6" />
                </Button>
              </Link>
              <Link to="/role-selection">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 shadow-lg px-8 py-4 text-lg">
                  Join as Buyer
                  <ShoppingCart className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </div>
          ) : profile?.user_type === "buyer" ? (
            <Link to="/search">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-lg px-8 py-4 text-lg">
                Discover Fresh Produce
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          ) : (
            <Link to="/dashboard">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-lg px-8 py-4 text-lg">
                Grow Your Business
                <TrendingUp className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-white/90">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span className="font-medium">Free to join</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span className="font-medium">Verified sellers only</span>
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

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <PlatformSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;