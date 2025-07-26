
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Location {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isLiveLocation: boolean;
}

export const useDeliveryLocation = () => {
  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const { toast } = useToast();

  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({
        location: { lat: latitude, lng: longitude }
      });
      
      if (result.results && result.results.length > 0) {
        return result.results[0].formatted_address;
      }
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  const useCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setIsLoadingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Get the actual address using Google reverse geocoding
          const address = await reverseGeocode(latitude, longitude);
          
          setDeliveryLocation({
            address: address,
            coordinates: { latitude, longitude },
            isLiveLocation: true
          });
          
          toast({
            title: "Location Updated",
            description: "Using your current location for delivery.",
          });
        } catch (error) {
          console.error("Error getting address:", error);
          setDeliveryLocation({
            address: "Current Location (Tap to enter details)",
            coordinates: { latitude, longitude },
            isLiveLocation: true
          });
          
          toast({
            title: "Location Updated",
            description: "Using your current location for delivery.",
          });
        }
        
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Location Error",
          description: "Couldn't get your current location. Please enter manually.",
          variant: "destructive",
        });
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  return {
    deliveryLocation,
    setDeliveryLocation,
    isLoadingLocation,
    useCurrentLocation
  }
};

