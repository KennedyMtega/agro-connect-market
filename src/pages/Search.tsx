
import React, { useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Layout from "@/components/layout/Layout";
import GoogleMapContainer from "@/components/map/GoogleMapContainer";
import GoogleMapMarkers from "@/components/map/GoogleMapMarkers";
import BottomCard from "@/components/map/BottomCard";
import SearchResultsDrawer from "@/components/search/SearchResultsDrawer";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useGoogleMapState } from "@/hooks/useGoogleMapState";

const Search = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const {
    map,
    searchQuery,
    showResults,
    selectedVendor,
    isSearching,
    vendors,
    handleMapLoad,
    handleSearch,
    handleVendorSelect,
    handleCloseVendor,
    handleViewVendorDetails,
    setShowResults
  } = useGoogleMapState();

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <Layout hideFooter={true}>
      <div className="relative h-[calc(100vh-64px)] overflow-hidden">
        {/* Google Map Container */}
        <GoogleMapContainer 
          onMapLoad={handleMapLoad}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Map Markers */}
        {map && vendors.length > 0 && (
          <GoogleMapMarkers
            map={map}
            vendors={vendors}
            onVendorSelect={handleVendorSelect}
          />
        )}
        
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
        
        {/* Bottom Card for Selected Vendor */}
        <BottomCard
          vendor={selectedVendor}
          onClose={handleCloseVendor}
          onViewDetails={handleViewVendorDetails}
        />
        
        {/* Search Results Drawer */}
        <SearchResultsDrawer
          isOpen={showResults}
          onClose={() => setShowResults(false)}
          vendors={vendors}
          searchQuery={searchQuery}
          onVendorSelect={handleVendorSelect}
        />
      </div>
    </Layout>
  );
};

export default Search;
