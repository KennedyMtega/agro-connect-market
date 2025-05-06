
export interface Vendor {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  distance: number;
  rating: number;
  crops: Array<{
    id: string;
    name: string;
    category: string;
    pricePerUnit: number;
    unit: string;
    quantityAvailable: number;
  }>;
  estimatedDelivery: string;
  online: boolean;
}

export interface Crop {
  id: string;
  name: string;
  description?: string;
  category: string;
  pricePerUnit: number;
  unit: string;
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

export enum ViewState {
  INITIAL,
  SEARCHING,
  VENDOR_LIST,
  VENDOR_DETAIL,
  CHECKOUT,
  CONFIRMATION
}
