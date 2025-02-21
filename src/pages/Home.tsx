
import { Card } from "@/components/ui/card";
import { Search, Gift, Wallet, Plus, ArrowDown, UserPlus, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BottomNav } from "@/components/ui/bottom-nav";

const Home = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const { user } = useAuth();

  const handleSearch = () => {
    navigate("/contacts");
  };

  const quickActions = [
    { icon: Gift, label: "My Gifts", route: "/my-gifts", gradientFrom: "from-pink-500", gradientTo: "to-rose-500" },
    { icon: UserPlus, label: "Invite", route: "/contacts", gradientFrom: "from-blue-500", gradientTo: "to-indigo-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-6 pb-3 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-5">
          <img 
            src="/lovable-uploads/d0eaee07-4183-4bee-82ec-c2b979790c51.png"
            alt="GiftWave Logo"
            className="h-8 w-auto"
          />
          <div className="flex items-center gap-3">
            <button 
              className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => navigate("/profile")}
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <button 
              className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <button 
          onClick={handleSearch}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-100 rounded-2xl text-gray-500 text-sm hover:bg-gray-200 transition-colors"
        >
          <Search className="h-5 w-5" />
          <span>Search contacts or invite friends</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 space-y-8 pb-24">
        {/* Hero Section */}
        <div className="text-center space-y-5">
          <h1 className="text-2xl font-semibold text-gray-900 px-4">
            Send Money As A Gift,<br />With A Personal Touch!
          </h1>
          <button
            onClick={() => navigate("/frontcard")}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:opacity-95 transition-all duration-200 shadow-lg hover:shadow-purple-200/50 font-medium text-lg flex items-center justify-center gap-2 transform hover:scale-[1.02]"
          >
            <Gift className="h-6 w-6" />
            Send a Gift
          </button>
        </div>

        {/* Wallet Overview */}
        <Card className="p-6 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 text-white rounded-3xl border-0 shadow-xl shadow-blue-200/20">
          <div className="flex items-center gap-3 mb-5">
            <Wallet className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Your Balance</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-3xl font-bold">$0.00</p>
              <p className="text-sm opacity-90">Available balance</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 transition-all duration-200 rounded-xl py-2.5 text-sm font-medium backdrop-blur-sm">
                <Plus className="h-4 w-4" />
                Add Money
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 transition-all duration-200 rounded-xl py-2.5 text-sm font-medium backdrop-blur-sm">
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
              className="p-5 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br border-0 rounded-2xl transform hover:scale-[1.02]"
              onClick={() => navigate(action.route)}
              style={{
                background: `linear-gradient(135deg, ${action.gradientFrom.replace('from-', '')} 0%, ${action.gradientTo.replace('to-', '')} 100%)`
              }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-white">{action.label}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="p-6 rounded-2xl border-0 shadow-md bg-white">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center text-sm text-gray-500 py-8">
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
