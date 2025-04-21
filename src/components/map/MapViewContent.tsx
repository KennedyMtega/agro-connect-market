
import React from "react";
import { ViewState, Vendor } from "@/types/map";
import TokenInput from "./TokenInput";
import SearchOverlay from "./SearchOverlay";
import LoadingOverlay from "./LoadingOverlay";
import VendorList from "./VendorList";
import VendorDetail from "./VendorDetail";
import OrderConfirmation from "./OrderConfirmation";
import mapboxgl from "mapbox-gl";

interface MapViewContentProps {
  viewState: ViewState;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (e?: React.FormEvent) => void;
  isSearching: boolean;
  vendors: Vendor[];
  onSelectVendor: (vendor: Vendor) => void;
  resetSearch: () => void;
  selectedVendor: Vendor | null;
  selectedCrop: string;
  setSelectedCrop: (id: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  onPurchase: () => void;
  isMessageOpen: boolean;
  setIsMessageOpen: (open: boolean) => void;
  message: string;
  setMessage: (msg: string) => void;
  onSendMessage: () => void;
  accessToken: string;
  setAccessToken: (t: string) => void;
  map: React.MutableRefObject<mapboxgl.Map | null>;
  mapContainer: React.RefObject<HTMLDivElement>;
}

const MapViewContent: React.FC<MapViewContentProps> = ({
  viewState,
  searchTerm,
  setSearchTerm,
  handleSearch,
  isSearching,
  vendors,
  onSelectVendor,
  resetSearch,
  selectedVendor,
  selectedCrop,
  setSelectedCrop,
  quantity,
  setQuantity,
  onPurchase,
  isMessageOpen,
  setIsMessageOpen,
  message,
  setMessage,
  onSendMessage,
  accessToken,
  setAccessToken,
  map,
  mapContainer,
}) => {
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
          onSelectVendor={onSelectVendor}
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
          onBack={resetSearch}
          onPurchase={onPurchase}
          isMessageOpen={isMessageOpen}
          setIsMessageOpen={setIsMessageOpen}
          message={message}
          setMessage={setMessage}
          onSendMessage={onSendMessage}
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

export default MapViewContent;
