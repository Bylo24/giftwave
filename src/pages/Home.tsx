
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

  const quickActions = [
    { icon: Gift, label: "My Gifts", route: "/my-gifts", color: "pink" },
    { icon: UserPlus, label: "Invite", route: "/contacts", color: "blue" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDE1D3] via-[#FEC6A1] to-[#FFDEE2]">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-4 pt-4 pb-2 shadow-lg">
        <div className="flex items-center justify-between gap-4 mb-4">
          <img 
            src="/lovable-uploads/d0eaee07-4183-4bee-82ec-c2b979790c51.png"
            alt="GiftWave Logo"
            className="h-8 w-auto drop-shadow"
          />
          <div className="flex items-center gap-2">
            <button 
              className="p-2 hover:bg-white/50 rounded-full transition-all duration-300 hover:scale-105"
              onClick={() => navigate("/profile")}
            >
              <Settings className="h-6 w-6 text-gray-700" />
            </button>
            <button 
              className="p-2 hover:bg-white/50 rounded-full transition-all duration-300 hover:scale-105"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>

        <button 
          onClick={handleSearch}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white/60 backdrop-blur-sm rounded-full text-gray-500 text-sm 
                   hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <Search className="h-5 w-5" />
          <span>Search contacts or invite friends</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 space-y-8 pb-24">
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-fade-in">
          <h1 className="text-2xl font-semibold text-gray-900 font-playfair">
            Send Money As A Gift, With A Personal Touch!
          </h1>
          <button
            onClick={() => navigate("/frontcard")}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl
                     hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]
                     font-medium text-lg flex items-center justify-center gap-2 group"
          >
            <Gift className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
            Send a Gift
          </button>
        </div>

        {/* Wallet Overview */}
        <Card className="p-6 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl shadow-xl
                      border border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Your Balance</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-3xl font-bold">$0.00</p>
              <p className="text-sm opacity-80">Available balance</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 
                               transition-all duration-300 rounded-xl py-3 text-sm font-medium hover:scale-105">
                <Plus className="h-4 w-4" />
                Add Money
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 
                               transition-all duration-300 rounded-xl py-3 text-sm font-medium hover:scale-105">
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
              className={`p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105
                        bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl`}
              onClick={() => navigate(action.route)}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`bg-${action.color}-100/80 p-3 rounded-xl`}>
                  <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="p-6 bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg">
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
