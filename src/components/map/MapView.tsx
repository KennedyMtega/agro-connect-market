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

// Temporary access token input for demo purposes
// In production, this should be stored in environment variables
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2wxeHVhNmU5MGp0MDNqbXFtc3g4ZzE0aSJ9.8f_J1z0fVGQDGFiihU_fEg';

interface Vendor {
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

interface MapViewProps {
  className?: string;
}

enum ViewState {
  INITIAL,
  SEARCHING,
  VENDOR_LIST,
  VENDOR_DETAIL,
  CHECKOUT,
  CONFIRMATION
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
    if (!mapContainer.current) return;

    // Initialize map
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

    // Cleanup function
    return () => {
      map.current?.remove();
    };
  }, [accessToken]);

  // Handle adding vendor markers to map
  const addVendorMarkers = (vendors: Vendor[]) => {
    if (!map.current) return;
    
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
  };

  // Handle search
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setViewState(ViewState.SEARCHING);
    setIsSearching(true);
    
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

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-lg ${className}`}>
      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Access token input - Only for demo purposes */}
      {viewState === ViewState.INITIAL && (
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
            <Button size="sm" className="py-1" onClick={() => toast({ title: "Token Updated" })}>
              Set
            </Button>
          </div>
        </div>
      )}
      
      {/* Search UI */}
      {viewState === ViewState.INITIAL && (
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
      )}
      
      {/* Searching animation */}
      {viewState === ViewState.SEARCHING && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="bg-background rounded-lg p-6 shadow-lg flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Finding Crops</h3>
            <p className="text-muted-foreground">Searching for "{searchTerm}" near you...</p>
          </div>
        </div>
      )}
      
      {/* Vendor list */}
      {viewState === ViewState.VENDOR_LIST && (
        <div className="absolute bottom-4 left-2 right-2 z-10">
          <Card>
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Vendors with "{searchTerm}"</CardTitle>
                <p className="text-sm text-muted-foreground">{vendors.length} vendors found</p>
              </div>
              <Button variant="ghost" size="icon" onClick={resetSearch}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-2 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                {vendors.map((vendor) => (
                  <Card key={vendor.id} className="cursor-pointer hover:bg-accent transition-colors" onClick={() => {
                    setSelectedVendor(vendor);
                    setViewState(ViewState.VENDOR_DETAIL);
                    
                    // Fly to vendor
                    map.current?.flyTo({
                      center: [vendor.location.lng, vendor.location.lat],
                      zoom: 15,
                      essential: true
                    });
                  }}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium flex items-center">
                            {vendor.name}
                            {vendor.online && (
                              <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                            )}
                          </h3>
                          <div className="flex items-center text-amber-500 mt-1 text-sm">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="ml-1">{vendor.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">{vendor.distance} km away</div>
                          <div className="text-xs text-muted-foreground">
                            {vendor.estimatedDelivery}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Vendor detail */}
      {viewState === ViewState.VENDOR_DETAIL && selectedVendor && (
        <div className="absolute bottom-4 left-2 right-2 z-10">
          <Card>
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="mr-2" onClick={() => setViewState(ViewState.VENDOR_LIST)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-lg flex items-center">
                    {selectedVendor.name}
                    {selectedVendor.online && (
                      <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </CardTitle>
                  <div className="flex items-center">
                    <div className="flex items-center text-amber-500 mr-2">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="ml-1 text-xs">{selectedVendor.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {selectedVendor.distance} km • {selectedVendor.estimatedDelivery}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex">
                <Button variant="ghost" size="icon" className="mr-1" onClick={() => setIsMessageOpen(!isMessageOpen)}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => {
                  // Navigate to vendor
                  map.current?.flyTo({
                    center: [selectedVendor.location.lng, selectedVendor.location.lat],
                    zoom: 16,
                    essential: true
                  });
                }}>
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            {/* Message panel */}
            {isMessageOpen && (
              <div className="mx-4 mb-2 p-3 bg-muted rounded-md">
                <h4 className="text-sm font-medium mb-2">Message to Vendor</h4>
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="text-sm"
                  />
                  <Button size="sm" onClick={handleSendMessage}>Send</Button>
                </div>
              </div>
            )}
            
            <CardContent className="p-4 pt-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium" htmlFor="crop-select">
                    Select Crop
                  </label>
                  <select
                    id="crop-select"
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md bg-background"
                  >
                    <option value="">Select a crop</option>
                    {selectedVendor.crops.map((crop) => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name} - ${crop.pricePerUnit}/{crop.unit} ({crop.quantityAvailable} available)
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedCrop && (
                  <div>
                    <label className="text-sm font-medium" htmlFor="quantity">
                      Quantity
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <span>-</span>
                      </Button>
                      <Input 
                        id="quantity"
                        type="number" 
                        min="1" 
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="text-center"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <span>+</span>
                      </Button>
                    </div>
                  </div>
                )}
                
                {selectedCrop && (
                  <div className="bg-muted p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Order Summary</h4>
                    <div className="flex justify-between text-sm">
                      <span>Price:</span>
                      <span>
                        ${(
                          (selectedVendor.crops.find(c => c.id === selectedCrop)?.pricePerUnit || 0) * 
                          quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee:</span>
                      <span>$2.99</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t">
                      <span>Total:</span>
                      <span>
                        ${(
                          (selectedVendor.crops.find(c => c.id === selectedCrop)?.pricePerUnit || 0) * 
                          quantity + 2.99
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                className="w-full" 
                onClick={handlePurchase}
                disabled={!selectedCrop}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Purchase Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Confirmation state */}
      {viewState === ViewState.CONFIRMATION && selectedVendor && (
        <div className="absolute bottom-4 left-2 right-2 z-10">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-1">Order Confirmed!</h3>
                <p className="text-muted-foreground mb-4">
                  Your order from {selectedVendor.name} is on its way.
                </p>
                <div className="w-full bg-muted p-3 rounded-md mb-4">
                  <h4 className="text-sm font-medium mb-2">Estimated Delivery Time</h4>
                  <p className="text-lg font-semibold">{selectedVendor.estimatedDelivery}</p>
                </div>
                <Button variant="outline" onClick={resetSearch} className="w-full">
                  Back to Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MapView;
