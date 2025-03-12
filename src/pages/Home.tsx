
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Search, Gift, Wallet, Plus, ArrowDown, UserPlus, Settings, Bell, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, CSSProperties } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentCard } from "@/components/layout/ContentCard";
import { Button } from "@/components/ui/button";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";

const Home = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const { user } = useAuth();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading to demonstrate animations
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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

  // Animation delay for staggered items
  const getStaggerDelay = (index: number): CSSProperties => {
    return { animationDelay: `${index * 100}ms` };
  };

  return (
    <PageContainer className="bg-white">
      <PullToRefresh />
      
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2 slide-down">
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
          className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-full text-gray-500 text-sm hover:bg-gray-200 transition-colors slide-in-left"
        >
          <Search className="h-5 w-5" />
          <span>Search contacts or invite friends</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Welcome Message */}
        <div className={`text-left space-y-6 ${loaded ? 'slide-up' : 'opacity-0'}`}>
          <h1 className="text-2xl font-montserrat font-bold text-gray-900">
            Hey {getUserName()}, welcome back!
          </h1>
          <button
            onClick={() => navigate("/frontcard")}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:opacity-90 transition-all duration-300 shadow-md font-medium text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:from-blue-600 hover:to-blue-700"
          >
            <Gift className="h-5 w-5" />
            Send a Gift
          </button>
        </div>

        {/* Wallet Overview */}
        <ContentCard 
          variant="primary" 
          className={`p-6 ${loaded ? 'pop-in' : 'opacity-0'}`}
          interactive
          onClick={() => navigate("/wallet")}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-full">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold">Your Balance</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-4xl font-bold">$0.00</p>
              <p className="text-sm opacity-80">Available balance</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                className="flex items-center justify-center gap-2 hover:bg-white/50 transition-colors rounded-full py-3 text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/wallet?action=add");
                }}
              >
                <Plus className="h-4 w-4" />
                Add Money
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 hover:bg-white/50 transition-colors rounded-full py-3 text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/wallet?action=withdraw");
                }}
              >
                <ArrowDown className="h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </div>
        </ContentCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <ContentCard 
            variant="glass"
            className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 py-6 ${loaded ? 'stagger-item stagger-appear' : 'opacity-0'}`}
            style={getStaggerDelay(0)}
            interactive
            onClick={() => navigate("/my-gifts")}
          >
            <div className="bg-blue-100 p-3 rounded-full">
              <Gift className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-800">My Gifts</span>
          </ContentCard>
          
          <ContentCard 
            variant="glass"
            className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 py-6 ${loaded ? 'stagger-item stagger-appear' : 'opacity-0'}`}
            style={getStaggerDelay(1)}
            interactive
            onClick={() => navigate("/contacts")}
          >
            <div className="bg-blue-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-800">Invite</span>
          </ContentCard>
        </div>

        {/* Recent Activity */}
        <ContentCard 
          variant="default" 
          className={`p-5 rounded-2xl ${loaded ? 'stagger-item stagger-appear' : 'opacity-0'}`}
          style={getStaggerDelay(2)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 text-lg">Recent Activity</h3>
            <Button 
              variant="ghost" 
              className="text-blue-600 p-2"
              size="sm"
              onClick={() => navigate("/my-gifts")}
            >
              <span className="text-sm">View All</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="text-center text-sm text-gray-500 py-6">
            <p className="mb-2">No recent transactions</p>
            <p className="text-blue-600">Send your first gift to get started!</p>
          </div>
        </ContentCard>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </PageContainer>
  );
};

export default Home;
