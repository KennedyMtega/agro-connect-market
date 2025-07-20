import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { useMapVendors } from './useMapVendors';
import { useSellers } from './useSellers';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/constants/googleMaps';
import { Vendor } from '@/types/map';

export const useGoogleMapState = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [detailedVendor, setDetailedVendor] = useState<Vendor | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { vendors, setVendors } = useMapVendors();
  const { sellers: realSellers, loading: sellersLoading } = useSellers();
  const { toast } = useToast();

  useEffect(() => {
    // Load real sellers when available
    if (realSellers.length > 0) {
      setVendors(realSellers.map(seller => ({
        id: seller.id,
        name: seller.business_name,
        location: seller.profile ? {
          lat: seller.profile.location_lat || -6.8235,
          lng: seller.profile.location_lng || 39.2790
        } : { lat: -6.8235, lng: 39.2790 },
        distance: seller.distance || 1,
        rating: seller.average_rating || 4.5,
        crops: seller.crops.map(crop => ({
          id: crop.id,
          name: crop.name,
          category: crop.category?.name || "General",
          pricePerUnit: crop.price_per_unit,
          unit: crop.unit,
          quantityAvailable: crop.quantity_available
        })),
        estimatedDelivery: seller.estimatedDelivery || "30-45 min",
        online: seller.online || true
      })));
    }
  }, [realSellers, setVendors]);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    console.log('Map loaded successfully in state hook');
  }, []);

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setShowResults(false);
      // Reset to all real sellers
      if (realSellers.length > 0) {
        setVendors(realSellers.map(seller => ({
          id: seller.id,
          name: seller.business_name,
          location: seller.profile ? {
            lat: seller.profile.location_lat || -6.8235,
            lng: seller.profile.location_lng || 39.2790
          } : { lat: -6.8235, lng: 39.2790 },
          distance: seller.distance || 1,
          rating: seller.average_rating || 4.5,
          crops: seller.crops.map(crop => ({
            id: crop.id,
            name: crop.name,
            category: crop.category?.name || "General",
            pricePerUnit: crop.price_per_unit,
            unit: crop.unit,
            quantityAvailable: crop.quantity_available
          })),
          estimatedDelivery: seller.estimatedDelivery || "30-45 min",
          online: seller.online || true
        })));
      }
      return;
    }

    setSearchQuery(query);
    setIsSearching(true);
    setShowResults(true);

    // Filter vendors based on query from real sellers
    setTimeout(() => {
      const filteredVendors = vendors.filter(vendor => 
        vendor.name.toLowerCase().includes(query.toLowerCase()) ||
        vendor.crops.some(crop => 
          crop.name.toLowerCase().includes(query.toLowerCase()) || 
          crop.category.toLowerCase().includes(query.toLowerCase())
        )
      );

      setVendors(filteredVendors);
      setShowResults(true);
      setIsSearching(false);
      
      toast({
        title: "Search Complete",
        description: `Found ${filteredVendors.length} sellers matching "${query}"`,
      });
    }, 800);
  }, [vendors, setVendors, toast, realSellers]);

  const handleVendorSelect = useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowResults(false);
    setDetailedVendor(null); // Close detail view if open
    
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
    
    // Reset map view when closing vendor details
    if (map) {
      map.panTo(DEFAULT_MAP_CENTER);
      map.setZoom(DEFAULT_MAP_ZOOM);
    }
  }, [map]);

  const handleViewVendorDetails = useCallback((vendor: Vendor) => {
    setDetailedVendor(vendor);
    setSelectedVendor(null); // Hide bottom card
  }, []);

  const handleCloseDetailedVendor = useCallback(() => {
    setDetailedVendor(null);
  }, []);

  return {
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
  };
};