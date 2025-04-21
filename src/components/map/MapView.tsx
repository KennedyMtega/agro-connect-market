
import React from 'react';
import MapContainer from './MapContainer';
import MapControl from './MapControl';
import MapMarkers from './MapMarkers';
import MapRoute from './MapRoute';
import MapViewContent from './MapViewContent';
import { useMapViewState } from './useMapViewState';
import { ViewState } from '@/types/map';

const MapView: React.FC<{ className?: string }> = ({ className }) => {
  const state = useMapViewState();

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-lg ${className ?? ''}`}>
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
      {/* Add route when confirmation is shown */}
      {state.viewState === ViewState.CONFIRMATION && state.selectedVendor && (
        <MapRoute map={state.map} vendor={state.selectedVendor} />
      )}
      {/* UI Overlays */}
      <MapViewContent
        viewState={state.viewState}
        searchTerm={state.searchTerm}
        setSearchTerm={state.setSearchTerm}
        handleSearch={state.handleSearch}
        isSearching={state.isSearching}
        vendors={state.vendors}
        onSelectVendor={state.handleSelectVendor}
        resetSearch={state.resetSearch}
        selectedVendor={state.selectedVendor}
        selectedCrop={state.selectedCrop}
        setSelectedCrop={state.setSelectedCrop}
        quantity={state.quantity}
        setQuantity={state.setQuantity}
        onPurchase={state.handlePurchase}
        isMessageOpen={state.isMessageOpen}
        setIsMessageOpen={state.setIsMessageOpen}
        message={state.message}
        setMessage={state.setMessage}
        onSendMessage={state.handleSendMessage}
        accessToken={state.accessToken}
        setAccessToken={state.setAccessToken}
        map={state.map}
        mapContainer={state.mapContainer}
      />
    </div>
  );
};

export default MapView;
