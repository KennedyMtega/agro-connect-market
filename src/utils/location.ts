// Tanzania location utilities

export interface TzLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  region: string;
}

// Major Tanzania cities with coordinates
export const TZ_CITIES = {
  'dar-es-salaam': { lat: -6.7924, lng: 39.2083, name: 'Dar es Salaam' },
  'dodoma': { lat: -6.1630, lng: 35.7516, name: 'Dodoma' },
  'mwanza': { lat: -2.5164, lng: 32.9175, name: 'Mwanza' },
  'arusha': { lat: -3.3869, lng: 36.6830, name: 'Arusha' },
  'mbeya': { lat: -8.9094, lng: 33.4607, name: 'Mbeya' },
  'morogoro': { lat: -6.8235, lng: 37.6606, name: 'Morogoro' },
  'tanga': { lat: -5.0693, lng: 39.0993, name: 'Tanga' },
  'iringa': { lat: -7.7669, lng: 35.6975, name: 'Iringa' },
  'mtwara': { lat: -10.2692, lng: 40.1806, name: 'Mtwara' },
  'tabora': { lat: -5.0167, lng: 32.8000, name: 'Tabora' },
} as const;

// Tanzania regions
export const TZ_REGIONS = [
  'Arusha', 'Dar es Salaam', 'Dodoma', 'Geita', 'Iringa', 'Kagera',
  'Katavi', 'Kigoma', 'Kilimanjaro', 'Lindi', 'Manyara', 'Mara',
  'Mbeya', 'Morogoro', 'Mtwara', 'Mwanza', 'Njombe', 'Pemba North',
  'Pemba South', 'Pwani', 'Rukwa', 'Ruvuma', 'Shinyanga', 'Simiyu',
  'Singida', 'Songwe', 'Tabora', 'Tanga', 'Unguja North', 'Unguja South'
] as const;

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    // Use Google Maps Geocoding API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
  }
  
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

export const isWithinTanzania = (lat: number, lng: number): boolean => {
  // Tanzania's approximate boundaries
  const TZ_BOUNDS = {
    north: -0.99,
    south: -11.76,
    east: 40.43,
    west: 29.34,
  };
  
  return (
    lat <= TZ_BOUNDS.north &&
    lat >= TZ_BOUNDS.south &&
    lng <= TZ_BOUNDS.east &&
    lng >= TZ_BOUNDS.west
  );
};