import { supabase } from "@/integrations/supabase/client";

export interface GeocodeResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface GeocodeResponse {
  status: string;
  results: GeocodeResult[];
  error?: string;
}

/**
 * Secure reverse geocoding using Supabase edge function
 * Converts coordinates to address without exposing API key
 */
export const secureReverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-geocode', {
      body: { lat, lng }
    });

    if (error) {
      console.error('Secure geocoding error:', error);
      return `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    const response = data as GeocodeResponse;
    
    if (response.status === 'OK' && response.results && response.results.length > 0) {
      return response.results[0].formatted_address;
    }
    
    return `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error('Secure reverse geocoding error:', error);
    return `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

/**
 * Secure forward geocoding using Supabase edge function
 * Converts address to coordinates without exposing API key
 */
export const secureForwardGeocode = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-geocode', {
      body: { address }
    });

    if (error) {
      console.error('Secure geocoding error:', error);
      return null;
    }

    const response = data as GeocodeResponse;
    
    if (response.status === 'OK' && response.results && response.results.length > 0) {
      const location = response.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    }
    
    return null;
  } catch (error) {
    console.error('Secure forward geocoding error:', error);
    return null;
  }
};