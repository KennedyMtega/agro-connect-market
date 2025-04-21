
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

export enum ViewState {
  INITIAL,
  SEARCHING,
  VENDOR_LIST,
  VENDOR_DETAIL,
  CHECKOUT,
  CONFIRMATION
}
