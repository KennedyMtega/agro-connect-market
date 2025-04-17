
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
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

const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isBuyer = user?.userType === "buyer";
  const isSeller = user?.userType === "seller";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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
                <Link to="/" className="font-bold text-lg text-primary">
                  AgroConnect
                </Link>
                <div className="flex flex-col gap-2 mt-4">
                  {!user ? (
                    <>
                      <Link to="/login">
                        <Button className="w-full" variant="outline">
                          Log in
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button className="w-full">Sign up</Button>
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
                      <div className="flex items-center gap-2 py-2 relative">
                        <ShoppingCart className="h-4 w-4" />
                        My Cart
                        {totalItems > 0 && (
                          <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {totalItems}
                          </Badge>
                        )}
                      </div>
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
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <Link to={user ? (isBuyer ? "/search" : "/dashboard") : "/"} className="font-bold text-xl text-primary hidden md:block">
            AgroConnect
          </Link>
          <Link to={user ? (isBuyer ? "/search" : "/dashboard") : "/"} className="font-bold text-xl text-primary md:hidden">
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
              <Link to="#" className="text-sm font-medium hover:text-primary relative">
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
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden md:block text-sm">
                      {user.fullName}
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
                    </>
                  )}
                  {isSeller && (
                    <>
                      <DropdownMenuItem>
                        <Link to="/analytics" className="flex items-center w-full">
                          <Store className="mr-2 h-4 w-4" />
                          Analytics
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
