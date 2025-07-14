import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Leaf,
  ShoppingCart,
  Store,
  TrendingUp,
  MapPin,
  Shield,
  User,
  Package
} from "lucide-react";
import Layout from "@/components/layout/Layout";

const HeroSection = () => {
  const { user, profile } = useAuth();

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-green-900 to-green-700 text-white">
      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Connecting Agricultural Buyers and Sellers
            </h1>
            <p className="text-lg md:text-xl">
              AgroConnect is a marketplace platform that makes buying and selling agricultural products 
              simple, transparent, and efficient.
            </p>
            <div className="flex flex-wrap gap-4">
              {!user ? (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-white text-green-800 hover:bg-gray-100">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Learn More
                    </Button>
                  </Link>
                </>
              ) : profile?.user_type === "buyer" ? (
                <Link to="/search">
                  <Button size="lg" className="bg-white text-green-800 hover:bg-gray-100">
                    Browse Crops
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-white text-green-800 hover:bg-gray-100">
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative h-80 rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&q=80" 
                alt="Agricultural marketplace" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose AgroConnect?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fresh Produce</h3>
                <p className="text-muted-foreground">Connect directly with local farmers to access the freshest produce available.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Location-Based</h3>
                <p className="text-muted-foreground">Find agricultural products in your area to reduce transportation costs and time.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                <p className="text-muted-foreground">Buy and sell with confidence using our secure payment processing system.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

const BuyerSellerSection = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">One Platform, Two Experiences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-card rounded-lg p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">For Buyers</h3>
            </div>
            
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <div className="mr-2 text-primary mt-1">•</div>
                <span>Browse crops from verified sellers</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 text-primary mt-1">•</div>
                <span>Filter by location, price, and quality</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 text-primary mt-1">•</div>
                <span>Track orders in real-time</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 text-primary mt-1">•</div>
                <span>Secure payment processing</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 text-primary mt-1">•</div>
                <span>Rate and review sellers</span>
              </li>
            </ul>
            
            <Link to="/register">
              <Button className="w-full">Register as a Buyer</Button>
            </Link>
          </div>
          
          <div className="bg-card rounded-lg p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">For Sellers</h3>
            </div>
            
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <div className="mr-2 text-primary mt-1">•</div>
                <span>Create and manage crop listings</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 text-primary mt-1">•</div>
                <span>Track inventory in real-time</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 text-primary mt-1">•</div>
                <span>Manage orders and fulfillment</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 text-primary mt-1">•</div>
                <span>Access analytics and business insights</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 text-primary mt-1">•</div>
                <span>Premium visibility options</span>
              </li>
            </ul>
            
            <Link to="/register">
              <Button className="w-full">Register as a Seller</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4 relative">
              <User className="w-8 h-8" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">1</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
            <p className="text-muted-foreground">Sign up as either a buyer or seller to access the platform.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4 relative">
              <Package className="w-8 h-8" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">2</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Buy or Sell</h3>
            <p className="text-muted-foreground">Browse and purchase crops as a buyer or list your products as a seller.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4 relative">
              <TrendingUp className="w-8 h-8" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">3</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Grow Your Business</h3>
            <p className="text-muted-foreground">Track orders, manage inventory, and expand your agricultural network.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "John Farmer",
      role: "Crop Seller",
      text: "AgroConnect has transformed my farming business. I now reach more buyers directly and get better prices for my produce.",
      avatar: "https://images.unsplash.com/photo-1579038773867-044c48829161?auto=format&fit=crop&q=80&w=120&h=120"
    },
    {
      name: "Sarah Mills",
      role: "Wholesale Buyer",
      text: "Finding quality produce used to be a challenge. With AgroConnect, I can easily find verified sellers near my location.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120"
    },
    {
      name: "Michael Rodriguez",
      role: "Agricultural Supplier",
      text: "The seller dashboard gives me all the tools I need to manage my inventory and track sales efficiently.",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=120&h=120"
    }
  ];

  return (
    <section className="py-16 bg-muted">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{testimonial.role}</p>
                  <p className="italic">"{testimonial.text}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  const { user, profile } = useAuth();
  
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Agricultural Business?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join AgroConnect today and become part of a growing network of agricultural buyers and sellers.
        </p>
        
        {!user ? (
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
          </div>
        ) : profile?.user_type === "buyer" ? (
          <Link to="/search">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Start Shopping
            </Button>
          </Link>
        ) : (
          <Link to="/dashboard">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Manage Your Store
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <BuyerSellerSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
