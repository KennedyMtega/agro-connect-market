import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search as SearchIcon,
  Filter,
  SlidersHorizontal,
  MapPin,
  Clock,
  Truck,
  Star,
  ShoppingCart,
  X,
  Loader2
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import MapView from "@/components/map/MapView";

// Mock crop types
const cropTypes = [
  { id: 'grain', name: 'Grains', icon: '🌾', description: 'Rice, wheat, corn, barley, millet' },
  { id: 'vegetable', name: 'Vegetables', icon: '🥦', description: 'Tomatoes, potatoes, onions, carrots' },
  { id: 'fruit', name: 'Fruits', icon: '🍎', description: 'Apples, oranges, bananas, grapes' },
  { id: 'legume', name: 'Legumes', icon: '🥜', description: 'Beans, lentils, peanuts, chickpeas' },
  { id: 'tuber', name: 'Tubers', icon: '🥔', description: 'Potatoes, sweet potatoes, cassava, yams' },
  { id: 'herb', name: 'Herbs & Spices', icon: '🌿', description: 'Basil, mint, pepper, cinnamon' },
];

// Mock data for sellers with crops
const mockSellers = [
  {
    id: "seller-1",
    name: "Green Valley Farms",
    rating: 4.8,
    distance: 2.3,
    location: "Springfield, IL",
    crops: [
      { id: "crop-1", name: "Organic Rice", category: "Grain", pricePerUnit: 35.99, unit: "kg", quantityAvailable: 500 },
      { id: "crop-2", name: "Fresh Tomatoes", category: "Vegetable", pricePerUnit: 2.99, unit: "kg", quantityAvailable: 100 }
    ],
    estimatedDelivery: "20-30 min",
    online: true
  },
  {
    id: "seller-2",
    name: "Sunshine Produce",
    rating: 4.5,
    distance: 3.1,
    location: "Centerville, OH",
    crops: [
      { id: "crop-3", name: "Sweet Corn", category: "Vegetable", pricePerUnit: 0.75, unit: "ear", quantityAvailable: 200 },
      { id: "crop-4", name: "Russet Potatoes", category: "Vegetable", pricePerUnit: 1.25, unit: "kg", quantityAvailable: 300 }
    ],
    estimatedDelivery: "30-45 min",
    online: true
  },
  {
    id: "seller-3",
    name: "Harvest Moon Organics",
    rating: 4.9,
    distance: 5.6,
    location: "Riverside, CA",
    crops: [
      { id: "crop-5", name: "Honey Crisp Apples", category: "Fruit", pricePerUnit: 3.99, unit: "kg", quantityAvailable: 75 },
      { id: "crop-6", name: "Red Lentils", category: "Legume", pricePerUnit: 4.50, unit: "kg", quantityAvailable: 150 }
    ],
    estimatedDelivery: "40-55 min",
    online: true
  }
];

const CropTypeCard = ({ cropType, onSelect }: { cropType: any, onSelect: (id: string) => void }) => {
  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-all" 
      onClick={() => onSelect(cropType.id)}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="text-4xl mb-2">{cropType.icon}</div>
        <h3 className="font-medium text-lg mb-1">{cropType.name}</h3>
        <p className="text-xs text-muted-foreground">{cropType.description}</p>
      </CardContent>
    </Card>
  );
};

const SellerCard = ({ seller, selectedCropType }: { seller: any, selectedCropType: string }) => {
  const { addToCart } = useCart();
  const [selectedCrop, setSelectedCrop] = useState(seller.crops[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const filteredCrops = selectedCropType 
    ? seller.crops.filter((crop: any) => crop.category.toLowerCase() === selectedCropType.toLowerCase())
    : seller.crops;
  
  if (filteredCrops.length === 0) return null;

  const handleAddToCart = () => {
    const crop = seller.crops.find((c: any) => c.id === selectedCrop);
    if (!crop) return;
    
    addToCart({...crop, sellerId: seller.id, sellerName: seller.name}, quantity);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              {seller.name}
              {seller.online && (
                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </CardTitle>
            <div className="flex items-center text-amber-500 mt-1">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm">{seller.rating}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{seller.distance} km away</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-end">
              <Clock className="h-3 w-3 mr-1" />
              <span>{seller.estimatedDelivery}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{seller.location}</span>
        </div>
        
        <div className="mt-4 space-y-3">
          <div>
            <Label htmlFor={`crop-${seller.id}`}>Select Crop</Label>
            <Select 
              value={selectedCrop} 
              onValueChange={setSelectedCrop}
            >
              <SelectTrigger id={`crop-${seller.id}`}>
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                {filteredCrops.map((crop: any) => (
                  <SelectItem key={crop.id} value={crop.id}>
                    {crop.name} - ${crop.pricePerUnit}/{crop.unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedCrop && (
            <div>
              <Label htmlFor={`quantity-${seller.id}`}>Quantity</Label>
              <div className="flex items-center gap-2 mt-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <span>-</span>
                </Button>
                <Input 
                  id={`quantity-${seller.id}`}
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
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          disabled={!selectedCrop}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

const Search = () => {
  const [selectedCropType, setSelectedCropType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("categories");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSelectCropType = (id: string) => {
    setSelectedCropType(id);
    setIsSearching(true);
    
    setTimeout(() => {
      setSearchResults(mockSellers);
      setIsSearching(false);
    }, 1500);
    
    toast({
      title: "Searching for Sellers",
      description: `Finding sellers with ${cropTypes.find(c => c.id === id)?.name.toLowerCase()} near you...`,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    setIsSearching(true);
    
    setTimeout(() => {
      setSearchResults(mockSellers);
      setIsSearching(false);
    }, 1500);
    
    toast({
      title: "Searching for Crops",
      description: `Finding "${searchTerm}" near you...`,
    });
  };

  const clearSearch = () => {
    setSelectedCropType("");
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <Layout>
      <div className="container py-6">
        <Tabs defaultValue="categories" value={viewMode} onValueChange={setViewMode} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for specific crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button type="submit">Search</Button>
            </form>
            
            {!selectedCropType && !searchResults.length && (
              <>
                <h2 className="text-2xl font-bold mb-4">What would you like to haul today?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {cropTypes.map((cropType) => (
                    <CropTypeCard
                      key={cropType.id}
                      cropType={cropType}
                      onSelect={handleSelectCropType}
                    />
                  ))}
                </div>
              </>
            )}
            
            {isSearching && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-medium">Finding the best sellers near you...</h3>
                <p className="text-muted-foreground">This won't take long</p>
              </div>
            )}
            
            {!isSearching && searchResults.length > 0 && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedCropType ? (
                        <>
                          {cropTypes.find(c => c.id === selectedCropType)?.name} Sellers
                        </>
                      ) : (
                        <>Search Results</>
                      )}
                    </h2>
                    <p className="text-muted-foreground">
                      {searchResults.length} sellers found near you
                    </p>
                  </div>
                  <Button variant="outline" onClick={clearSearch}>
                    Clear Search
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((seller) => (
                    <SellerCard 
                      key={seller.id} 
                      seller={seller}
                      selectedCropType={selectedCropType} 
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="map">
            <div className="bg-background rounded-lg min-h-[600px] flex flex-col">
              <MapView className="h-[600px]" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Search;
