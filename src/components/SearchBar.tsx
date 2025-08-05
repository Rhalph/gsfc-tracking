import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (code: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [searchCode, setSearchCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      onSearch(searchCode.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Enter security code (e.g., GSFC001)"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="pl-10 h-12 text-lg border-2 border-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <Button 
          type="submit" 
          disabled={!searchCode.trim() || isLoading}
          size="lg"
          className="h-12 px-6 bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 transition-opacity"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  );
};