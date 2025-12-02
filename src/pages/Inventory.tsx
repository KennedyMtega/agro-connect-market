import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSellerCrops } from "@/hooks/useSellerCrops";
import { supabase } from "@/integrations/supabase/client";
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
  PackageOpen,
} from "lucide-react";
import { formatTZS } from "@/utils/currency";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { crops, loading, addCrop, updateCrop, deleteCrop } = useSellerCrops();
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentCrop, setCurrentCrop] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('crop_categories')
        .select('*')
        .order('name');
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (category: string) => {
    setFilterCategory(category);
  };

  // Fuzzy search function to handle typos and similar words
  const fuzzyMatch = (text: string, searchTerm: string): boolean => {
    if (!searchTerm.trim()) return true;
    
    const textLower = text.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    // Exact match
    if (textLower.includes(searchLower)) return true;
    
    // Remove common typos and variations
    const cleanText = textLower.replace(/[^a-z0-9\s]/g, '');
    const cleanSearch = searchLower.replace(/[^a-z0-9\s]/g, '');
    
    // Check if search term is contained after cleaning
    if (cleanText.includes(cleanSearch)) return true;
    
    // Check for character similarity (simple Levenshtein-like approach)
    const words = cleanText.split(' ');
    const searchWords = cleanSearch.split(' ');
    
    for (const searchWord of searchWords) {
      for (const word of words) {
        // Check if words are similar (allow 1-2 character differences)
        if (areSimilar(word, searchWord)) return true;
      }
    }
    
    return false;
  };

  // Simple similarity check for typos
  const areSimilar = (word1: string, word2: string): boolean => {
    if (Math.abs(word1.length - word2.length) > 2) return false;
    
    const minLength = Math.min(word1.length, word2.length);
    if (minLength < 3) return word1 === word2;
    
    let differences = 0;
    const maxLen = Math.max(word1.length, word2.length);
    
    for (let i = 0; i < maxLen; i++) {
      if (word1[i] !== word2[i]) differences++;
      if (differences > 2) return false;
    }
    
    return differences <= 2;
  };

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch = fuzzyMatch(crop.name, searchTerm) ||
                         (crop.description && fuzzyMatch(crop.description, searchTerm));
    const matchesCategory = filterCategory === "all" || crop.category_id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || "Unknown";
  };

  const handleAddCrop = () => {
    setCurrentCrop({
      name: "",
      description: "",
      price_per_unit: 0,
      unit: "kg",
      quantity_available: 0,
      category_id: "",
      is_organic: false,
      is_featured: false,
      is_active: true,
      images: []
    });
    setIsEditMode(false);
    setShowAddEditModal(true);
  };

  const handleEditCrop = (crop: any) => {
    setCurrentCrop(crop);
    setIsEditMode(true);
    setShowAddEditModal(true);
  };

  const handleDeleteCrop = async (cropId: string) => {
    await deleteCrop(cropId);
  };

  const handleSaveCrop = async () => {
    if (!currentCrop || !currentCrop.name) return;

    setSaving(true);
    try {
      if (isEditMode && currentCrop.id) {
        await updateCrop(currentCrop.id, currentCrop);
      } else {
        await addCrop(currentCrop);
      }
      
      setShowAddEditModal(false);
      setCurrentCrop(null);
    } finally {
      setSaving(false);
    }
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
    <Layout hideFooter>
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
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
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
                  {loading ? (
                    // Skeleton loading rows
                    [...Array(4)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredCrops.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        <PackageOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        {searchTerm || filterCategory !== "all" ? (
                          <>
                            <p className="text-lg font-medium">No matching crops</p>
                            <p className="text-sm mt-1">Try adjusting your search or filter</p>
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => { setSearchTerm(""); setFilterCategory("all"); }}
                            >
                              Clear Filters
                            </Button>
                          </>
                        ) : (
                          <>
                            <p className="text-lg font-medium">Your inventory is empty</p>
                            <p className="text-sm mt-1">Add your first crop to start selling on the marketplace</p>
                            <Button className="mt-4" onClick={handleAddCrop}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Your First Crop
                            </Button>
                          </>
                        )}
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
                                {crop.is_featured && (
                                  <Star className="h-4 w-4 ml-1 text-amber-500 fill-amber-500" />
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {crop.description || "No description"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getCategoryName(crop.category_id)}</TableCell>
                        <TableCell>
                          {formatTZS(crop.price_per_unit)}/{crop.unit}
                        </TableCell>
                        <TableCell>
                          {crop.quantity_available} {crop.unit}
                        </TableCell>
                        <TableCell>
                          {getStockStatusBadge(crop.quantity_available)}
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
                              <DropdownMenuItem onClick={() => updateCrop(crop.id, { is_featured: !crop.is_featured })}>
                                {crop.is_featured ? (
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={currentCrop?.category_id || ""}
                    onValueChange={(value) =>
                      setCurrentCrop({ ...currentCrop, category_id: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per {currentCrop?.unit || 'unit'}</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={currentCrop?.price_per_unit || ""}
                    onChange={(e) =>
                      setCurrentCrop({
                        ...currentCrop,
                        price_per_unit: parseFloat(e.target.value) || 0,
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
                    value={currentCrop?.quantity_available || ""}
                    onChange={(e) =>
                      setCurrentCrop({
                        ...currentCrop,
                        quantity_available: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="organic"
                    checked={currentCrop?.is_organic || false}
                    onCheckedChange={(checked) =>
                      setCurrentCrop({ ...currentCrop, is_organic: checked })
                    }
                  />
                  <Label htmlFor="organic">Organic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={currentCrop?.is_featured || false}
                    onCheckedChange={(checked) =>
                      setCurrentCrop({ ...currentCrop, is_featured: checked })
                    }
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCrop} disabled={saving}>
                {saving ? "Saving..." : (isEditMode ? "Update Crop" : "Add Crop")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
};

export default Inventory;
