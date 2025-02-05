import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const SearchBar = ({ searchInput, setSearchInput, handleSearch, handleKeyPress }: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7E69AB] h-4 w-4 cursor-pointer" 
        onClick={handleSearch}
      />
      <Input 
        className="pl-10 bg-white/80 w-full border-[#9b87f5]"
        placeholder="Search profiles or add contacts"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};