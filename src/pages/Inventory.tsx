import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Crop } from "@/types";
import Layout from "@/components/layout/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Star,
  AlertTriangle,
  ArrowUpDown,
  Search,
  Filter,
  FileImage,
} from "lucide-react";

// Mock crop data
const mockCrops: Crop[] = [
  {
    id: "crop-1",
    sellerId: "seller-1",
    name: "Organic Rice",
    description: "Premium quality organic rice, freshly harvested.",
    category: "Grain",
    pricePerUnit: 35.99,
    unit: "50kg",
    quantityAvailable: 430,
    images: ["https://images.unsplash.com/photo-1584341534864-4bdb2eee6f4f?auto=format&fit=crop&q=80"],
    isFeatured: true,
    createdAt: new Date("2023-03-15"),
  },
  {
    id: "crop-2",
    sellerId: "seller-1",
    name: "Fresh Tomatoes",
    description: "Juicy, vine-ripened tomatoes picked at peak freshness.",
    category: "Vegetable",
    pricePerUnit: 2.99,
    unit: "kg",
    quantityAvailable: 75,
    images: ["https://images.unsplash.com/photo-1546094096-0df4bcaad187?auto=format&fit=crop&q=80"],
    isFeatured: false,
    createdAt: new Date("2023-03-20"),
  },
  {
    id: "crop-3",
    sellerId: "seller-1",
    name: "Sweet Corn",
    description: "Non-GMO sweet corn, perfect for grilling or boiling.",
    category: "Vegetable",
    pricePerUnit: 0.75,
    unit: "ear",
    quantityAvailable: 126,
    images: ["https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80"],
    isFeatured: false,
    createdAt: new Date("2023-03-22"),
  },
  {
    id: "crop-4",
    sellerId: "seller-1",
    name: "Soybeans",
    description: "High-protein soybeans for processing or direct consumption.",
    category: "Legume",
    pricePerUnit: 28.50,
    unit: "25kg",
    quantityAvailable: 750,
    images: ["https://images.unsplash.com/photo-1599422314077-f4dfdaa4cd09?auto=format&fit=crop&q=80"],
    isFeatured: true,
    createdAt: new Date("2023-03-25"),
  },
  {
    id: "crop-5",
    sellerId: "seller-1",
    name: "Russet Potatoes",
    description: "Versatile cooking potatoes, perfect for baking or mashing.",
    category: "Vegetable",
    pricePerUnit: 1.25,
    unit: "kg",
    quantityAvailable: 48,
    images: ["https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&q=80"],
    isFeatured: false,
    createdAt: new Date("2023-03-28"),
  }
];

const cropCategories = [
  "Grain",
  "Vegetable",
  "Fruit",
  "Legume",
  "Root",
  "Nut",
  "Seed",
  "Other"
];

const unitOptions = [
  "kg",
  "g",
  "lb",
  "oz",
  "ton",
  "piece",
  "bunch",
  "box",
  "crate",
  "dozen",
  "ear",
  "50kg",
  "25kg",
  "10kg"
];

