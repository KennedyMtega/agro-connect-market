
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Search, 
  X, 
  ChevronLeft, 
  MessageCircle, 
  Navigation, 
  Star, 
  ShoppingCart,
  Truck
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import VendorList from './VendorList';
import VendorDetail from './VendorDetail';
import OrderConfirmation from './OrderConfirmation';

// Temporary access token input for demo purposes
// In production, this should be stored in environment variables
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2wxeHVhNmU5MGp0MDNqbXFtc3g4ZzE0aSJ9.8f_J1z0fVGQDGFiihU_fEg';

export interface Vendor {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  distance: number;
  rating: number;
  crops: Array<{
    id: string;
    name: string;
    category: string;
    pricePerUnit: number;
    unit: string;
    quantityAvailable: number;
  }>;
  estimatedDelivery: string;
  online: boolean;
}

// Mock vendors with geo locations
const mockVendors: Vendor[] = [
  {
    id: "vendor-1",
    name: "Green Valley Farms",
    location: {
      lat: 40.712776,
      lng: -74.005974
    },
    distance: 2.3,
    rating: 4.8,
    crops: [
      { id: "crop-1", name: "Organic Rice", category: "Grain", pricePerUnit: 35.99, unit: "kg", quantityAvailable: 500 },
      { id: "crop-2", name: "Fresh Tomatoes", category: "Vegetable", pricePerUnit: 2.99, unit: "kg", quantityAvailable: 100 }
    ],
    estimatedDelivery: "20-30 min",
    online: true
  },
  {
    id: "vendor-2",
    name: "Sunshine Produce",
    location: {
      lat: 40.722776,
      lng: -74.015974
    },
    distance: 3.1,
    rating: 4.5,
    crops: [
      { id: "crop-3", name: "Sweet Corn", category: "Vegetable", pricePerUnit: 0.75, unit: "ear", quantityAvailable: 200 },
      { id: "crop-4", name: "Russet Potatoes", category: "Vegetable", pricePerUnit: 1.25, unit: "kg", quantityAvailable: 300 }
    ],
    estimatedDelivery: "30-45 min",
    online: true
  },
  {
    id: "vendor-3",
    name: "Harvest Moon Organics",
    location: {
      lat: 40.702776,
      lng: -73.995974
    },
    distance: 5.6,
    rating: 4.9,
    crops: [
      { id: "crop-5", name: "Honey Crisp Apples", category: "Fruit", pricePerUnit: 3.99, unit: "kg", quantityAvailable: 75 },
      { id: "crop-6", name: "Red Lentils", category: "Legume", pricePerUnit: 4.50, unit: "kg", quantityAvailable: 150 }
    ],
    estimatedDelivery: "40-55 min",
    online: true
  }
];

export enum ViewState {
  INITIAL,
  SEARCHING,
  VENDOR_LIST,
  VENDOR_DETAIL,
  CHECKOUT,
  CONFIRMATION
}

interface MapViewProps {
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [viewState, setViewState] = useState<ViewState>(ViewState.INITIAL);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [accessToken, setAccessToken] = useState<string>(MAPBOX_ACCESS_TOKEN);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [message, setMessage] = useState("");

  // User's position (mock data for demo)
  const userPosition = {
    lat: 40.712776,
    lng: -74.005974
  };

  useEffect(() => {
    if (map.current) return; // Prevent re-initialization
    if (!mapContainer.current) return;

    // Initialize map
    try {
      mapboxgl.accessToken = accessToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [userPosition.lng, userPosition.lat],
        zoom: 13
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add user marker
      const userMarker = new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat([userPosition.lng, userPosition.lat])
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
      el.style.backgroundColor = '#3b82f6';
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

  // Handle search
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setViewState(ViewState.SEARCHING);
    setIsSearching(true);
    
    console.log('Searching for:', searchTerm);
    
    // Simulate search
    setTimeout(() => {
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
      // Here we're just simulating the visual effect
      const routeCoordinates = [
        [userPosition.lng, userPosition.lat],
        [selectedVendor.location.lng, selectedVendor.location.lat]
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
            'line-color': '#3b82f6',
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
        .extend([userPosition.lng, userPosition.lat])
        .extend([selectedVendor.location.lng, selectedVendor.location.lat]);
      
      map.current.fitBounds(bounds, {
        padding: 100
      });
    }
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
        center: [userPosition.lng, userPosition.lat],
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
            {/* Access token input - Only for demo purposes */}
            <div className="absolute top-2 left-2 right-2 z-10 bg-background/90 p-2 rounded-lg shadow-md text-xs">
              <p className="mb-1 text-muted-foreground">Demo: Enter your Mapbox access token or use default</p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="text-xs py-1"
                  placeholder="Enter Mapbox access token"
                />
                <Button size="sm" className="py-1" onClick={() => {
                  toast({ title: "Token Updated" });
                  // Force map reinitialization by unmounting and remounting
                  if (map.current) {
                    map.current.remove();
                    map.current = null;
                  }
                  setTimeout(() => {
                    if (mapContainer.current && !map.current) {
                      mapboxgl.accessToken = accessToken;
                      map.current = new mapboxgl.Map({
                        container: mapContainer.current,
                        style: 'mapbox://styles/mapbox/streets-v12',
                        center: [userPosition.lng, userPosition.lat],
                        zoom: 13
                      });
                    }
                  }, 100);
                }}>
                  Set
                </Button>
              </div>
            </div>
            
            {/* Search UI */}
            <div className="absolute top-16 left-2 right-2 z-10">
              <Card className="w-full">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg">Find Crops Near You</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search for crops..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button type="submit">
                      Search
                    </Button>
                  </form>
                </CardContent>
              </Card>
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
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* UI Overlays */}
      {renderContent()}
    </div>
  );
};

export default MapView;
