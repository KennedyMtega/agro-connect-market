
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
  // Skip token input UI since we're using a default token
  return null;
};

export default TokenInput;
