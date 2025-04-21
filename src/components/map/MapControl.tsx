
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DEFAULT_POSITION } from '@/constants/map';

interface MapControlProps {
  accessToken: string;
  mapContainer: React.RefObject<HTMLDivElement>;
  map: React.MutableRefObject<mapboxgl.Map | null>;
  onMapLoaded?: () => void;
}

const MapControl: React.FC<MapControlProps> = ({ 
  accessToken, 
  mapContainer, 
  map, 
  onMapLoaded 
}) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!mapContainer.current || initialized.current || !accessToken) return;
    
    try {
      console.log('Initializing map with token:', accessToken);
      mapboxgl.accessToken = accessToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [DEFAULT_POSITION.lng, DEFAULT_POSITION.lat],
        zoom: 13
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add user marker
      new mapboxgl.Marker({ color: '#10b981' })
        .setLngLat([DEFAULT_POSITION.lng, DEFAULT_POSITION.lat])
        .addTo(map.current);

      // Set initialized flag
      initialized.current = true;
      
      // Debug
      console.log('Map initialized successfully');
      
      // Add event listener to check when map is loaded
      map.current.on('load', () => {
        console.log('Map loaded event fired');
        if (onMapLoaded) onMapLoaded();
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        console.log('Removing map');
        initialized.current = false;
        map.current.remove();
        map.current = null;
      }
    };
  }, [accessToken, mapContainer, map, onMapLoaded]);

  return null;
};

export default MapControl;
