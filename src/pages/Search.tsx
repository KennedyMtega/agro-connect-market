
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search as SearchIcon,
  Filter,
  SlidersHorizontal,
  MapPin,
  Clock,
  Star,
  ShoppingCart
} from "lucide-react";
import Layout from "@/components/layout/Layout";

// Mock data for crops
const mockCrops = [
  {
    id: "crop-1",
    name: "Organic Rice",
    category: "Grain",
    description: "Premium quality organic rice, freshly harvested.",
    price: 35.99,
    unit: "50kg",
    sellerName: "Green Farms Inc.",
    location: "Springfield, IL",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1584341534864-4bdb2eee6f4f?auto=format&fit=crop&q=80"
  },
  {
    id: "crop-2",
    name: "Fresh Tomatoes",
    category: "Vegetable",
    description: "Juicy, vine-ripened tomatoes picked at peak freshness.",
    price: 2.99,
    unit: "kg",
    sellerName: "Sunny Valley Produce",
    location: "Centerville, OH",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaad187?auto=format&fit=crop&q=80"
  },
  {
    id: "crop-3",
    name: "Sweet Corn",
    category: "Vegetable",
    description: "Non-GMO sweet corn, perfect for grilling or boiling.",
    price: 0.75,
    unit: "ear",
    sellerName: "Harvest Moon Farms",
    location: "Riverside, CA",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80"
  },
  {
    id: "crop-4",
    name: "Soybeans",
    category: "Legume",
    description: "High-protein soybeans for processing or direct consumption.",
    price: 28.50,
    unit: "25kg",
    sellerName: "Heartland Crops",
    location: "Des Moines, IA",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1599422314077-f4dfdaa4cd09?auto=format&fit=crop&q=80"
  },
  {
    id: "crop-5",
    name: "Russet Potatoes",
    category: "Vegetable",
    description: "Versatile cooking potatoes, perfect for baking or mashing.",
    price: 1.25,
    unit: "kg",
    sellerName: "Idaho Spuds",
    location: "Boise, ID",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&q=80"
  },
  {
    id: "crop-6",
    name: "Honeycrisp Apples",
    category: "Fruit",
    description: "Sweet and crisp apples, ideal for snacking or baking.",
    price: 3.99,
    unit: "kg",
    sellerName: "Orchard Valley",
    location: "Wenatchee, WA",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1570913149827-d2f74f0301fa?auto=format&fit=crop&q=80"
  }
];

const CropCard = ({ crop }: { crop: any }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={crop.image} 
          alt={crop.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{crop.name}</CardTitle>
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm">{crop.rating}</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{crop.category}</span>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">{crop.description}</p>
        <div className="mt-3 flex items-center text-muted-foreground text-xs">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{crop.location}</span>
        </div>
        <div className="mt-1 flex items-center text-muted-foreground text-xs">
          <Clock className="h-3 w-3 mr-1" />
          <span>Same day delivery available</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        <div>
          <p className="font-bold text-lg">${crop.price.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">per {crop.unit}</p>
        </div>
        <Button size="sm" className="ml-auto">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

const FilterSidebar = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
  const [priceRange, setPriceRange] = useState([0, 100]);

  return (
    <div className={`lg:block ${isVisible ? 'block' : 'hidden'} lg:w-64 w-full h-full`}>
      <div className="p-4 bg-card rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Filters</h3>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onClose}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <Label htmlFor="category">Category</Label>
          <Select defaultValue="all">
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="grain">Grains</SelectItem>
              <SelectItem value="vegetable">Vegetables</SelectItem>
              <SelectItem value="fruit">Fruits</SelectItem>
              <SelectItem value="legume">Legumes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <Label>Price Range</Label>
          <div className="mt-2">
            <Slider
              defaultValue={[0, 100]}
              max={100}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-2"
            />
            <div className="flex justify-between">
              <span className="text-sm">${priceRange[0]}</span>
              <span className="text-sm">${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Location Filter */}
        <div className="mb-6">
          <Label htmlFor="location">Location</Label>
          <Select defaultValue="all">
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="nearby">Within 25 miles</SelectItem>
              <SelectItem value="50miles">Within 50 miles</SelectItem>
              <SelectItem value="100miles">Within 100 miles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Seller Rating Filter */}
        <div className="mb-6">
          <Label htmlFor="rating">Minimum Seller Rating</Label>
          <Select defaultValue="all">
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select minimum rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Rating</SelectItem>
              <SelectItem value="3">3 Stars & Above</SelectItem>
              <SelectItem value="4">4 Stars & Above</SelectItem>
              <SelectItem value="4.5">4.5 Stars & Above</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full">Apply Filters</Button>
      </div>
    </div>
  );
};

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an API call
    console.log("Searching for:", searchTerm);
  };

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Find Agricultural Products</h1>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for crops, products, or sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
          <Button type="button" variant="outline" className="lg:hidden" onClick={toggleFilter}>
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </form>

        <div className="flex flex-col lg:flex-row gap-6">
          <FilterSidebar isVisible={isFilterVisible} onClose={toggleFilter} />

          <div className="flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCrops.map((crop) => (
                <CropCard key={crop.id} crop={crop} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
