
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Vendor } from '@/types/map';

interface MapMarkersProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  vendors: Vendor[];
  onSelectVendor: (vendor: Vendor) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ map, vendors, onSelectVendor }) => {
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  useEffect(() => {
    if (!map.current || vendors.length === 0) return;
    
    console.log('Adding vendor markers', vendors.length);
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add vendor markers
    vendors.forEach(vendor => {
      const el = document.createElement('div');
      el.className = 'vendor-marker';
      el.innerHTML = `<div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">${vendor.name.charAt(0)}</div>`;
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#10b981';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = 'white';
      el.style.fontWeight = 'bold';
      el.style.cursor = 'pointer';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([vendor.location.lng, vendor.location.lat])
        .addTo(map.current!);
      
      el.addEventListener('click', () => {
        onSelectVendor(vendor);
        
        // Fly to vendor
        map.current?.flyTo({
          center: [vendor.location.lng, vendor.location.lat],
          zoom: 15,
          essential: true
        });
      });
      
      markers.current.push(marker);
    });
    
    console.log('Added markers:', markers.current.length);
    
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, [map, vendors, onSelectVendor]);

  return null;
};

export default MapMarkers;
