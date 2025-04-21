
import { useState } from 'react';
import { Vendor } from '@/types/map';

export const useMapVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Mock vendors with geo locations
  const mockVendors: Vendor[] = [
    {
      id: "vendor-1",
      name: "Green Valley Farms",
      location: {
        lat: 40.712776,
        lng: -74.005974
      },
      distance: 2.3,
      rating: 4.8,
      crops: [
        { id: "crop-1", name: "Organic Rice", category: "Grain", pricePerUnit: 35.99, unit: "kg", quantityAvailable: 500 },
        { id: "crop-2", name: "Fresh Tomatoes", category: "Vegetable", pricePerUnit: 2.99, unit: "kg", quantityAvailable: 100 }
      ],
      estimatedDelivery: "20-30 min",
      online: true
    },
    {
      id: "vendor-2",
      name: "Sunshine Produce",
      location: {
        lat: 40.722776,
        lng: -74.015974
      },
      distance: 3.1,
      rating: 4.5,
      crops: [
        { id: "crop-3", name: "Sweet Corn", category: "Vegetable", pricePerUnit: 0.75, unit: "ear", quantityAvailable: 200 },
        { id: "crop-4", name: "Russet Potatoes", category: "Vegetable", pricePerUnit: 1.25, unit: "kg", quantityAvailable: 300 }
      ],
      estimatedDelivery: "30-45 min",
      online: true
    },
    {
      id: "vendor-3",
      name: "Harvest Moon Organics",
      location: {
        lat: 40.702776,
        lng: -73.995974
      },
      distance: 5.6,
      rating: 4.9,
      crops: [
        { id: "crop-5", name: "Honey Crisp Apples", category: "Fruit", pricePerUnit: 3.99, unit: "kg", quantityAvailable: 75 },
        { id: "crop-6", name: "Red Lentils", category: "Legume", pricePerUnit: 4.50, unit: "kg", quantityAvailable: 150 }
      ],
      estimatedDelivery: "40-55 min",
      online: true
    }
  ];

  return {
    vendors,
    setVendors,
    mockVendors
  };
};
