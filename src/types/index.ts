
// User Types
export type UserType = 'buyer' | 'seller';

export interface User {
  id: string;
  email?: string;
  phoneNumber?: string;
  fullName: string;
  userType: UserType;
  avatarUrl?: string;
  isPhoneVerified: boolean;
  preferredAuthMethod: 'email' | 'phone';
  createdAt: Date;
}

export interface BuyerProfile {
  id: string;
  userId: string;
  deliveryPreferences: Record<string, any>;
  paymentMethods: Record<string, any>;
  notificationPreferences: Record<string, any>;
}

export interface SellerProfile {
  id: string;
  userId: string;
  businessName: string;
  businessDescription?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  averageRating: number;
  totalRatings: number;
}

// Crop Types
export interface Crop {
  id: string;
  sellerId: string;
  name: string;
  description?: string;
  category: string;
  pricePerUnit: number;
  unit: string;
  quantityAvailable: number;
  images: string[];
  locationId?: string;
  isFeatured: boolean;
  createdAt: Date;
}

// Location Types
export interface Location {
  id: string;
  userId: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
}

// Order Types
export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  totalAmount: number;
  deliveryFee: number;
  commissionFee: number;
  deliveryAddressId: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  cropId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Authentication Types
export interface AuthState {
  user: User | null;
  buyerProfile: BuyerProfile | null;
  sellerProfile: SellerProfile | null;
  isLoading: boolean;
  error: string | null;
}
