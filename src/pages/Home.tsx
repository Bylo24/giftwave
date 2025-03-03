
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Search, Gift, Wallet, Plus, ArrowDown, UserPlus, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageContainer } from "@/components/layout/PageContainer";

const Home = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const { user } = useAuth();

  const handleSearch = () => {
    navigate("/contacts");
  };

  // Get user's first name from profile if available
  const getUserName = () => {
    if (!user) return "there";
    
    // Try to get name from user object or return friendly default
    const email = user.email || "";
    const nameFromEmail = email.split('@')[0];
    const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    
    return capitalizedName || "there";
  };

  return (
    <PageContainer className="bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2">
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

        <button 
          onClick={handleSearch}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-full text-gray-500 text-sm hover:bg-gray-200 transition-colors"
        >
          <Search className="h-5 w-5" />
          <span>Search contacts or invite friends</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Welcome Message */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-montserrat font-bold text-gray-900">
            Hey {getUserName()}, welcome back!
          </h1>
          <button
            onClick={() => navigate("/frontcard")}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:opacity-90 transition-opacity shadow-md font-medium text-lg flex items-center justify-center gap-2"
          >
            <Gift className="h-5 w-5" />
            Send a Gift
          </button>
        </div>

        {/* Wallet Overview */}
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Your Balance</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-4xl font-bold">$0.00</p>
              <p className="text-sm opacity-80">Available balance</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 transition-colors rounded-full py-3 text-sm font-medium">
                <Plus className="h-4 w-4" />
                Add Money
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 transition-colors rounded-full py-3 text-sm font-medium">
                <ArrowDown className="h-4 w-4" />
                Withdraw
              </button>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow border-0 rounded-2xl flex flex-col items-center justify-center gap-3 py-6"
            onClick={() => navigate("/my-gifts")}
          >
            <div className="bg-gray-100 p-3 rounded-full">
              <Gift className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-800">My Gifts</span>
          </Card>
          
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow border-0 rounded-2xl flex flex-col items-center justify-center gap-3 py-6"
            onClick={() => navigate("/contacts")}
          >
            <div className="bg-gray-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-800">Invite</span>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-5 rounded-2xl">
          <h3 className="font-medium text-gray-900 mb-4 text-lg">Recent Activity</h3>
          <div className="text-center text-sm text-gray-500 py-6">
            No recent transactions
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </PageContainer>
  );
};

export default Home;
