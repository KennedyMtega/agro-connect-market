
// Google Maps configuration constants
export const DEFAULT_MAP_CENTER = {
  lat: 40.712776,
  lng: -74.005974
};

export const DEFAULT_MAP_ZOOM = 13;

export const MAP_STYLES = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }
];

// You'll need to get this from Google Cloud Console
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY";
