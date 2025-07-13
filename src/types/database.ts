import { Database } from '@/integrations/supabase/types';

// Database types from Supabase
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type SellerProfile = Database['public']['Tables']['seller_profiles']['Row'];
export type SellerProfileInsert = Database['public']['Tables']['seller_profiles']['Insert'];
export type SellerProfileUpdate = Database['public']['Tables']['seller_profiles']['Update'];

export type Crop = Database['public']['Tables']['crops']['Row'];
export type CropInsert = Database['public']['Tables']['crops']['Insert'];
export type CropUpdate = Database['public']['Tables']['crops']['Update'];

export type CropCategory = Database['public']['Tables']['crop_categories']['Row'];

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

export type Notification = Database['public']['Tables']['notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];

export type DeliveryTracking = Database['public']['Tables']['delivery_tracking']['Row'];
export type DeliveryTrackingInsert = Database['public']['Tables']['delivery_tracking']['Insert'];
export type DeliveryTrackingUpdate = Database['public']['Tables']['delivery_tracking']['Update'];

// Enums
export type UserType = Database['public']['Enums']['user_type'];
export type VerificationStatus = Database['public']['Enums']['verification_status'];
export type OrderStatus = Database['public']['Enums']['order_status'];
export type NotificationType = Database['public']['Enums']['notification_type'];

// Extended types for UI
export interface CropWithSeller extends Crop {
  seller?: SellerProfile & { profiles?: Profile };
  crop_categories?: CropCategory;
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { crops: Crop })[];
  seller_profiles?: SellerProfile & { profiles?: Profile };
  delivery_tracking?: DeliveryTracking;
}

export interface Vendor {
  id: string;
  name: string;
  businessName: string;
  location: {
    lat: number;
    lng: number;
  };
  distance: number;
  rating: number;
  crops: string[];
  estimatedDelivery: string;
  isOnline: boolean;
  address?: string;
  phone?: string;
  deliveryRadius: number;
  verification_status: VerificationStatus;
}

// Tanzania-specific types
export interface TzLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  region: string;
}

export interface TzCurrency {
  amount: number;
  currency: 'TZS';
  formatted: string;
}