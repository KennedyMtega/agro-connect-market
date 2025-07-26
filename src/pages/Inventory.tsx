import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSellerCrops } from "@/hooks/useSellerCrops";
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
import { formatTZS } from "@/utils/currency";

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
  const { crops, loading, addCrop, updateCrop, deleteCrop } = useSellerCrops();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentCrop, setCurrentCrop] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (category: string) => {
    setFilterCategory(category);
  };

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (crop.description && crop.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === "all" || crop.category_id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddCrop = () => {
    setCurrentCrop({
      name: "",
      description: "",
      price_per_unit: 0,
      unit: "kg",
      quantity_available: 0,
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading inventory...
                      </TableCell>
                    </TableRow>
                  ) : filteredCrops.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No crops found</p>
                        <p className="text-sm">Add crops to your inventory to start selling</p>
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
                        <TableCell>{crop.category_id || "Uncategorized"}</TableCell>
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
