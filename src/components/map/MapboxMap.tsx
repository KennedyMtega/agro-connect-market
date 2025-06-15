
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2VubnltdGVnYTEwMSIsImEiOiJjbTlzZnB4bWUwMDY5MmtzYjBrdmt0enF1In0.jbvpg1jOdiljzGc2CQJPZg';

interface MapboxMapProps {
  longitude: number;
  latitude: number;
  zoom?: number;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ longitude, latitude, zoom = 13 }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: zoom,
      attributionControl: false
    });
    
    map.current.on('load', () => {
        // Add marker for the location
        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map.current!);
    });

    return () => map.current?.remove();
  }, [longitude, latitude, zoom]);

  return <div ref={mapContainer} className="h-full w-full" />;
};

export default MapboxMap;

