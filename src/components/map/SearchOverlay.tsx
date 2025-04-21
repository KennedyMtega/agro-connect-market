
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchOverlayProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (e?: React.FormEvent) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  handleSearch 
}) => {
  return (
    <div className="absolute top-16 left-2 right-2 z-10">
      <div className="w-full bg-background rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2">Find Crops Near You</h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            Search
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SearchOverlay;
