
import React from 'react';

interface MapContainerProps {
  mapContainer: React.RefObject<HTMLDivElement>;
}

const MapContainer: React.FC<MapContainerProps> = ({ mapContainer }) => {
  return (
    <div 
      ref={mapContainer} 
      className="absolute inset-0 w-full h-full bg-green-50" 
      style={{ minHeight: '100vh' }}
    />
  );
};

export default MapContainer;
