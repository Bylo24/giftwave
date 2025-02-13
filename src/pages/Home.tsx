import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Search, Gift, Wallet, Plus, ArrowDown, UserPlus, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const { user } = useAuth();

  const handleSearch = () => {
    navigate("/contacts");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const quickActions = [
    { icon: Gift, label: "My Gifts", route: "/my-gifts", color: "pink" },
    { icon: UserPlus, label: "Invite", route: "/contacts", color: "blue" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <img 
            src="/lovable-uploads/d0eaee07-4183-4bee-82ec-c2b979790c51.png"
            alt="GiftWave Logo"
            className="h-8 w-auto"
          />
          <div className="flex items-center gap-2">
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => navigate("/profile")}
            >
              <Settings className="h-6 w-6 text-gray-700" />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" 
            onClick={handleSearch}
          />
          <Input 
            className="pl-10 bg-gray-100 border-0 rounded-full text-sm" 
            placeholder="Search contacts or invite friends"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Send Money As A Gift, With A Personal Touch!
          </h1>
          <button
            onClick={() => navigate("/gift")}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:opacity-90 transition-opacity shadow-lg font-medium text-lg flex items-center justify-center gap-2"
          >
            <Gift className="h-6 w-6" />
            Send a Gift
          </button>
        </div>

        {/* Wallet Overview */}
        <Card className="p-6 bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Your Balance</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-3xl font-bold">$0.00</p>
              <p className="text-sm opacity-80">Available balance</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-2 text-sm font-medium">
                <Plus className="h-4 w-4" />
                Add Money
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-2 text-sm font-medium">
                <ArrowDown className="h-4 w-4" />
                Withdraw
              </button>
            </div>
          </div>
        </Card>

        {/* Quick Access */}
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className={`p-4 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-${action.color}-50 to-white border-0`}
              onClick={() => navigate(action.route)}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`bg-${action.color}-100 p-2.5 rounded-xl`}>
                  <action.icon className={`h-5 w-5 text-${action.color}-600`} />
                </div>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="p-4">
          <h3 className="font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center text-sm text-gray-500 py-4">
            No recent transactions
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Home;
