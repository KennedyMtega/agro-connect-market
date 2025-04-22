
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TokenInputProps {
  accessToken: string;
  setAccessToken: (token: string) => void;
  map: React.MutableRefObject<mapboxgl.Map | null>;
  mapContainer: React.RefObject<HTMLDivElement>;
  defaultPosition: { lat: number; lng: number };
}

const TokenInput: React.FC<TokenInputProps> = ({ 
  accessToken, 
  setAccessToken, 
  map, 
  mapContainer,
  defaultPosition 
}) => {
  const { toast } = useToast();

  const handleTokenUpdate = () => {
    toast({ title: "Map Token Updated", description: "Initializing map with new token" });
    
    // Force map reinitialization by unmounting and remounting
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    
    setTimeout(() => {
      if (mapContainer.current && !map.current) {
        try {
          mapboxgl.accessToken = accessToken;
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [defaultPosition.lng, defaultPosition.lat],
            zoom: 13
          });
          
          // Add navigation controls
          map.current.addControl(
            new mapboxgl.NavigationControl(),
            'top-right'
          );
          
          // Add user marker
          new mapboxgl.Marker({ color: '#10b981' })
            .setLngLat([defaultPosition.lng, defaultPosition.lat])
            .addTo(map.current);
            
          toast({ 
            title: "Map Initialized", 
            description: "Map has been successfully initialized with your token" 
          });
        } catch (error) {
          console.error('Error initializing map:', error);
          toast({ 
            title: "Map Error", 
            description: "Failed to initialize map with provided token", 
            variant: "destructive" 
          });
        }
      }
    }, 100);
  };

  return (
    <div className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-auto">
      <Card className="w-full md:min-w-[400px] shadow-xl">
        <CardHeader>
          <CardTitle>Map Initialization</CardTitle>
          <CardDescription>
            Please enter your Mapbox access token to view the map
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                To use the map feature, you need a valid Mapbox access token.
                You can use the default token or enter your own.
              </p>
              <Input
                type="text"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="font-mono text-xs"
                placeholder="Enter Mapbox access token"
              />
            </div>
            <Button onClick={handleTokenUpdate} className="w-full">
              Initialize Map
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenInput;
