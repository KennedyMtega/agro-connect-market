
import React from 'react';

interface LoadingOverlayProps {
  searchTerm: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ searchTerm }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
      <div className="bg-background rounded-lg p-6 shadow-lg flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-semibold mb-2">Finding Crops</h3>
        <p className="text-muted-foreground">Searching for "{searchTerm}" near you...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
