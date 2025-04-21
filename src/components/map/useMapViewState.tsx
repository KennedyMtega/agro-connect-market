
import { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { ViewState, Vendor } from '@/types/map';
import { useToast } from "@/hooks/use-toast";
import { useMapVendors } from '@/hooks/useMapVendors';
import { DEFAULT_MAPBOX_TOKEN } from '@/constants/map';

// Extracted hook for MapView state and logic
export const useMapViewState = () => {
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

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;
    setViewState(ViewState.SEARCHING);
    setIsSearching(true);

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

  const handleSendMessage = () => {
    if (!message.trim() || !selectedVendor) return;
    toast({
      title: "Message Sent",
      description: `Message to ${selectedVendor.name}: ${message}`
    });
    setMessage("");
    setIsMessageOpen(false);
  };

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

  return {
    mapContainer, map,
    viewState, setViewState,
    searchTerm, setSearchTerm,
    selectedVendor, setSelectedVendor,
    selectedCrop, setSelectedCrop,
    quantity, setQuantity,
    isSearching, setIsSearching,
    vendors, setVendors,
    accessToken, setAccessToken,
    isMessageOpen, setIsMessageOpen,
    message, setMessage,
    handleSearch, handlePurchase,
    handleSendMessage, resetSearch,
    handleSelectVendor
  };
};
