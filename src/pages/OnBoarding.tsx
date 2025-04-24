
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight } from "lucide-react";

const OnBoarding = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  
  const onboardingPages = [
    {
      title: "Welcome to AgroConnect",
      description: "Find and buy fresh agricultural products directly from sellers near you.",
      image: "🌱",
    },
    {
      title: "Find Local Products",
      description: "Use our map to locate sellers with the crops you need in your area.",
      image: "🗺️",
    },
    {
      title: "Easy Ordering Process",
      description: "Select products, add to cart, and place your order in just a few taps.",
      image: "🛒",
    },
  ];
  
  const handleNext = () => {
    if (currentPage < onboardingPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate("/login");
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const goToRegister = () => {
    navigate("/register");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      {/* Header */}
      <div className="p-4 flex justify-end">
        <Button 
          variant="ghost" 
          className="text-green-700" 
          onClick={goToLogin}
        >
          Skip
        </Button>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="mb-8 text-6xl">
          {onboardingPages[currentPage].image}
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 text-green-900">
            {onboardingPages[currentPage].title}
          </h1>
          <p className="text-lg text-gray-600">
            {onboardingPages[currentPage].description}
          </p>
        </div>
        
        {/* Progress dots */}
        <div className="flex space-x-2 mb-8">
          {onboardingPages.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 w-2 rounded-full ${
                currentPage === index ? "bg-green-600" : "bg-green-200"
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-6">
        {currentPage === onboardingPages.length - 1 ? (
          <div className="space-y-3">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700" 
              size="lg"
              onClick={goToLogin}
            >
              Login
            </Button>
            <Button 
              className="w-full bg-white text-green-600 border border-green-600 hover:bg-green-50" 
              size="lg"
              onClick={goToRegister}
            >
              Sign Up
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full bg-green-600 hover:bg-green-700" 
            size="lg"
            onClick={handleNext}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Brand logo */}
      <div className="pb-8 pt-2 flex items-center justify-center">
        <div className="flex items-center text-green-700 font-semibold">
          <Leaf className="h-5 w-5 mr-1" />
          <span>AgroConnect</span>
        </div>
      </div>
    </div>
  );
};

export default OnBoarding;
