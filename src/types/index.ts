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
  name: string;
  description?: string;
  category: string;
  pricePerUnit: number;
  unit: string; // kg, ear, bushel, etc.
  quantityAvailable: number;
  sellerId?: string;
  sellerName?: string;
  images?: string[];
  isOrganic?: boolean;
  harvestDate?: Date;
  location?: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    address: string;
  };
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
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  createdAt: Date;
  estimatedDelivery?: Date;
  tracking?: OrderTracking;
}

export interface OrderItem {
  id: string;
  cropId: string;
  cropName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

export interface OrderTracking {
  currentStatus: string;
  lastUpdate: Date;
  driver?: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    vehicle: {
      make: string;
      model: string;
      color: string;
      plate: string;
    };
  };
  currentLocation?: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    address?: string;
    distanceToDestination?: number;
    estimatedTimeOfArrival?: Date;
  };
  timeline: {
    status: string;
    time: Date;
    completed: boolean;
    current?: boolean;
  }[];
}

// Authentication Types
export interface AuthState {
  user: User | null;
  buyerProfile: BuyerProfile | null;
  sellerProfile: SellerProfile | null;
  isLoading: boolean;
  error: string | null;
}
