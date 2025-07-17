
import { useState } from 'react';
import { Vendor } from '@/types/map';

export const useMapVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Vendors will be loaded from database
  const mockVendors: Vendor[] = [];

  return {
    vendors,
    setVendors,
    mockVendors
  };
};
