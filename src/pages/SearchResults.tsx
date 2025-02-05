import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResult } from "@/components/search/SearchResult";

// Define the type for our mock data
interface MockResult {
  id: number;
  name: string;
  username: string;
}

// Add mock data
const mockResults: MockResult[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "@sarahj"
  },
  {
    id: 2,
    name: "Mike Smith",
    username: "@mikesmith"
  },
  {
    id: 3,
    name: "Emma Wilson",
    username: "@emmaw"
  }
];

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);

  const handleSearch = () => {
    if (searchInput) {
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-[#E5DEFF]">
      <div className="fixed top-0 left-0 right-0 bg-[#E5DEFF] p-4 z-10">
        <div className="flex items-center gap-2 max-w-7xl mx-auto">
          <button 
            onClick={() => navigate("/")}
            className="p-2 hover:bg-[#D6BCFA] rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-[#6E59A5]" />
          </button>
          <SearchBar 
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearch={handleSearch}
            handleKeyPress={handleKeyPress}
          />
        </div>
      </div>

      <div className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
        {query && (
          <div className="space-y-4">
            <p className="text-sm text-[#6E59A5]">
              Search results for "{query}"
            </p>
            
            {mockResults.map((result) => (
              <SearchResult
                key={result.id}
                {...result}
                onClick={() => console.log(`Clicked on profile ${result.id}`)}
              />
            ))}
          </div>
        )}

        {query && mockResults.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[#6E59A5]">No results found</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default SearchResults;