
import React from 'react';
import { Button } from "@/components/ui/button";
import SellerCard from './SellerCard';

interface SearchResultsProps {
  results: any[];
  selectedCropType: string;
  cropTypes: any[];
  onClear: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  selectedCropType, 
  cropTypes,
  onClear 
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">
            {selectedCropType ? (
              <>
                {cropTypes.find(c => c.id === selectedCropType)?.name} Sellers
              </>
            ) : (
              <>Search Results</>
            )}
          </h2>
          <p className="text-muted-foreground">
            {results.length} sellers found near you
          </p>
        </div>
        <Button variant="outline" onClick={onClear}>
          Clear Search
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((seller) => (
          <SellerCard 
            key={seller.id} 
            seller={seller}
            selectedCropType={selectedCropType} 
          />
        ))}
      </div>
    </>
  );
};

export default SearchResults;
