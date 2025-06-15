
import React, { useEffect, useRef } from 'react';
import { Vendor } from '@/types/map';

interface GoogleMapMarkersProps {
  map: google.maps.Map | null;
  vendors: Vendor[];
  onVendorSelect: (vendor: Vendor) => void;
}

const GoogleMapMarkers: React.FC<GoogleMapMarkersProps> = ({ map, vendors, onVendorSelect }) => {
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add vendor markers
    vendors.forEach(vendor => {
      const marker = new google.maps.Marker({
        position: { lat: vendor.location.lat, lng: vendor.location.lng },
        map: map,
        title: vendor.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#16a34a',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }
      });

      // Add click listener
      marker.addListener('click', () => {
        onVendorSelect(vendor);
        map.panTo({ lat: vendor.location.lat, lng: vendor.location.lng });
        map.setZoom(16);
      });

      markersRef.current.push(marker);
    });

    if (vendors.length > 0) {
      console.log(`Added ${vendors.length} vendor markers`);
    }

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [map, vendors, onVendorSelect]);

  return null;
};

export default GoogleMapMarkers;
