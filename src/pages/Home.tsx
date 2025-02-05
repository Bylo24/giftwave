import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Search, Gift, Heart, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const { user } = useAuth();

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
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-[500px]">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer" 
              onClick={handleSearch}
            />
            <Input 
              className="pl-10 bg-gray-50 cursor-text" 
              placeholder="Search profiles or add contacts"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div 
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="h-6 w-6 text-gray-600" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome to GiftWave!
          </h1>
          <p className="text-sm text-gray-500">
            What would you like to do first?
          </p>
        </div>

        <div className="space-y-4">
          <Card 
            className="p-6 space-y-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigate("/gift")}
          >
            <div className="flex justify-center">
              <Gift className="h-12 w-12 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="font-medium">Send someone a gift</h2>
              <p className="text-sm text-gray-500">
                Show them you care with a thoughtful gift
              </p>
            </div>
          </Card>

          <Card 
            className="p-6 space-y-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigate("/my-gifts")}
          >
            <div className="flex justify-center">
              <Gift className="h-12 w-12 text-secondary" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="font-medium">See my gifts</h2>
              <p className="text-sm text-gray-500">
                View all your sent and received gifts
              </p>
            </div>
          </Card>

          <Card 
            className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigate("/promo")}
          >
            <div className="bg-pink-50 p-2 rounded-full">
              <Heart className="h-6 w-6 text-pink-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Enter your promo code</h3>
              <p className="text-sm text-gray-500">Have a code? Enter it here</p>
            </div>
          </Card>

          {!user && (
            <Card className="p-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-500">
                  Sign in or create an account to start sending and receiving gifts!
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <h3 className="font-medium mb-4">Frequently Asked Questions</h3>
            <ScrollArea className="h-[200px] w-full rounded-md">
              <div className="space-y-4 pr-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">How does GiftWave work?</h4>
                  <p className="text-sm text-gray-500">
                    GiftWave lets you send digital gifts to your friends and family. Choose a gift, add a personal message, and we'll deliver it instantly!
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">What types of gifts can I send?</h4>
                  <p className="text-sm text-gray-500">
                    You can send digital gift cards, custom messages, and even schedule future gifts for special occasions.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">How do I redeem a gift?</h4>
                  <p className="text-sm text-gray-500">
                    When you receive a gift, you'll get a notification. Simply click on the gift to view and redeem it instantly.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Can I send gifts internationally?</h4>
                  <p className="text-sm text-gray-500">
                    Yes! GiftWave works globally, allowing you to send gifts to friends and family anywhere in the world.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Are there any fees?</h4>
                  <p className="text-sm text-gray-500">
                    GiftWave keeps things simple! We charge a small fee to ensure secure transactions, high-quality video messages, and a seamless gifting experience. This helps us keep the platform running smoothly while adding those special touches that make your gifts feel truly personal.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Home;