
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Vendor } from '@/types/map';
import { DEFAULT_POSITION } from '@/constants/map';

interface MapRouteProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  vendor: Vendor;
}

const MapRoute: React.FC<MapRouteProps> = ({ map, vendor }) => {
  useEffect(() => {
    if (!map.current) return;
    
    const routeCoordinates = [
      [DEFAULT_POSITION.lng, DEFAULT_POSITION.lat],
      [vendor.location.lng, vendor.location.lat]
    ];
    
    if (map.current.getSource('route')) {
      (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates
        }
      });
    } else {
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates
          }
        }
      });
      
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#10b981',
          'line-width': 4,
          'line-dasharray': [0, 2]
        }
      });
      
      // Animate the line
      let step = 0;
      const animateDashArray = () => {
        if (!map.current) return;
        step = (step + 1) % 4;
        
        map.current.setPaintProperty('route', 'line-dasharray', [
          0,
          4 - step
        ]);
        
        requestAnimationFrame(animateDashArray);
      };
      
      animateDashArray();
    }
    
    // Fit bounds to include both user and vendor
    const bounds = new mapboxgl.LngLatBounds()
      .extend([DEFAULT_POSITION.lng, DEFAULT_POSITION.lat])
      .extend([vendor.location.lng, vendor.location.lat]);
    
    map.current.fitBounds(bounds, {
      padding: 100
    });
    
    return () => {
      if (map.current && map.current.getLayer('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }
    };
  }, [map, vendor]);

  return null;
};

export default MapRoute;
