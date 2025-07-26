import React from 'react';
import Layout from '@/components/layout/Layout';
import { GlobalSearchComponent } from '@/components/search/GlobalSearchComponent';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = () => {
  const navigate = useNavigate();

  const handleSellerSelect = (sellerId: string) => {
    // Navigate to seller profile or show seller details
    console.log('Selected seller:', sellerId);
    // You can implement navigation to seller profile here
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Find Crops</h1>
          <p className="text-muted-foreground">
            Search for crops from all verified sellers across the platform
          </p>
        </div>
        
        <GlobalSearchComponent onSellerSelect={handleSellerSelect} />
      </div>
    </Layout>
  );
};

export default GlobalSearch;