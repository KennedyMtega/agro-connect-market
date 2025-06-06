
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
    console.log('Map loaded successfully in state hook');
    
    // Load all vendors immediately when map loads
    setVendors(mockVendors);
  }, [mockVendors, setVendors]);

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setShowResults(false);
      setVendors(mockVendors);
      return;
    }

    setSearchQuery(query);
    setIsSearching(true);
    setShowResults(true);

    // Simulate search delay and filter vendors based on query
    setTimeout(() => {
      const filteredVendors = mockVendors.filter(vendor => 
        vendor.name.toLowerCase().includes(query.toLowerCase()) ||
        vendor.crops.some(crop => 
          crop.name.toLowerCase().includes(query.toLowerCase()) ||
          crop.category.toLowerCase().includes(query.toLowerCase())
        )
      );
      
      setVendors(filteredVendors);
      setIsSearching(false);
      
      toast({
        title: "Search Complete",
        description: `Found ${filteredVendors.length} vendors with "${query}"`,
      });
    }, 800);
  }, [mockVendors, setVendors, toast]);

  const handleVendorSelect = useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowResults(false);
    
    if (map) {
      map.panTo({ lat: vendor.location.lat, lng: vendor.location.lng });
      map.setZoom(15);
      
      // Add info window for selected vendor
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold;">${vendor.name}</h3>
            <p style="margin: 0; color: #666; font-size: 12px;">Rating: ${vendor.rating} ⭐ • ${vendor.distance}km away</p>
            <p style="margin: 4px 0 0 0; font-size: 12px;">${vendor.crops.length} products available</p>
          </div>
        `
      });
      
      infoWindow.open(map, new google.maps.Marker({
        position: { lat: vendor.location.lat, lng: vendor.location.lng },
        map: map
      }));
    }
  }, [map]);

  const handleCloseVendor = useCallback(() => {
    setSelectedVendor(null);
    
    // Reset map zoom when closing vendor details
    if (map) {
      map.setZoom(13);
    }
  }, [map]);

  const handleViewVendorDetails = useCallback((vendor: Vendor) => {
    // Navigate to vendor details page or show detailed view
    console.log('View vendor details:', vendor);
    toast({
      title: "Vendor Details",
      description: `Viewing details for ${vendor.name}`,
    });
  }, [toast]);

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
