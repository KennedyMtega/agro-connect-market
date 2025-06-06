
import { useState } from 'react';
import { Vendor } from '@/types/map';

export const useMapVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Comprehensive mock vendors with diverse locations and products
  const mockVendors: Vendor[] = [
    {
      id: "vendor-1",
      name: "Green Valley Organic Farm",
      location: {
        lat: 40.7128,
        lng: -74.0060
      },
      distance: 1.2,
      rating: 4.9,
      crops: [
        { id: "crop-1", name: "Organic Basmati Rice", category: "Grain", pricePerUnit: 8.99, unit: "kg", quantityAvailable: 250 },
        { id: "crop-2", name: "Heirloom Tomatoes", category: "Vegetable", pricePerUnit: 4.50, unit: "kg", quantityAvailable: 80 },
        { id: "crop-3", name: "Fresh Spinach", category: "Leafy Green", pricePerUnit: 3.25, unit: "kg", quantityAvailable: 45 },
        { id: "crop-4", name: "Organic Carrots", category: "Root Vegetable", pricePerUnit: 2.75, unit: "kg", quantityAvailable: 120 }
      ],
      estimatedDelivery: "15-25 min",
      online: true
    },
    {
      id: "vendor-2",
      name: "Sunshine Citrus Grove",
      location: {
        lat: 40.7589,
        lng: -73.9851
      },
      distance: 2.8,
      rating: 4.7,
      crops: [
        { id: "crop-5", name: "Valencia Oranges", category: "Citrus Fruit", pricePerUnit: 3.99, unit: "kg", quantityAvailable: 200 },
        { id: "crop-6", name: "Meyer Lemons", category: "Citrus Fruit", pricePerUnit: 5.50, unit: "kg", quantityAvailable: 85 },
        { id: "crop-7", name: "Pink Grapefruits", category: "Citrus Fruit", pricePerUnit: 4.25, unit: "kg", quantityAvailable: 65 },
        { id: "crop-8", name: "Key Limes", category: "Citrus Fruit", pricePerUnit: 7.99, unit: "kg", quantityAvailable: 30 }
      ],
      estimatedDelivery: "20-35 min",
      online: true
    },
    {
      id: "vendor-3",
      name: "Heritage Grain Co.",
      location: {
        lat: 40.6892,
        lng: -74.0445
      },
      distance: 3.5,
      rating: 4.8,
      crops: [
        { id: "crop-9", name: "Quinoa Red", category: "Ancient Grain", pricePerUnit: 12.99, unit: "kg", quantityAvailable: 75 },
        { id: "crop-10", name: "Steel Cut Oats", category: "Grain", pricePerUnit: 6.50, unit: "kg", quantityAvailable: 150 },
        { id: "crop-11", name: "Black Beans", category: "Legume", pricePerUnit: 4.99, unit: "kg", quantityAvailable: 200 },
        { id: "crop-12", name: "Chickpeas", category: "Legume", pricePerUnit: 5.25, unit: "kg", quantityAvailable: 180 }
      ],
      estimatedDelivery: "25-40 min",
      online: true
    },
    {
      id: "vendor-4",
      name: "Mountain View Berry Farm",
      location: {
        lat: 40.7831,
        lng: -73.9712
      },
      distance: 4.1,
      rating: 4.6,
      crops: [
        { id: "crop-13", name: "Organic Strawberries", category: "Berry", pricePerUnit: 8.99, unit: "kg", quantityAvailable: 40 },
        { id: "crop-14", name: "Blueberries", category: "Berry", pricePerUnit: 12.50, unit: "kg", quantityAvailable: 25 },
        { id: "crop-15", name: "Blackberries", category: "Berry", pricePerUnit: 10.99, unit: "kg", quantityAvailable: 35 },
        { id: "crop-16", name: "Raspberries", category: "Berry", pricePerUnit: 14.99, unit: "kg", quantityAvailable: 20 }
      ],
      estimatedDelivery: "30-45 min",
      online: true
    },
    {
      id: "vendor-5",
      name: "Riverside Vegetable Gardens",
      location: {
        lat: 40.6782,
        lng: -73.9442
      },
      distance: 4.8,
      rating: 4.5,
      crops: [
        { id: "crop-17", name: "Bell Peppers Mix", category: "Vegetable", pricePerUnit: 5.99, unit: "kg", quantityAvailable: 90 },
        { id: "crop-18", name: "Cucumber", category: "Vegetable", pricePerUnit: 2.99, unit: "kg", quantityAvailable: 110 },
        { id: "crop-19", name: "Zucchini", category: "Vegetable", pricePerUnit: 3.50, unit: "kg", quantityAvailable: 75 },
        { id: "crop-20", name: "Eggplant", category: "Vegetable", pricePerUnit: 4.75, unit: "kg", quantityAvailable: 55 }
      ],
      estimatedDelivery: "35-50 min",
      online: true
    },
    {
      id: "vendor-6",
      name: "Golden Harvest Orchard",
      location: {
        lat: 40.7505,
        lng: -73.9934
      },
      distance: 2.3,
      rating: 4.9,
      crops: [
        { id: "crop-21", name: "Honeycrisp Apples", category: "Tree Fruit", pricePerUnit: 6.99, unit: "kg", quantityAvailable: 150 },
        { id: "crop-22", name: "Bartlett Pears", category: "Tree Fruit", pricePerUnit: 5.50, unit: "kg", quantityAvailable: 80 },
        { id: "crop-23", name: "Yellow Peaches", category: "Tree Fruit", pricePerUnit: 7.25, unit: "kg", quantityAvailable: 60 },
        { id: "crop-24", name: "Sweet Cherries", category: "Tree Fruit", pricePerUnit: 15.99, unit: "kg", quantityAvailable: 25 }
      ],
      estimatedDelivery: "18-30 min",
      online: true
    },
    {
      id: "vendor-7",
      name: "Coastal Herb & Spice Farm",
      location: {
        lat: 40.6928,
        lng: -74.0060
      },
      distance: 3.9,
      rating: 4.7,
      crops: [
        { id: "crop-25", name: "Fresh Basil", category: "Herb", pricePerUnit: 12.99, unit: "kg", quantityAvailable: 15 },
        { id: "crop-26", name: "Oregano", category: "Herb", pricePerUnit: 18.50, unit: "kg", quantityAvailable: 8 },
        { id: "crop-27", name: "Rosemary", category: "Herb", pricePerUnit: 15.75, unit: "kg", quantityAvailable: 12 },
        { id: "crop-28", name: "Thyme", category: "Herb", pricePerUnit: 22.99, unit: "kg", quantityAvailable: 6 }
      ],
      estimatedDelivery: "28-40 min",
      online: true
    },
    {
      id: "vendor-8",
      name: "Prairie Grain & Seed Co.",
      location: {
        lat: 40.7282,
        lng: -73.7949
      },
      distance: 6.2,
      rating: 4.4,
      crops: [
        { id: "crop-29", name: "Sunflower Seeds", category: "Seed", pricePerUnit: 8.99, unit: "kg", quantityAvailable: 100 },
        { id: "crop-30", name: "Pumpkin Seeds", category: "Seed", pricePerUnit: 12.50, unit: "kg", quantityAvailable: 45 },
        { id: "crop-31", name: "Chia Seeds", category: "Superfood Seed", pricePerUnit: 24.99, unit: "kg", quantityAvailable: 20 },
        { id: "crop-32", name: "Flax Seeds", category: "Superfood Seed", pricePerUnit: 9.75, unit: "kg", quantityAvailable: 65 }
      ],
      estimatedDelivery: "45-60 min",
      online: true
    },
    {
      id: "vendor-9",
      name: "Urban Microgreens Lab",
      location: {
        lat: 40.7614,
        lng: -73.9776
      },
      distance: 1.8,
      rating: 4.8,
      crops: [
        { id: "crop-33", name: "Pea Microgreens", category: "Microgreen", pricePerUnit: 28.99, unit: "kg", quantityAvailable: 8 },
        { id: "crop-34", name: "Radish Microgreens", category: "Microgreen", pricePerUnit: 32.50, unit: "kg", quantityAvailable: 6 },
        { id: "crop-35", name: "Arugula Microgreens", category: "Microgreen", pricePerUnit: 35.99, unit: "kg", quantityAvailable: 5 },
        { id: "crop-36", name: "Kale Microgreens", category: "Microgreen", pricePerUnit: 29.75, unit: "kg", quantityAvailable: 7 }
      ],
      estimatedDelivery: "12-20 min",
      online: true
    },
    {
      id: "vendor-10",
      name: "Tropical Delights Farm",
      location: {
        lat: 40.6643,
        lng: -73.9385
      },
      distance: 5.7,
      rating: 4.6,
      crops: [
        { id: "crop-37", name: "Dragon Fruit", category: "Exotic Fruit", pricePerUnit: 18.99, unit: "kg", quantityAvailable: 15 },
        { id: "crop-38", name: "Passion Fruit", category: "Exotic Fruit", pricePerUnit: 22.50, unit: "kg", quantityAvailable: 12 },
        { id: "crop-39", name: "Star Fruit", category: "Exotic Fruit", pricePerUnit: 16.75, unit: "kg", quantityAvailable: 18 },
        { id: "crop-40", name: "Lychee", category: "Exotic Fruit", pricePerUnit: 25.99, unit: "kg", quantityAvailable: 10 }
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
