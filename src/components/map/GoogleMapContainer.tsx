
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, GOOGLE_MAPS_API_KEY } from '@/constants/googleMaps';
import { useToast } from '@/hooks/use-toast';

interface GoogleMapContainerProps {
  onMapLoad?: (map: google.maps.Map) => void;
  className?: string;
}

const GoogleMapContainer: React.FC<GoogleMapContainerProps> = ({ onMapLoad, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();

        const map = new google.maps.Map(mapRef.current, {
          center: DEFAULT_MAP_CENTER,
          zoom: DEFAULT_MAP_ZOOM,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        mapInstanceRef.current = map;
        
        if (onMapLoad) {
          onMapLoad(map);
        }

        setIsLoading(false);
        
        console.log('Google Maps initialized successfully');
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        toast({
          title: "Map Loading Error",
          description: "Failed to load Google Maps. Please check your API key.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    initializeMap();
  }, [onMapLoad, toast]);

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full bg-green-50"
        style={{ minHeight: '100vh' }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-50">
          <div className="text-green-600">Loading map...</div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapContainer;
