
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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <img 
            src="/lovable-uploads/d0eaee07-4183-4bee-82ec-c2b979790c51.png"
            alt="GiftWave Logo"
            className="h-8 w-auto"
          />
          <div 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="h-6 w-6 text-gray-700" />
          </div>
        </div>

        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" 
            onClick={handleSearch}
          />
          <Input 
            className="pl-10 bg-gray-100 border-0 rounded-full text-sm" 
            placeholder="Search profiles or add contacts"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 via-white to-white border-0"
            onClick={() => navigate("/gift")}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Gift className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center">
                <h2 className="font-medium text-sm">Send a Gift</h2>
                <p className="text-xs text-gray-500 mt-1">Show you care</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 via-white to-white border-0"
            onClick={() => navigate("/my-gifts")}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <Gift className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center">
                <h2 className="font-medium text-sm">My Gifts</h2>
                <p className="text-xs text-gray-500 mt-1">View history</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Promo Section */}
        <Card 
          className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-pink-50 via-white to-white border-0"
          onClick={() => navigate("/promo")}
        >
          <div className="flex items-center gap-4">
            <div className="bg-pink-100 p-2.5 rounded-xl">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Got a promo code?</h3>
              <p className="text-xs text-gray-500 mt-0.5">Tap here to enter it</p>
            </div>
          </div>
        </Card>

        {/* Sign In Card */}
        {!user && (
          <Card className="p-4 bg-gradient-to-b from-gray-50 to-white border-0">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Sign in to start sending gifts
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full px-4 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Sign In
              </button>
            </div>
          </Card>
        )}

        {/* FAQ Section */}
        <div className="bg-white rounded-xl">
          <h3 className="font-medium text-base mb-4 px-1">Common Questions</h3>
          <ScrollArea className="h-[280px]">
            <div className="space-y-5 pr-4">
              <div className="space-y-1.5">
                <h4 className="font-medium text-sm">How does GiftWave work?</h4>
                <p className="text-xs leading-relaxed text-gray-600">
                  GiftWave lets you send digital gifts to your friends and family. Choose a gift, add a personal message, and we'll deliver it instantly!
                </p>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-medium text-sm">What types of gifts can I send?</h4>
                <p className="text-xs leading-relaxed text-gray-600">
                  You can send digital gift cards, custom messages, and even schedule future gifts for special occasions.
                </p>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-medium text-sm">How do I redeem a gift?</h4>
                <p className="text-xs leading-relaxed text-gray-600">
                  When you receive a gift, you'll get a notification. Simply click on the gift to view and redeem it instantly.
                </p>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-medium text-sm">Can I send gifts internationally?</h4>
                <p className="text-xs leading-relaxed text-gray-600">
                  Yes! GiftWave works globally, allowing you to send gifts to friends and family anywhere in the world.
                </p>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-medium text-sm">Are there any fees?</h4>
                <p className="text-xs leading-relaxed text-gray-600">
                  GiftWave keeps things simple! We charge a small fee to ensure secure transactions, high-quality video messages, and a seamless gifting experience.
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Home;
