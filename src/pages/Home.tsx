
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Search, Gift, Wallet, Plus, ArrowDown, UserPlus, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentCard } from "@/components/layout/ContentCard";
import { AnimatedContainer } from "@/components/layout/AnimatedContainer";

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
    <PageContainer className="bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-gray-50 z-10 pb-4">
        <div className="flex items-center justify-between mb-6">
          <AnimatedContainer animation="fade-in" delay={100}>
            <img 
              src="/lovable-uploads/d0eaee07-4183-4bee-82ec-c2b979790c51.png"
              alt="GiftWave Logo"
              className="h-8 w-auto"
            />
          </AnimatedContainer>
          <div className="flex items-center gap-3">
            <AnimatedContainer animation="fade-in" delay={200}>
              <button 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => navigate("/profile")}
              >
                <Settings className="h-5 w-5 text-gray-700" />
              </button>
            </AnimatedContainer>
            <AnimatedContainer animation="fade-in" delay={250}>
              <button 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => navigate("/notifications")}
              >
                <Bell className="h-5 w-5 text-gray-700" />
              </button>
            </AnimatedContainer>
          </div>
        </div>

        <AnimatedContainer animation="fade-in" delay={300}>
          <button 
            onClick={handleSearch}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-full border border-gray-200 text-gray-500 text-sm hover:border-gray-300 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Search contacts or invite friends</span>
          </button>
        </AnimatedContainer>
      </div>

      {/* Main Content */}
      <div className="space-y-6 pb-24">
        {/* Welcome Message */}
        <AnimatedContainer animation="fade-in" delay={400}>
          <div className="text-left mb-4">
            <h1 className="text-2xl font-medium text-gray-900">
              Hey {getUserName()},
            </h1>
            <p className="text-gray-500">Welcome back!</p>
          </div>
        </AnimatedContainer>

        {/* Send Gift Button */}
        <AnimatedContainer animation="slide-up" delay={500}>
          <button
            onClick={() => navigate("/frontcard")}
            className="w-full px-6 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm font-medium text-lg flex items-center justify-center gap-2"
          >
            <Gift className="h-5 w-5" />
            Send a Gift
          </button>
        </AnimatedContainer>

        {/* Wallet Overview */}
        <AnimatedContainer animation="fade-in" delay={600}>
          <ContentCard variant="glass" className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="h-6 w-6" />
              <h2 className="text-lg font-medium">Your Balance</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-4xl font-semibold">$0.00</p>
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
          </ContentCard>
        </AnimatedContainer>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <AnimatedContainer animation="slide-up" delay={700}>
            <ContentCard 
              variant="glass"
              className="p-5 text-center" 
              interactive={true}
              onClick={() => navigate("/my-gifts")}
            >
              <div className="bg-blue-100 p-3 rounded-full inline-flex items-center justify-center mb-3">
                <Gift className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-800 block">My Gifts</span>
            </ContentCard>
          </AnimatedContainer>
          
          <AnimatedContainer animation="slide-up" delay={800}>
            <ContentCard 
              variant="glass" 
              className="p-5 text-center"
              interactive={true}
              onClick={() => navigate("/contacts")}
            >
              <div className="bg-blue-100 p-3 rounded-full inline-flex items-center justify-center mb-3">
                <UserPlus className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-800 block">Invite</span>
            </ContentCard>
          </AnimatedContainer>
        </div>

        {/* Recent Activity */}
        <AnimatedContainer animation="fade-in" delay={900}>
          <ContentCard variant="default" className="p-5">
            <h3 className="font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="text-center text-sm text-gray-500 py-6">
              No recent transactions
            </div>
          </ContentCard>
        </AnimatedContainer>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </PageContainer>
  );
};

export default Home;
