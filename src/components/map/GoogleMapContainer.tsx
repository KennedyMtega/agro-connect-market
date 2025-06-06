
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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      try {
        console.log('Initializing Google Maps with API key:', GOOGLE_MAPS_API_KEY);
        
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();
        console.log('Google Maps API loaded successfully');

        const map = new google.maps.Map(mapRef.current, {
          center: DEFAULT_MAP_CENTER,
          zoom: DEFAULT_MAP_ZOOM,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "transit",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        mapInstanceRef.current = map;
        
        // Add a marker for the default center (user location)
        new google.maps.Marker({
          position: DEFAULT_MAP_CENTER,
          map: map,
          title: "Your Location",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#3b82f6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        if (onMapLoad) {
          onMapLoad(map);
        }

        setIsLoading(false);
        setError(null);
        
        console.log('Google Maps initialized successfully');
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setError('Failed to load Google Maps. Please check your API key and internet connection.');
        toast({
          title: "Map Loading Error",
          description: "Failed to load Google Maps. Please refresh the page and try again.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    initializeMap();
  }, [onMapLoad, toast]);

  if (error) {
    return (
      <div className={`relative w-full h-full ${className || ''}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-green-50">
          <div className="text-center p-8">
            <div className="text-red-600 text-lg font-semibold mb-2">Map Error</div>
            <div className="text-gray-600 text-sm">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full bg-green-50"
        style={{ minHeight: '100%' }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <div className="text-green-600 text-sm">Loading map...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapContainer;
