
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import VendorList from './VendorList';
import VendorDetail from './VendorDetail';
import OrderConfirmation from './OrderConfirmation';
import TokenInput from './TokenInput';
import { Vendor, ViewState } from '@/types/map';
import { useMapVendors } from '@/hooks/useMapVendors';
import MapContainer from './MapContainer';

// Default position (New York City for demo purposes)
const DEFAULT_POSITION = {
  lat: 40.712776,
  lng: -74.005974
};

const MapView: React.FC<{ className?: string }> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [viewState, setViewState] = useState<ViewState>(ViewState.INITIAL);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const { vendors, setVendors } = useMapVendors();
  const { toast } = useToast();
  const [accessToken, setAccessToken] = useState<string>('pk.eyJ1IjoiZWFseW5lIiwiYSI6ImNscWEydHR2dDB5Y3cycW56aG5sdWttdGsifQ.r9_zV2dYeOpm22LK5YwTuw');
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Initialize map when component mounts
  useEffect(() => {
    if (map.current) return; // Prevent re-initialization
    if (!mapContainer.current) return;

    try {
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

      // Debug
      console.log('Map initialized successfully', map.current);
      
      // Add event listener to check when map is loaded
      map.current.on('load', () => {
        console.log('Map loaded event fired');
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        console.log('Removing map');
        map.current.remove();
        map.current = null;
      }
    };
  }, [accessToken]);

  // Handle search
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setViewState(ViewState.SEARCHING);
    setIsSearching(true);
    
    // Simulate search
    setTimeout(() => {
      const mockVendors = useMapVendors().mockVendors;
      setVendors(mockVendors);
      setIsSearching(false);
      setViewState(ViewState.VENDOR_LIST);
      
      // Add vendor markers to map
      addVendorMarkers(mockVendors);
      
      toast({
        title: "Search Complete",
        description: `Found ${mockVendors.length} vendors for "${searchTerm}"`,
      });
    }, 2000);
  };

  // Handle adding vendor markers to map
  const addVendorMarkers = (vendors: Vendor[]) => {
    if (!map.current) {
      console.error('Map not initialized when adding markers');
      return;
    }
    
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
        .addTo(map.current);
      
      el.addEventListener('click', () => {
        setSelectedVendor(vendor);
        setViewState(ViewState.VENDOR_DETAIL);
        
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
  };

  // Handle purchase
  const handlePurchase = () => {
    if (!selectedVendor || !selectedCrop) return;
    
    const crop = selectedVendor.crops.find(c => c.id === selectedCrop);
    if (!crop) return;
    
    toast({
      title: "Order Placed!",
      description: `${quantity} ${crop.unit} of ${crop.name} from ${selectedVendor.name}`,
    });
    
    setViewState(ViewState.CONFIRMATION);
    
    // Simulate route drawing
    if (map.current) {
      // In a real application, you would use the Mapbox Directions API to draw the route
      // Draw route
      drawRoute(selectedVendor);
    }
  };

  // Draw route between user and vendor
  const drawRoute = (vendor: Vendor) => {
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
  };

  // Handle message send
  const handleSendMessage = () => {
    if (!message.trim() || !selectedVendor) return;
    
    toast({
      title: "Message Sent",
      description: `Message to ${selectedVendor.name}: ${message}`
    });
    
    setMessage("");
    setIsMessageOpen(false);
  };

  // Reset search
  const resetSearch = () => {
    setViewState(ViewState.INITIAL);
    setSearchTerm("");
    setSelectedVendor(null);
    setSelectedCrop("");
    setQuantity(1);
    
    // Clear markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Reset map
    if (map.current) {
      map.current.flyTo({
        center: [DEFAULT_POSITION.lng, DEFAULT_POSITION.lat],
        zoom: 13,
        essential: true
      });
      
      // Remove route layer if exists
      if (map.current.getLayer('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }
    }
  };

  // Render based on current view state
  const renderContent = () => {
    switch (viewState) {
      case ViewState.INITIAL:
        return (
          <>
            {/* Token input for testing */}
            <TokenInput 
              accessToken={accessToken} 
              setAccessToken={setAccessToken} 
              map={map} 
              mapContainer={mapContainer}
              defaultPosition={DEFAULT_POSITION}
            />
            
            {/* Search UI */}
            <div className="absolute top-16 left-2 right-2 z-10">
              <div className="w-full bg-background rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2">Find Crops Near You</h3>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search for crops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                  />
                  <Button type="submit">
                    Search
                  </Button>
                </form>
              </div>
            </div>
          </>
        );
      
      case ViewState.SEARCHING:
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <div className="bg-background rounded-lg p-6 shadow-lg flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Finding Crops</h3>
              <p className="text-muted-foreground">Searching for "{searchTerm}" near you...</p>
            </div>
          </div>
        );
      
      case ViewState.VENDOR_LIST:
        return (
          <VendorList 
            vendors={vendors} 
            searchTerm={searchTerm}
            onSelectVendor={(vendor) => {
              setSelectedVendor(vendor);
              setViewState(ViewState.VENDOR_DETAIL);
              
              // Fly to vendor
              map.current?.flyTo({
                center: [vendor.location.lng, vendor.location.lat],
                zoom: 15,
                essential: true
              });
            }}
            onReset={resetSearch}
          />
        );
      
      case ViewState.VENDOR_DETAIL:
        return selectedVendor ? (
          <VendorDetail
            vendor={selectedVendor}
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
            quantity={quantity}
            setQuantity={setQuantity}
            onBack={() => setViewState(ViewState.VENDOR_LIST)}
            onPurchase={handlePurchase}
            isMessageOpen={isMessageOpen}
            setIsMessageOpen={setIsMessageOpen}
            message={message}
            setMessage={setMessage}
            onSendMessage={handleSendMessage}
            onNavigate={() => {
              // Navigate to vendor
              map.current?.flyTo({
                center: [selectedVendor.location.lng, selectedVendor.location.lat],
                zoom: 16,
                essential: true
              });
            }}
          />
        ) : null;
      
      case ViewState.CONFIRMATION:
        return selectedVendor ? (
          <OrderConfirmation 
            vendor={selectedVendor}
            onReset={resetSearch}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-lg ${className}`}>
      {/* Map container */}
      <MapContainer mapContainer={mapContainer} />
      
      {/* UI Overlays */}
      {renderContent()}
    </div>
  );
};

export default MapView;
