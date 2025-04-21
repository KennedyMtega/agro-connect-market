
import React, { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { ViewState, Vendor } from '@/types/map';
import { useToast } from "@/hooks/use-toast";
import { useMapVendors } from '@/hooks/useMapVendors';
import { DEFAULT_MAPBOX_TOKEN } from '@/constants/map';

// Import refactored components
import MapContainer from './MapContainer';
import MapControl from './MapControl';
import MapMarkers from './MapMarkers';
import MapRoute from './MapRoute';
import TokenInput from './TokenInput';
import SearchOverlay from './SearchOverlay';
import LoadingOverlay from './LoadingOverlay';
import VendorList from './VendorList';
import VendorDetail from './VendorDetail';
import OrderConfirmation from './OrderConfirmation';

const MapView: React.FC<{ className?: string }> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [viewState, setViewState] = useState<ViewState>(ViewState.INITIAL);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const { vendors, setVendors } = useMapVendors();
  const { toast } = useToast();
  const [accessToken, setAccessToken] = useState<string>(DEFAULT_MAPBOX_TOKEN);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Handle search
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setViewState(ViewState.SEARCHING);
    setIsSearching(true);
    
    // Simulate search
    setTimeout(() => {
      const mockVendors = useMapVendors().mockVendors;
      setVendors(mockVendors);
      setIsSearching(false);
      setViewState(ViewState.VENDOR_LIST);
      
      toast({
        title: "Search Complete",
        description: `Found ${mockVendors.length} vendors for "${searchTerm}"`,
      });
    }, 2000);
  };

  // Handle purchase
  const handlePurchase = () => {
    if (!selectedVendor || !selectedCrop) return;
    
    const crop = selectedVendor.crops.find(c => c.id === selectedCrop);
    if (!crop) return;
    
    toast({
      title: "Order Placed!",
      description: `${quantity} ${crop.unit} of ${crop.name} from ${selectedVendor.name}`,
    });
    
    setViewState(ViewState.CONFIRMATION);
  };

  // Handle message send
  const handleSendMessage = () => {
    if (!message.trim() || !selectedVendor) return;
    
    toast({
      title: "Message Sent",
      description: `Message to ${selectedVendor.name}: ${message}`
    });
    
    setMessage("");
    setIsMessageOpen(false);
  };

  // Reset search
  const resetSearch = () => {
    setViewState(ViewState.INITIAL);
    setSearchTerm("");
    setSelectedVendor(null);
    setSelectedCrop("");
    setQuantity(1);
    
    // Reset map
    if (map.current) {
      map.current.flyTo({
        center: [-74.005974, 40.712776],
        zoom: 13,
        essential: true
      });
      
      // Remove route layer if exists
      if (map.current.getLayer('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }
    }
  };

  // Select vendor
  const handleSelectVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setViewState(ViewState.VENDOR_DETAIL);
    
    // Fly to vendor
    map.current?.flyTo({
      center: [vendor.location.lng, vendor.location.lat],
      zoom: 15,
      essential: true
    });
  };

  // Render based on current view state
  const renderContent = () => {
    switch (viewState) {
      case ViewState.INITIAL:
        return (
          <>
            <TokenInput 
              accessToken={accessToken} 
              setAccessToken={setAccessToken}
              map={map}
              mapContainer={mapContainer}
              defaultPosition={{ lat: 40.712776, lng: -74.005974 }}
            />
            <SearchOverlay 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
            />
          </>
        );
      
      case ViewState.SEARCHING:
        return <LoadingOverlay searchTerm={searchTerm} />;
      
      case ViewState.VENDOR_LIST:
        return (
          <VendorList 
            vendors={vendors} 
            searchTerm={searchTerm}
            onSelectVendor={handleSelectVendor}
            onReset={resetSearch}
          />
        );
      
      case ViewState.VENDOR_DETAIL:
        return selectedVendor ? (
          <VendorDetail
            vendor={selectedVendor}
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
            quantity={quantity}
            setQuantity={setQuantity}
            onBack={() => setViewState(ViewState.VENDOR_LIST)}
            onPurchase={handlePurchase}
            isMessageOpen={isMessageOpen}
            setIsMessageOpen={setIsMessageOpen}
            message={message}
            setMessage={setMessage}
            onSendMessage={handleSendMessage}
            onNavigate={() => {
              // Navigate to vendor
              map.current?.flyTo({
                center: [selectedVendor.location.lng, selectedVendor.location.lat],
                zoom: 16,
                essential: true
              });
            }}
          />
        ) : null;
      
      case ViewState.CONFIRMATION:
        return selectedVendor ? (
          <OrderConfirmation 
            vendor={selectedVendor}
            onReset={resetSearch}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-lg ${className}`}>
      <MapContainer mapContainer={mapContainer} />
      <MapControl 
        accessToken={accessToken}
        mapContainer={mapContainer}
        map={map}
      />
      
      {/* Add markers when vendors are available */}
      {vendors.length > 0 && (
        <MapMarkers 
          map={map}
          vendors={vendors}
          onSelectVendor={handleSelectVendor}
        />
      )}
      
      {/* Add route when confirmation is shown */}
      {viewState === ViewState.CONFIRMATION && selectedVendor && (
        <MapRoute map={map} vendor={selectedVendor} />
      )}
      
      {/* UI Overlays */}
      {renderContent()}
    </div>
  );
};

export default MapView;
