
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Search,
  ShoppingCart,
  Store,
  User,
  LogOut,
  Bell,
  ChevronDown
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

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isBuyer = user?.userType === "buyer";
  const isSeller = user?.userType === "seller";

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
                        Search Crops
                      </Link>
                      <Link to="/cart" className="flex items-center gap-2 py-2">
                        <ShoppingCart className="h-4 w-4" />
                        My Cart
                      </Link>
                      <Link to="/orders" className="flex items-center gap-2 py-2">
                        Store
                        <Store className="h-4 w-4" />
                        My Orders
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
                        <ShoppingCart className="h-4 w-4" />
                        Orders
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/" className="font-bold text-xl text-primary hidden md:block">
            AgroConnect
          </Link>
          <Link to="/" className="font-bold text-xl text-primary md:hidden">
            AC
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {isBuyer && (
            <>
              <Link to="/search" className="text-sm font-medium hover:text-primary">
                Search Crops
              </Link>
              <Link to="/cart" className="text-sm font-medium hover:text-primary">
                My Cart
              </Link>
              <Link to="/orders" className="text-sm font-medium hover:text-primary">
                My Orders
              </Link>
            </>
          )}
          {isSeller && (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
                Dashboard
              </Link>
              <Link to="/inventory" className="text-sm font-medium hover:text-primary">
                Inventory
              </Link>
              <Link to="/seller-orders" className="text-sm font-medium hover:text-primary">
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
                        <Link to="/favorites" className="flex items-center w-full">
                          <Store className="mr-2 h-4 w-4" />
                          Favorites
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
                  <DropdownMenuItem onClick={() => logout()}>
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
