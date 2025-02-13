
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
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/d0eaee07-4183-4bee-82ec-c2b979790c51.png"
            alt="GiftWave Logo"
            className="h-16 w-auto animate-fade-in"
          />
        </div>

        <div className="flex items-center justify-between gap-4 animate-fade-in">
          <div className="relative flex-1">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer" 
              onClick={handleSearch}
            />
            <Input 
              className="pl-10 bg-white shadow-sm border-gray-100 rounded-xl" 
              placeholder="Search profiles or add contacts"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div 
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="h-6 w-6 text-gray-600" />
          </div>
        </div>

        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome to GiftWave!
          </h1>
          <p className="text-sm text-gray-500">
            What would you like to do first?
          </p>
        </div>

        <div className="space-y-4">
          <Card 
            className="p-6 space-y-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-blue-50 to-white shadow-sm border-0"
            onClick={() => navigate("/gift")}
          >
            <div className="flex justify-center">
              <div className="bg-blue-500/10 p-4 rounded-2xl">
                <Gift className="h-12 w-12 text-blue-500" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="font-medium text-lg">Send someone a gift</h2>
              <p className="text-sm text-gray-500">
                Show them you care with a thoughtful gift
              </p>
            </div>
          </Card>

          <Card 
            className="p-6 space-y-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-green-50 to-white shadow-sm border-0"
            onClick={() => navigate("/my-gifts")}
          >
            <div className="flex justify-center">
              <div className="bg-green-500/10 p-4 rounded-2xl">
                <Gift className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="font-medium text-lg">See my gifts</h2>
              <p className="text-sm text-gray-500">
                View all your sent and received gifts
              </p>
            </div>
          </Card>

          <Card 
            className="p-4 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-pink-50 to-white shadow-sm border-0"
            onClick={() => navigate("/promo")}
          >
            <div className="bg-pink-500/10 p-3 rounded-xl">
              <Heart className="h-6 w-6 text-pink-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg">Enter your promo code</h3>
              <p className="text-sm text-gray-500">Have a code? Enter it here</p>
            </div>
          </Card>

          {!user && (
            <Card className="p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm border-0">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-500">
                  Sign in or create an account to start sending and receiving gifts!
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm border-0">
            <h3 className="font-medium text-lg mb-4">Frequently Asked Questions</h3>
            <ScrollArea className="h-[200px] w-full rounded-xl">
              <div className="space-y-6 pr-4">
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
