
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  // Using a predefined token - skip token input UI
  React.useEffect(() => {
    // Use the provided token automatically
    const mapboxToken = "pk.eyJ1Ijoia2VubnltdGVnYTEwMSIsImEiOiJjbTlzZnB4bWUwMDY5MmtzYjBrdmt0enF1In0.jbvpg1jOdiljzGc2CQJPZg";
    setAccessToken(mapboxToken);
  }, [setAccessToken]);
  
  return null; // No UI needed since we're using a predefined token
};

export default TokenInput;
