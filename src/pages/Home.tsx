import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Search, Gift, Heart } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Search Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              className="pl-10 bg-gray-50" 
              placeholder="Search profiles or add contacts" 
            />
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome to Swift Pay!
          </h1>
          <p className="text-sm text-gray-500">
            What would you like to do first?
          </p>
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex justify-center">
              <Gift className="h-12 w-12 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="font-medium">Make your first payment</h2>
              <p className="text-sm text-gray-500">
                Send someone a gift
              </p>
              <Button variant="outline" className="w-full">
                Get started
              </Button>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-4">
            <div className="bg-pink-50 p-2 rounded-full">
              <Heart className="h-6 w-6 text-pink-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Enter your promo code</h3>
              <p className="text-sm text-gray-500">Have a code? Enter it here</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Home;