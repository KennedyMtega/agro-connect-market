import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/091e46ba-9e22-49fc-b392-d4786a34403a.png" 
                alt="AgroConnect Logo" 
                className="h-8 w-8 object-contain"
              />
              <h3 className="text-lg font-bold">AgroConnect</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting agricultural buyers and sellers for a sustainable future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">For Buyers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-primary">
                  Find Crops
                </Link>
              </li>
              <li>
                <Link to="/how-it-works-buyers" className="text-muted-foreground hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/buyer-faq" className="text-muted-foreground hover:text-primary">
                  Buyer FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">For Sellers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/seller-guide" className="text-muted-foreground hover:text-primary">
                  Seller Guide
                </Link>
              </li>
              <li>
                <Link to="/become-seller" className="text-muted-foreground hover:text-primary">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/seller-faq" className="text-muted-foreground hover:text-primary">
                  Seller FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-muted-foreground/20">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} AgroConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
