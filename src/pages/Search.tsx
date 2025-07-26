
import React, { useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Layout from "@/components/layout/Layout";
import GoogleMapContainer from "@/components/map/GoogleMapContainer";
import GoogleMapMarkers from "@/components/map/GoogleMapMarkers";
import BottomCard from "@/components/map/BottomCard";
import SearchResultsDrawer from "@/components/search/SearchResultsDrawer";
import VendorDetailsDrawer from "@/components/vendor/VendorDetailsDrawer";
import { SearchBar } from "@/components/search/SearchBar";
import { GlobalSearchComponent } from "@/components/search/GlobalSearchComponent";
import { Button } from "@/components/ui/button";
import { ShoppingCart, List, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useGoogleMapState } from "@/hooks/useGoogleMapState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Search = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchMode, setSearchMode] = React.useState<"map" | "list">("list");
  
  const {
    map,
    searchQuery,
    showResults,
    selectedVendor,
    detailedVendor,
    isSearching,
    vendors,
    handleMapLoad,
    handleSearch,
    handleVendorSelect,
    handleCloseVendor,
    handleViewVendorDetails,
    handleCloseDetailedVendor,
    setShowResults
  } = useGoogleMapState();

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current && searchMode === "map") {
      searchInputRef.current.focus();
    }
  }, [searchMode]);

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleSellerSelect = (sellerId: string) => {
    console.log('Selected seller:', sellerId);
  };

  return (
    <Layout hideFooter={searchMode === "map"}>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Find Crops</h1>
          <p className="text-muted-foreground">
            Search for crops from verified sellers across the platform
          </p>
        </div>

        <Tabs value={searchMode} onValueChange={(value) => setSearchMode(value as "map" | "list")}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                Map View
              </TabsTrigger>
            </TabsList>

            {/* Cart Button */}
            <Button 
              onClick={handleCartClick}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {totalItems > 0 && (
                <Badge 
                  className="bg-red-500 text-white px-1.5 rounded-full"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>

          <TabsContent value="list" className="mt-0">
            <GlobalSearchComponent onSellerSelect={handleSellerSelect} />
          </TabsContent>

          <TabsContent value="map" className="mt-0">
            <div className="relative h-[calc(100vh-200px)] overflow-hidden rounded-lg border">
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
              <div className="absolute top-4 left-4 right-4 z-20">
                <SearchBar 
                  onSearch={handleSearch} 
                  inputRef={searchInputRef}
                />
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

              {/* Vendor Details Drawer */}
              <VendorDetailsDrawer
                vendor={detailedVendor}
                isOpen={!!detailedVendor}
                onClose={handleCloseDetailedVendor}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Search;
