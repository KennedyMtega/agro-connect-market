import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation, Search } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY } from '@/constants/googleMaps';
import { useToast } from '@/hooks/use-toast';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  currentLocation?: { lat: number; lng: number; address: string };
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, currentLocation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  const [addressInput, setAddressInput] = useState(currentLocation?.address || '');
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    if (!mapRef.current) return;

    try {
      // Load Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = () => {
        const defaultCenter = currentLocation 
          ? { lat: currentLocation.lat, lng: currentLocation.lng }
          : { lat: -6.792354, lng: 39.208328 }; // Default to Dar es Salaam

        const map = new google.maps.Map(mapRef.current!, {
          center: defaultCenter,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
        });

        mapInstanceRef.current = map;

        // Add click listener to map
        map.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            updateMarkerPosition(lat, lng);
            reverseGeocode(lat, lng);
          }
        });

        // Initialize marker if current location exists
        if (currentLocation) {
          updateMarkerPosition(currentLocation.lat, currentLocation.lng);
        }
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Map Error",
        description: "Failed to load map. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateMarkerPosition = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Add new marker
    markerRef.current = new google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      draggable: true,
      title: 'Business Location'
    });

    // Add drag listener to marker
    markerRef.current.addListener('dragend', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        reverseGeocode(newLat, newLng);
      }
    });

    // Center map on marker
    mapInstanceRef.current.setCenter({ lat, lng });
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      
      if (response.results && response.results.length > 0) {
        const address = response.results[0].formatted_address;
        const location = { lat, lng, address };
        setSelectedLocation(location);
        setAddressInput(address);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      toast({
        title: "Location Error",
        description: "Failed to get address for this location.",
        variant: "destructive",
      });
    }
  };

  const searchAddress = async () => {
    if (!addressInput.trim()) {
      toast({
        title: "Enter Address",
        description: "Please enter an address to search.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ address: addressInput });
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        const lat = result.geometry.location.lat();
        const lng = result.geometry.location.lng();
        const address = result.formatted_address;
        
        updateMarkerPosition(lat, lng);
        setSelectedLocation({ lat, lng, address });
        setAddressInput(address);
        
        toast({
          title: "Address Found",
          description: "Location has been updated on the map.",
        });
      } else {
        toast({
          title: "Address Not Found",
          description: "Could not find the specified address. Please try a different one.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for the address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          updateMarkerPosition(lat, lng);
          reverseGeocode(lat, lng);
          setIsLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location Access Denied",
            description: "Please allow location access or click on the map to set your location.",
            variant: "destructive",
          });
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services. Please click on the map to set your location.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const confirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      toast({
        title: "Location Selected",
        description: "Business location has been set successfully.",
      });
    } else {
      toast({
        title: "No Location Selected",
        description: "Please select a location on the map first.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Set Business Location
        </CardTitle>
        <CardDescription>
          Enter an address or click on the map to set your business location
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Business Address</Label>
          <div className="flex gap-2">
            <Input
              id="address"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter business address..."
              onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
            />
            <Button 
              onClick={searchAddress} 
              disabled={isSearching}
              variant="outline"
              size="icon"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={getCurrentLocation} 
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            {isLoading ? "Getting Location..." : "Use Current Location"}
          </Button>
        </div>
        
        <div 
          ref={mapRef} 
          className="w-full h-[300px] border rounded-lg bg-gray-100"
        />
        
        {selectedLocation && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected Location:</p>
            <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
            <p className="text-xs text-muted-foreground">
              Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </p>
            <Button onClick={confirmLocation} className="w-full">
              Confirm Location
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationPicker;