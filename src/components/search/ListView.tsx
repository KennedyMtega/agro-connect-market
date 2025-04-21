
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, SearchIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CropTypeList from "./CropTypeList";
import SearchResults from "./SearchResults";

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

const ListView = () => {
  const [selectedCropType, setSelectedCropType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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
    <>
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
        <CropTypeList cropTypes={cropTypes} onSelect={handleSelectCropType} />
      )}
      
      {isSearching && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-medium">Finding the best sellers near you...</h3>
          <p className="text-muted-foreground">This won't take long</p>
        </div>
      )}
      
      {!isSearching && searchResults.length > 0 && (
        <SearchResults 
          results={searchResults} 
          selectedCropType={selectedCropType}
          cropTypes={cropTypes}
          onClear={clearSearch}
        />
      )}
    </>
  );
};

export default ListView;
