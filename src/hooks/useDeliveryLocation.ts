
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
      (position) => {
        const { latitude, longitude } = position.coords;
        setDeliveryLocation({
          address: "Current Location (Tap to enter details)",
          coordinates: { latitude, longitude },
          isLiveLocation: true
        });
        toast({
          title: "Location Updated",
          description: "Using your current location for delivery.",
        });
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

