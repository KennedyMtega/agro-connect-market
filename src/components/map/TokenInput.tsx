
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
    toast({ title: "Token Updated" });
    // Force map reinitialization by unmounting and remounting
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    setTimeout(() => {
      if (mapContainer.current && !map.current) {
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
      }
    }, 100);
  };

  return (
    <div className="absolute top-2 left-2 right-2 z-10 bg-background/90 p-2 rounded-lg shadow-md text-xs">
      <p className="mb-1 text-muted-foreground">Demo: Enter your Mapbox access token or use default</p>
      <div className="flex gap-2">
        <Input
          type="text"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          className="text-xs py-1"
          placeholder="Enter Mapbox access token"
        />
        <Button size="sm" className="py-1" onClick={handleTokenUpdate}>
          Set
        </Button>
      </div>
    </div>
  );
};

export default TokenInput;
