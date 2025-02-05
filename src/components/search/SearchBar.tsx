import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export const SearchBar = ({
  searchInput,
  setSearchInput,
  handleSearch,
  handleKeyPress,
}: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Input
        type="text"
        placeholder="Search gifts, people, or memories..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={handleKeyPress}
        className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 bg-white"
      />
      <button
        onClick={handleSearch}
        className="absolute left-3 top-1/2 -translate-y-1/2"
      >
        <Search className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  );
};