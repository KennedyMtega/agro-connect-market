import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Loader2 } from 'lucide-react';
import { useGlobalCropSearch } from '@/hooks/useGlobalCropSearch';
import { CropSearchCard } from './CropSearchCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GlobalSearchComponentProps {
  onSellerSelect?: (sellerId: string) => void;
}

export const GlobalSearchComponent: React.FC<GlobalSearchComponentProps> = ({
  onSellerSelect
}) => {
  const { searchResults, loading, searchCrops, clearSearch } = useGlobalCropSearch();
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchCrops(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Auto-search as user types (debounced)
    if (value.trim()) {
      const timeoutId = setTimeout(() => {
        searchCrops(value);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      clearSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search Crops</CardTitle>
          <CardDescription>
            Find crops from all verified sellers across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for crops, categories, or sellers..."
                className="pr-10"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button type="submit" disabled={loading || !query.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {loading && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Searching crops...</p>
        </div>
      )}

      {searchResults.searchQuery && (
        <div className="text-sm text-muted-foreground">
          {searchResults.totalCount > 0 ? (
            `Found ${searchResults.totalCount} crops matching "${searchResults.searchQuery}"`
          ) : (
            `No crops found matching "${searchResults.searchQuery}"`
          )}
        </div>
      )}

      {searchResults.crops.length > 0 && (
        <div className="space-y-4">
          {searchResults.crops.map((crop) => (
            <CropSearchCard
              key={crop.id}
              crop={crop}
              onSellerSelect={onSellerSelect}
            />
          ))}
        </div>
      )}

      {searchResults.searchQuery && searchResults.crops.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No crops found</h3>
            <p className="text-muted-foreground">
              Try searching with different keywords or check the spelling.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};