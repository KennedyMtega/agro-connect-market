import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { useMapVendors } from './useMapVendors';
import { useGlobalCropSearch } from './useGlobalCropSearch';
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
  const { searchResults, searchCrops, loading: searchLoading } = useGlobalCropSearch();
  const { toast } = useToast();

  // Convert search results to vendors for map display
  useEffect(() => {
    if (searchResults.crops.length > 0) {
      // Group crops by seller
      const sellerMap = new Map();
      
      searchResults.crops.forEach(crop => {
        const sellerId = crop.seller.id;
        if (!sellerMap.has(sellerId)) {
          sellerMap.set(sellerId, {
            id: sellerId,
            name: crop.seller.business_name,
            location: {
              lat: crop.location_lat,
              lng: crop.location_lng
            },
            distance: 1, // Default distance since we're searching globally
            rating: crop.seller.average_rating,
            crops: [],
            estimatedDelivery: "30-45 min",
            online: true
          });
        }
        
        const vendor = sellerMap.get(sellerId);
        vendor.crops.push({
          id: crop.id,
          name: crop.name,
          category: crop.category?.name || "General",
          pricePerUnit: crop.price_per_unit,
          unit: crop.unit,
          quantityAvailable: crop.quantity_available
        });
      });
      
      setVendors(Array.from(sellerMap.values()));
    }
  }, [searchResults, setVendors]);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    console.log('Map loaded successfully in state hook');
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setShowResults(false);
      setVendors([]);
      return;
    }

    setSearchQuery(query);
    setIsSearching(true);
    setShowResults(true);

    // Use the global crop search
    await searchCrops(query);
    setIsSearching(false);
  }, [searchCrops]);

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