
import React, { useEffect } from 'react';
import MapContainer from './MapContainer';
import MapControl from './MapControl';
import MapMarkers from './MapMarkers';
import MapRoute from './MapRoute';
import { useMapViewState } from './useMapViewState';
import { ViewState } from '@/types/map';
import { useToast } from "@/hooks/use-toast";

const MapView: React.FC<{ className?: string }> = ({ className }) => {
  const state = useMapViewState();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize map with default token
    if (!state.accessToken) {
      toast({
        title: "Using default Mapbox token",
        description: "Please ensure you have a valid Mapbox token for full functionality",
      });
    }
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className ?? ''}`}>
      <MapContainer mapContainer={state.mapContainer} />
      <MapControl 
        accessToken={state.accessToken}
        mapContainer={state.mapContainer}
        map={state.map}
      />
      
      {/* Add markers when vendors are available */}
      {state.vendors.length > 0 && (
        <MapMarkers 
          map={state.map}
          vendors={state.vendors}
          onSelectVendor={state.handleSelectVendor}
        />
      )}
      
      {/* Add route when a vendor is selected */}
      {state.selectedVendor && (
        <MapRoute 
          map={state.map} 
          vendor={state.selectedVendor} 
        />
      )}
    </div>
  );
};

export default MapView;
