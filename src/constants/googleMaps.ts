// Google Maps configuration constants
export const DEFAULT_MAP_CENTER = {
  lat: -6.792354,
  lng: 39.208328
};

export const DEFAULT_MAP_ZOOM = 12;

export const MAP_STYLES = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }
];

// API key moved to secure Supabase edge function
// Frontend components should use the secure geocoding API instead of direct Google Maps API calls
export const GOOGLE_MAPS_API_KEY = ""; // Removed for security - use edge function instead
