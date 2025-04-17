
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crop } from "@/types";
import { MapPin, Star, ShoppingCart } from "lucide-react";

interface CropCardProps {
  crop: Crop;
  showAddToCart?: boolean;
  onAddToCart?: () => void;
}

const CropCard = ({ crop, showAddToCart = true, onAddToCart }: CropCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        {crop.images && crop.images.length > 0 ? (
          <img 
            src={crop.images[0]} 
            alt={crop.name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            No image available
          </div>
        )}
        {crop.isFeatured && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <Link to={`/crop/${crop.id}`}>
          <CardTitle className="text-lg hover:text-primary transition-colors">
            {crop.name}
          </CardTitle>
        </Link>
        <span className="text-xs text-muted-foreground">{crop.category}</span>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {crop.description || "No description available"}
        </p>
        
        <div className="mt-3 space-y-1">
          <div className="flex items-center text-muted-foreground text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            <span>Location info would be displayed here</span>
          </div>
          
          <div className="flex items-center">
            <span className="text-xs text-muted-foreground">Available:</span>
            <span className="ml-1 text-xs font-medium">
              {crop.quantityAvailable} {crop.unit}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between items-center">
        <div>
          <p className="font-bold text-lg">${crop.pricePerUnit.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">per {crop.unit}</p>
        </div>
        
        {showAddToCart && (
          <Button size="sm" onClick={onAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CropCard;
