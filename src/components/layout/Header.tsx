import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Search,
  ShoppingCart,
  Store,
  User,
  LogOut,
  Bell,
  ChevronDown,
  Truck,
  MapPin
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { NotificationDropdown } from "@/components/NotificationDropdown";

const Header = () => {
  const { user, profile, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isBuyer = profile?.user_type === "buyer";
  const isSeller = profile?.user_type === "seller";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 pt-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
                  <img 
                    src="/lovable-uploads/091e46ba-9e22-49fc-b392-d4786a34403a.png" 
                    alt="AgroConnect Logo" 
                    className="h-6 w-6 object-contain"
                  />
                  AgroConnect
                </Link>
                <div className="flex flex-col gap-2 mt-4">
                  {!user ? (
                    <>
                      <Link to="/user-onboarding">
                        <Button className="w-full" variant="outline">
                          Join as Buyer
                        </Button>
                      </Link>
                      <Link to="/seller-onboarding">
                        <Button className="w-full">Join as Seller</Button>
                      </Link>
                    </>
                  ) : isBuyer ? (
                    <>
                      <Link to="/search" className="flex items-center gap-2 py-2">
                        <Search className="h-4 w-4" />
                        Find Crops
                      </Link>
                      <Link to="/my-orders" className="flex items-center gap-2 py-2">
                        <Truck className="h-4 w-4" />
                        My Orders
                      </Link>
                      <Link to="/cart" className="flex items-center gap-2 py-2 relative">
                        <ShoppingCart className="h-4 w-4" />
                        My Cart
                        {totalItems > 0 && (
                          <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {totalItems}
                          </Badge>
                        )}
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2 py-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/dashboard" className="flex items-center gap-2 py-2">
                        <Store className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link to="/inventory" className="flex items-center gap-2 py-2">
                        <Search className="h-4 w-4" />
                        Inventory
                      </Link>
                      <Link to="/seller-orders" className="flex items-center gap-2 py-2">
                        <Truck className="h-4 w-4" />
                        Orders
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2 py-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <Link to={user ? (isBuyer ? "/search" : "/dashboard") : "/"} className="hidden md:flex items-center gap-2 font-bold text-xl text-primary">
            <img 
              src="/lovable-uploads/091e46ba-9e22-49fc-b392-d4786a34403a.png" 
              alt="AgroConnect Logo" 
              className="h-8 w-8 object-contain"
            />
            AgroConnect
          </Link>
          <Link to={user ? (isBuyer ? "/search" : "/dashboard") : "/"} className="flex md:hidden items-center gap-1 font-bold text-xl text-primary">
            <img 
              src="/lovable-uploads/091e46ba-9e22-49fc-b392-d4786a34403a.png" 
              alt="AgroConnect Logo" 
              className="h-6 w-6 object-contain"
            />
            AC
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {isBuyer && (
            <>
              <Link to="/search" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                <Search className="h-4 w-4" />
                Find Crops
              </Link>
              <Link to="/my-orders" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                <Truck className="h-4 w-4" />
                My Orders
              </Link>
              <Link to="/cart" className="text-sm font-medium hover:text-primary relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </>
          )}
          {isSeller && (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                <Store className="h-4 w-4" />
                Dashboard
              </Link>
              <Link to="/inventory" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                <Search className="h-4 w-4" />
                Inventory
              </Link>
              <Link to="/seller-orders" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                <Truck className="h-4 w-4" />
                Orders
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {!user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/user-onboarding">
                <Button variant="outline">Join as Buyer</Button>
              </Link>
              <Link to="/seller-onboarding">
                <Button>Join as Seller</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <NotificationDropdown />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden md:block text-sm">
                      {profile?.full_name}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {isBuyer && (
                    <>
                      <DropdownMenuItem>
                        <Link to="/search" className="flex items-center w-full">
                          <MapPin className="mr-2 h-4 w-4" />
                          Find Crops
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/my-orders" className="flex items-center w-full">
                          <Truck className="mr-2 h-4 w-4" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/cart" className="flex items-center w-full">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          My Cart
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {isSeller && (
                    <>
                      <DropdownMenuItem>
                        <Link to="/seller-orders" className="flex items-center w-full">
                          <Truck className="mr-2 h-4 w-4" />
                          Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/inventory" className="flex items-center w-full">
                          <Store className="mr-2 h-4 w-4" />
                          Inventory
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
