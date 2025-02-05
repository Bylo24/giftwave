import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

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
    <div className="min-h-screen bg-[#E5DEFF] pb-16">
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 w-full">
          <button 
            onClick={() => navigate("/")}
            className="p-2 hover:bg-[#D6BCFA] rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-[#6E59A5]" />
          </button>
          <div className="relative flex-1">
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
        </div>

        {query && (
          <div className="space-y-4">
            <p className="text-sm text-[#6E59A5]">
              Search results for "{query}"
            </p>
            
            {mockResults.map((result) => (
              <Card 
                key={result.id}
                className="p-4 cursor-pointer hover:bg-[#D6BCFA]/20 transition-colors border-[#9b87f5]"
                onClick={() => console.log(`Clicked on profile ${result.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#9b87f5] rounded-full" />
                  <div>
                    <h3 className="font-medium text-[#1A1F2C]">{result.name}</h3>
                    <p className="text-sm text-[#7E69AB]">{result.username}</p>
                  </div>
                </div>
              </Card>
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