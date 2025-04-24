
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Layout from "@/components/layout/Layout";
import MapView from "@/components/map/MapView";
import CropSearchResults from "@/components/search/CropSearchResults";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Map } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ViewState } from "@/types/map";
import { useMapViewState } from "@/components/map/useMapViewState";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const mapState = useMapViewState();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      mapState.setSearchTerm(query);
      mapState.handleSearch();
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <Layout>
      <div className="relative h-[calc(100vh-64px)]">
        {/* Map Container - Take full height */}
        <div className="absolute inset-0 w-full h-full">
          <MapView />
        </div>
        
        {/* Search Bar - Fixed on top */}
        <div className="absolute top-0 left-0 right-0 p-4 z-20">
          <SearchBar 
            onSearch={handleSearch} 
            inputRef={searchInputRef}
          />
        </div>
        
        {/* Cart Button - Fixed at bottom right */}
        <div className="absolute bottom-4 right-4 z-20">
          <Button 
            onClick={handleCartClick}
            className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
          >
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 bg-red-500 text-white px-1.5 rounded-full"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </div>
        
        {/* Results Drawer - Shows up when searching */}
        <Drawer 
          open={showResults} 
          onOpenChange={setShowResults}
        >
          <DrawerContent className="max-h-[70vh] rounded-t-xl">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Results for "{searchQuery}"
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowResults(false)}
                >
                  <Map className="mr-2 h-4 w-4" /> View Map
                </Button>
              </div>
              
              <CropSearchResults 
                vendors={mapState.vendors}
                onSelectVendor={mapState.handleSelectVendor}
                searchQuery={searchQuery}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </Layout>
  );
};

export default Search;
