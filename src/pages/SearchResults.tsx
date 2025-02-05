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

  // Mock search results - in a real app, this would come from an API
  const mockResults = [
    { id: 1, name: "John Doe", username: "@johndoe" },
    { id: 2, name: "Jane Smith", username: "@janesmith" },
    { id: 3, name: "Mike Johnson", username: "@mikej" },
  ];

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
    <div className="min-h-screen bg-white pb-16">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="relative flex-1">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer" 
              onClick={handleSearch}
            />
            <Input 
              className="pl-10 bg-gray-50"
              placeholder="Search profiles or add contacts"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {query && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Search results for "{query}"
            </p>
            
            {mockResults.map((result) => (
              <Card 
                key={result.id}
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => console.log(`Clicked on profile ${result.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full" />
                  <div>
                    <h3 className="font-medium">{result.name}</h3>
                    <p className="text-sm text-gray-500">{result.username}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {query && mockResults.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No results found</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default SearchResults;