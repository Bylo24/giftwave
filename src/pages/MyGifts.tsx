import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Gift } from "lucide-react";

const MyGifts = () => {
  const gifts: any[] = []; // This would normally come from your backend

  return (
    <div className="min-h-screen bg-[#E5DEFF] pb-16">
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1A1F2C] text-center">My Gifts</h1>
        
        {gifts.length === 0 ? (
          <Card className="p-8 text-center space-y-4 border-[#9b87f5]">
            <Gift className="w-16 h-16 mx-auto text-[#9b87f5]" />
            <p className="text-lg text-[#6E59A5]">
              Sorry, you don't have any gifts yet :( :(
            </p>
            <p className="text-sm text-[#7E69AB]">
              When someone sends you a gift, it will appear here!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {gifts.map((gift) => (
              <Card key={gift.id} className="p-4 border-[#9b87f5]">
                {/* Gift card content would go here */}
              </Card>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default MyGifts;