
import React from 'react';

interface MapContainerProps {
  mapContainer: React.RefObject<HTMLDivElement>;
}

const MapContainer: React.FC<MapContainerProps> = ({ mapContainer }) => {
  return <div ref={mapContainer} className="absolute inset-0" />;
};

export default MapContainer;
