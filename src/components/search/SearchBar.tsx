
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, X } from "lucide-react";
import { sanitizeSearchQuery, searchRateLimit } from "@/utils/inputSanitization";
import { toast } from "sonner";

interface SearchBarProps {
  onSearch: (query: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, inputRef }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const clientId = 'search-client'; // In production, use user ID or IP
    if (!searchRateLimit(clientId)) {
      toast.error("Too many searches. Please wait a moment before searching again.");
      return;
    }
    
    // Sanitize and validate search query
    const sanitizedQuery = sanitizeSearchQuery(query);
    if (sanitizedQuery.length < 2) {
      toast.error("Please enter at least 2 characters to search.");
      return;
    }
    
    onSearch(sanitizedQuery);
  };
  
  const handleClear = () => {
    setQuery("");
    onSearch("");
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit}
      className="relative w-full"
    >
      <div className={`bg-white rounded-full shadow-md flex items-center transition-all ${
        isFocused ? "ring-2 ring-green-500 ring-opacity-50" : ""
      }`}>
        {isFocused ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full h-10 w-10 p-0 text-gray-500"
            onClick={() => {
              setIsFocused(false);
              if (inputRef?.current) {
                inputRef.current.blur();
              }
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <Search className="h-5 w-5 ml-4 text-gray-500" />
        )}
        
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(sanitizeSearchQuery(e.target.value))}
          placeholder="Search for crops, businesses..."
          className="flex-1 border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-2 pr-4 py-6"
          onFocus={() => setIsFocused(true)}
        />
        
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="rounded-full h-8 w-8 p-0 mr-1"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          type="submit"
          className="rounded-full h-9 w-9 p-0 mr-1 bg-green-600 hover:bg-green-700"
        >
          <Search className="h-4 w-4 text-white" />
        </Button>
      </div>
    </form>
  );
};
