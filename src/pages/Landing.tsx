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
  Smartphone,
  Heart,
  Award,
  Zap,
  Target,
  DollarSign,
  Phone,
  Mail,
  CreditCard,
  HandHeart,
  Sprout,
  Scale,
  MessageCircle,
  Bell
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("buyers");
  
  const selectUserPath = (userType: 'buyer' | 'seller') => {
    if (userType === 'buyer') {
      navigate("/buyer-auth");
    } else {
      navigate("/seller-onboarding");
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-white/95 backdrop-blur-sm border-b sticky top-0 z-50">
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

      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        <div className="relative z-10 text-center text-white px-6 py-20">
          <h1 className="text-7xl font-bold mb-6 animate-fade-in">
            Fresh Food, Fair Trade
          </h1>
          <p className="text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            Connecting Tanzania's farmers directly with food lovers. 
            Skip the middleman, support local agriculture, and enjoy the freshest produce at fair prices.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { number: "5,000+", label: "Active Farmers" },
              { number: "50K+", label: "Happy Customers" },
              { number: "26", label: "Regions Covered" },
              { number: "4.9★", label: "Average Rating" }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              onClick={() => selectUserPath('buyer')}
            >
              Shop Fresh Food
              <ShoppingCart className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-white/20 border-white text-white hover:bg-white/30 px-8 py-4 text-lg"
              onClick={() => selectUserPath('seller')}
            >
              Sell Your Harvest
              <Store className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
        
      {/* Platform Selection Tabs */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-6 text-gray-900">
                Choose Your Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Whether you're looking for fresh produce or ready to grow your farming business, 
                we have the perfect solution for you.
              </p>
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="buyers" className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  For Food Lovers
                </TabsTrigger>
                <TabsTrigger value="sellers" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  For Farmers
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Buyers Content */}
            <TabsContent value="buyers" className="space-y-20">
              {/* Hero Section for Buyers */}
              <div className="text-center">
                <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800 text-lg px-4 py-2">
                  🛒 Fresh Food Direct to You
                </Badge>
                <h2 className="text-5xl font-bold mb-6 text-blue-900">
                  Farm-Fresh Quality at Your Doorstep
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover the freshest produce from verified farmers across Tanzania. 
                  Get premium quality at fair prices, delivered fresh to your table.
                </p>
              </div>

              {/* Features Grid with Images */}
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: MapPin,
                    title: "Local & Fresh",
                    description: "Find farmers near you for the freshest produce possible",
                    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  },
                  {
                    icon: Shield,
                    title: "Verified Quality",
                    description: "All farmers are verified for quality and safety standards",
                    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  },
                  {
                    icon: Truck,
                    title: "Fast Delivery",
                    description: "From farm to your table in hours, not days",
                    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  }
                ].map((feature, index) => (
                  <Card key={index} className="border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl overflow-hidden">
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${feature.image})` }} />
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                        <feature.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl font-bold text-blue-900">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* How It Works Section */}
              <div className="bg-white rounded-2xl p-12 shadow-lg">
                <h3 className="text-4xl font-bold text-center mb-12 text-gray-900">How It Works</h3>
                <div className="grid md:grid-cols-4 gap-8">
                  {[
                    { icon: MapPin, title: "Discover", description: "Browse local farmers and their fresh produce" },
                    { icon: ShoppingCart, title: "Order", description: "Select your items and place your order" },
                    { icon: CreditCard, title: "Pay", description: "Secure payment with multiple options" },
                    { icon: Truck, title: "Enjoy", description: "Fresh produce delivered to your door" }
                  ].map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center">
                        <step.icon className="h-10 w-10 text-blue-600" />
                      </div>
                      <h4 className="text-xl font-bold mb-2 text-blue-900">{step.title}</h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits Section - 2 Column Layout */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-4xl font-bold mb-8 text-blue-900">Why Choose AgroConnect?</h3>
                  <div className="space-y-6">
                    {[
                      "Browse fresh produce from verified farmers",
                      "Compare prices and quality ratings",
                      "Order directly with no middleman markup",
                      "Track your orders in real-time",
                      "Secure payment with multiple options",
                      "Quality guarantee on all purchases",
                      "Support local farming communities",
                      "Get seasonal produce notifications"
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                        <span className="text-lg text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div 
                    className="h-96 bg-cover bg-center rounded-2xl shadow-2xl"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl" />
                </div>
              </div>

              {/* Testimonials Section */}
              <div className="bg-blue-50 rounded-2xl p-12">
                <h3 className="text-4xl font-bold text-center mb-12 text-blue-900">What Our Customers Say</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { name: "Sarah M.", role: "Food Enthusiast", text: "The quality of produce is incredible! Fresh vegetables delivered right to my door." },
                    { name: "David K.", role: "Family Chef", text: "Supporting local farmers while getting the best ingredients for my family. Win-win!" },
                    { name: "Grace L.", role: "Health Coach", text: "My clients love the fresh, organic options available through AgroConnect." }
                  ].map((testimonial, index) => (
                    <Card key={index} className="bg-white border-blue-200">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                        <div>
                          <p className="font-bold text-blue-900">{testimonial.name}</p>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* CTA Section for Buyers */}
              <div className="text-center bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white">
                <h3 className="text-4xl font-bold mb-6">
                  Ready to Taste the Difference?
                </h3>
                <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                  Join thousands of families enjoying fresh, quality produce directly from Tanzania's best farmers.
                </p>
                
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-4 text-xl font-semibold"
                  onClick={() => selectUserPath('buyer')}
                >
                  Start Shopping Now
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
                
                <div className="flex justify-center items-center mt-8 space-x-12 text-blue-100">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-2" />
                    <span>4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    <span>50,000+ Orders</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>Same Day Delivery</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Sellers Content */}
            <TabsContent value="sellers" className="space-y-20">
              {/* Hero Section for Sellers */}
              <div className="text-center">
                <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800 text-lg px-4 py-2">
                  🌾 Grow Your Farm Business
                </Badge>
                <h2 className="text-5xl font-bold mb-6 text-green-900">
                  Connect Directly with Customers
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Sell your harvest at fair prices, build your brand, and grow your agricultural 
                  business with Tanzania's leading farm-to-table platform.
                </p>
              </div>

              {/* Features Grid with Images for Sellers */}
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Globe,
                    title: "Nationwide Reach",
                    description: "Sell to customers across all regions of Tanzania",
                    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  },
                  {
                    icon: TrendingUp,
                    title: "Better Prices",
                    description: "Earn up to 40% more by selling directly to customers",
                    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  },
                  {
                    icon: Smartphone,
                    title: "Mobile First",
                    description: "Manage your entire farm business from your phone",
                    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  }
                ].map((feature, index) => (
                  <Card key={index} className="border-2 border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl overflow-hidden">
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${feature.image})` }} />
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                        <feature.icon className="h-8 w-8 text-green-600" />
                      </div>
                      <CardTitle className="text-xl font-bold text-green-900">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* How It Works for Sellers */}
              <div className="bg-white rounded-2xl p-12 shadow-lg">
                <h3 className="text-4xl font-bold text-center mb-12 text-gray-900">Start Selling in 4 Easy Steps</h3>
                <div className="grid md:grid-cols-4 gap-8">
                  {[
                    { icon: Users, title: "Sign Up", description: "Create your farmer profile and get verified" },
                    { icon: Sprout, title: "List Products", description: "Add your crops with photos and descriptions" },
                    { icon: Bell, title: "Get Orders", description: "Receive orders directly from customers" },
                    { icon: DollarSign, title: "Get Paid", description: "Secure payment within 24 hours" }
                  ].map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
                        <step.icon className="h-10 w-10 text-green-600" />
                      </div>
                      <h4 className="text-xl font-bold mb-2 text-green-900">{step.title}</h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits Section - 2 Column Layout for Sellers */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <div 
                    className="h-96 bg-cover bg-center rounded-2xl shadow-2xl"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent rounded-2xl" />
                </div>
                <div>
                  <h3 className="text-4xl font-bold mb-8 text-green-900">Transform Your Farm Business</h3>
                  <div className="space-y-6">
                    {[
                      "List your products with photos and descriptions",
                      "Set your own prices based on market insights",
                      "Receive orders directly from customers",
                      "Get paid securely within 24 hours",
                      "Access to agricultural financing options",
                      "Build your farm brand and reputation",
                      "Real-time market pricing analytics",
                      "Connect with farming communities"
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                        <span className="text-lg text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Success Stories */}
              <div className="bg-green-50 rounded-2xl p-12">
                <h3 className="text-4xl font-bold text-center mb-12 text-green-900">Farmer Success Stories</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { name: "John M.", role: "Vegetable Farmer", location: "Arusha", text: "My income increased by 45% since joining AgroConnect. Direct sales changed everything!" },
                    { name: "Mary K.", role: "Fruit Grower", location: "Mwanza", text: "I can now reach customers in Dar es Salaam and other cities. Amazing platform!" },
                    { name: "Peter L.", role: "Organic Farmer", location: "Kilimanjaro", text: "The community support and market insights helped me grow my business significantly." }
                  ].map((story, index) => (
                    <Card key={index} className="bg-white border-green-200">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-4">"{story.text}"</p>
                        <div>
                          <p className="font-bold text-green-900">{story.name}</p>
                          <p className="text-sm text-gray-600">{story.role}, {story.location}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Success Stats for Sellers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { number: "5,000+", label: "Active Farmers", icon: Users, color: "green" },
                  { number: "40%", label: "Higher Earnings", icon: TrendingUp, color: "blue" },
                  { number: "26", label: "Regions Covered", icon: Globe, color: "purple" }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-8 bg-white rounded-2xl shadow-lg border-2 border-green-100">
                    <div className={`mx-auto mb-4 p-4 bg-${stat.color}-100 rounded-full w-20 h-20 flex items-center justify-center`}>
                      <stat.icon className={`h-10 w-10 text-${stat.color}-600`} />
                    </div>
                    <div className="text-5xl font-bold text-green-600 mb-2">{stat.number}</div>
                    <div className="text-lg text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Section for Sellers */}
              <div className="text-center bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-12 text-white">
                <h3 className="text-4xl font-bold mb-6">
                  Join Tanzania's Leading Farm Network
                </h3>
                <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                  Start selling your harvest today and be part of the agricultural revolution 
                  that's transforming Tanzania's farming communities.
                </p>
                
                <Button 
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 px-12 py-4 text-xl font-semibold"
                  onClick={() => selectUserPath('seller')}
                >
                  Start Farming Business
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
                
                <div className="flex justify-center items-center mt-8 space-x-12 text-green-100">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    <span>Verified Platform</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    <span>Market Analytics</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Community Support</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions? Need support? Our team is here to help you succeed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="p-8 text-center">
                <Phone className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="text-gray-300">+255 XXX XXX XXX</p>
                <p className="text-sm text-gray-400 mt-2">Mon-Fri, 8AM-6PM</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="p-8 text-center">
                <Mail className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-gray-300">support@agroconnect.tz</p>
                <p className="text-sm text-gray-400 mt-2">24/7 Support</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                <p className="text-gray-300">Instant Help</p>
                <p className="text-sm text-gray-400 mt-2">Available Now</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center text-primary font-bold text-xl mb-4">
                <Leaf className="h-6 w-6 mr-2" />
                <span>AgroConnect</span>
              </div>
              <p className="text-gray-600">
                Connecting Tanzania's farmers with food lovers for a better agricultural future.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">For Buyers</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Find Farmers</li>
                <li>Fresh Produce</li>
                <li>Delivery Info</li>
                <li>Quality Guarantee</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">For Farmers</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Start Selling</li>
                <li>Pricing Guide</li>
                <li>Success Stories</li>
                <li>Community</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center text-gray-500">
            <div className="flex justify-center items-center space-x-8 text-sm">
              <span>Fresh food from trusted farmers</span>
              <span>•</span>
              <span>Empowering Tanzania's agriculture</span>
              <span>•</span>
              <span>AgroConnect 2024</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;