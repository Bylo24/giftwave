
import { Card } from "@/components/ui/card";
import { Gift, Calendar, Heart, PartyPopper, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Gift {
  id: string;
  sender: { full_name: string } | null;
  amount: number;
  created_at: string;
  sender_id: string;
}

interface MemoriesGridProps {
  gifts: Gift[];
}

export const MemoriesGrid = ({ gifts }: MemoriesGridProps) => {
  const navigate = useNavigate();

  const handleGiftReplay = (giftId: string) => {
    navigate(`/collect/${giftId}?replay=true`);
    toast.success("Opening gift preview...");
  };

  if (!gifts.length) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center space-y-4 bg-[#221F26]/50 border-gray-800 backdrop-blur-sm">
          <Gift className="h-12 w-12 mx-auto text-[#0EA5E9]" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">No Gifts Yet</h3>
            <p className="text-gray-400">
              When you receive gifts, they'll appear here
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gifts.map((gift) => (
          <Card 
            key={gift.id}
            className="group bg-[#221F26]/50 border-gray-800 hover:border-[#0EA5E9]/50 backdrop-blur-sm
                     transition-all duration-300 hover:shadow-lg hover:shadow-[#0EA5E9]/10 cursor-pointer
                     animate-fade-in"
            onClick={() => handleGiftReplay(gift.id)}
          >
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#0EA5E9]/10 rounded-full">
                      <Gift className="h-4 w-4 text-[#0EA5E9]" />
                    </div>
                    <span className="font-medium text-lg text-white">
                      {gift.sender?.full_name || "Anonymous"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(gift.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Badge className="bg-[#0EA5E9]/10 text-[#0EA5E9] border-0">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${gift.amount}
                </Badge>
              </div>

              {/* Preview */}
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#2A2533] to-[#221F26] p-4 border border-gray-800/50">
                <div className="absolute top-2 right-2">
                  <PartyPopper className="h-5 w-5 text-[#0EA5E9]" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-400">
                    This gift includes a special video message and memories
                  </p>
                </div>
              </div>

              {/* Action */}
              <Button 
                variant="ghost" 
                className="w-full group-hover:bg-[#0EA5E9]/10 transition-colors text-white"
              >
                <Heart className="h-4 w-4 mr-2 text-pink-500" />
                <span className="text-sm">Tap to replay this memory</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