const Inventory = () => {
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>(mockCrops);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentCrop, setCurrentCrop] = useState<Partial<Crop> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (category: string) => {
    setFilterCategory(category);
  };

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (crop.description && crop.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === "all" || crop.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddCrop = () => {
    setCurrentCrop({
      sellerId: user?.id || "",
      name: "",
      description: "",
      category: "",
      pricePerUnit: 0,
      unit: "kg",
      quantityAvailable: 0,
      images: [],
      isFeatured: false,
      createdAt: new Date()
    });
    setIsEditMode(false);
    setShowAddEditModal(true);
  };

  const handleEditCrop = (crop: Crop) => {
    setCurrentCrop(crop);
    setIsEditMode(true);
    setShowAddEditModal(true);
  };

  const handleDeleteCrop = (cropId: string) => {
    setCrops(crops.filter(crop => crop.id !== cropId));
  };

  const handleSaveCrop = () => {
    if (!currentCrop) return;

    if (isEditMode && currentCrop.id) {
      // Update existing crop
      setCrops(crops.map(crop => 
        crop.id === currentCrop.id ? { ...crop, ...currentCrop } as Crop : crop
      ));
    } else {
      // Add new crop
      const newCrop: Crop = {
        ...currentCrop as Crop,
        id: `crop-${Date.now()}`,
        createdAt: new Date()
      };
      setCrops([...crops, newCrop]);
    }
    
    setShowAddEditModal(false);
    setCurrentCrop(null);
  };

  const getStockStatusBadge = (quantity: number) => {
    if (quantity <= 0) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Out of Stock</span>;
    } else if (quantity < 50) {
      return <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">Low Stock</span>;
    } else {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">In Stock</span>;
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <Button onClick={handleAddCrop}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Crop
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Inventory Overview</CardTitle>
            <CardDescription>
              Manage your crop listings and inventory levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
              <Select value={filterCategory} onValueChange={handleCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {cropCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCrops.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No crops found. Add a new crop to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCrops.map((crop) => (
                      <TableRow key={crop.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded overflow-hidden mr-3 bg-muted flex-shrink-0">
                              {crop.images && crop.images.length > 0 ? (
                                <img src={crop.images[0]} alt={crop.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium flex items-center">
                                {crop.name}
                                {crop.isFeatured && (
                                  <Star className="h-4 w-4 ml-1 text-amber-500 fill-amber-500" />
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {crop.description || "No description"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{crop.category}</TableCell>
                        <TableCell>
                          ${crop.pricePerUnit.toFixed(2)}/{crop.unit}
                        </TableCell>
                        <TableCell>
                          {crop.quantityAvailable} {crop.unit}
                        </TableCell>
                        <TableCell>
                          {getStockStatusBadge(crop.quantityAvailable)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditCrop(crop)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteCrop(crop.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                {crop.isFeatured ? (
                                  <>
                                    <Star className="h-4 w-4 mr-2 fill-current" />
                                    Remove Feature
                                  </>
                                ) : (
                                  <>
                                    <Star className="h-4 w-4 mr-2" />
                                    Feature Crop
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showAddEditModal} onOpenChange={setShowAddEditModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Crop" : "Add New Crop"}</DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Update your crop information and inventory levels."
                  : "Enter the details of your crop to add it to your inventory."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Crop Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter crop name"
                    value={currentCrop?.name || ""}
                    onChange={(e) =>
                      setCurrentCrop({ ...currentCrop, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={currentCrop?.category || ""}
                    onValueChange={(value) =>
                      setCurrentCrop({ ...currentCrop, category: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter crop description"
                  value={currentCrop?.description || ""}
                  onChange={(e) =>
                    setCurrentCrop({ ...currentCrop, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={currentCrop?.pricePerUnit || ""}
                    onChange={(e) =>
                      setCurrentCrop({
                        ...currentCrop,
                        pricePerUnit: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={currentCrop?.unit || "kg"}
                    onValueChange={(value) =>
                      setCurrentCrop({ ...currentCrop, unit: value })
                    }
                  >
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity Available</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={currentCrop?.quantityAvailable || ""}
                    onChange={(e) =>
                      setCurrentCrop({
                        ...currentCrop,
                        quantityAvailable: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Images</Label>
                <div className="flex items-center">
                  <Button variant="outline" className="mr-2">
                    <FileImage className="h-4 w-4 mr-2" />
                    Upload Images
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentCrop?.images?.length
                      ? `${currentCrop.images.length} image(s) uploaded`
                      : "No images uploaded"}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="featured"
                  checked={currentCrop?.isFeatured || false}
                  onCheckedChange={(checked) =>
                    setCurrentCrop({ ...currentCrop, isFeatured: checked })
                  }
                />
                <Label htmlFor="featured">Feature this crop (premium visibility)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCrop}>Save Crop</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
};

export default Inventory;
