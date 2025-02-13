
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Search, Gift, Heart, Bell, Video, CreditCard, Zap, Palette, ArrowRight, ChevronRight, Phone, Upload, DollarSign, Mail } from "lucide-react";
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

  const steps = [
    { icon: Phone, text: "Choose recipient by phone number" },
    { icon: Video, text: "Record a video message" },
    { icon: DollarSign, text: "Select amount and pay" },
    { icon: Gift, text: "They open an interactive gift" },
    { icon: Zap, text: "Instant claiming" }
  ];

  const features = [
    { icon: Video, title: "Video Messages", description: "Make your gift feel more personal", color: "blue" },
    { icon: Gift, title: "Animated Gift Reveal", description: "Fun, interactive unwrapping", color: "green" },
    { icon: CreditCard, title: "Secure Payments", description: "Card, wallet, or bank transfer", color: "purple" },
    { icon: Zap, title: "Instant Claiming", description: "Claim gifts immediately", color: "yellow" },
    { icon: Palette, title: "Personalized Cards", description: "Customize with stickers & themes", color: "pink" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
      <div className="px-4 py-6 space-y-8 pb-24">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Send Money as a Gift, Instantly & Personally
          </h1>
          <p className="text-gray-600 text-sm">
            Personalized video messages, interactive gift reveals, and secure payments.
          </p>
          <button
            onClick={() => navigate("/gift")}
            className="w-full px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
          >
            Send a Gift Now
          </button>
        </div>

        {/* How It Works */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">How It Works</h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <step.icon className="h-6 w-6 text-gray-700" />
                </div>
                <p className="text-sm text-gray-700 font-medium flex-1">{step.text}</p>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Key Features</h2>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className={`bg-${feature.color}-100 p-3 rounded-xl`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-0">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">Over 10,000 gifts sent!</h3>
            <p className="text-sm text-gray-600">Join thousands of happy users</p>
            <div className="flex justify-center gap-2 pt-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                ⭐️ 4.9/5 rating
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                💝 Trusted by many
              </span>
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Simple Pricing</h2>
          <div className="space-y-3">
            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">$25 Gift</p>
                <p className="text-xs text-gray-500">10% fee</p>
              </div>
              <p className="text-sm font-medium text-gray-700">$2.50 fee</p>
            </Card>
            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">$100 Gift</p>
                <p className="text-xs text-gray-500">3% fee</p>
              </div>
              <p className="text-sm font-medium text-gray-700">$3.00 fee</p>
            </Card>
          </div>
        </div>

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
          <h3 className="font-medium text-lg mb-4">Common Questions</h3>
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

        {/* Contact Support */}
        <Card 
          className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-gray-50 via-white to-white border-0"
          onClick={() => window.location.href = "mailto:support@giftwave.app"}
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-2.5 rounded-xl">
              <Mail className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">Need help?</h3>
              <p className="text-xs text-gray-500 mt-0.5">Contact our support team</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Home;
