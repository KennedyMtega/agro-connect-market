
import { useState, useRef, useCallback } from 'react';
import { Vendor } from '@/types/map';
import { useMapVendors } from './useMapVendors';
import { useToast } from './use-toast';

export const useGoogleMapState = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { vendors, setVendors, mockVendors } = useMapVendors();
  const { toast } = useToast();

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    console.log('Map loaded successfully');
  }, []);

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setShowResults(false);
      return;
    }

    setSearchQuery(query);
    setIsSearching(true);
    setShowResults(true);

    // Simulate search delay
    setTimeout(() => {
      setVendors(mockVendors);
      setIsSearching(false);
      
      toast({
        title: "Search Complete",
        description: `Found ${mockVendors.length} vendors with "${query}"`,
      });
    }, 1000);
  }, [mockVendors, setVendors, toast]);

  const handleVendorSelect = useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowResults(false);
    
    if (map) {
      map.panTo({ lat: vendor.location.lat, lng: vendor.location.lng });
      map.setZoom(16);
    }
  }, [map]);

  const handleCloseVendor = useCallback(() => {
    setSelectedVendor(null);
  }, []);

  const handleViewVendorDetails = useCallback((vendor: Vendor) => {
    // Navigate to vendor details page or show detailed view
    console.log('View vendor details:', vendor);
    // You can implement navigation logic here
  }, []);

  return {
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
  };
};
