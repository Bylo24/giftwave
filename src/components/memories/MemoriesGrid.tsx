import { Card } from "@/components/ui/card";
import { Gift, Calendar, Heart, PartyPopper, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { demoGifts } from "@/utils/demoGifts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const MemoriesGrid = () => {
  const navigate = useNavigate();
  const memories = Object.values(demoGifts);

  const handleGiftReplay = (giftId: string) => {
    navigate(`/collect/${giftId}?replay=true`);
    toast.success("Opening gift preview...");
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Your Gift Memories
        </h2>
        <p className="text-muted-foreground">Tap on a gift to replay the memory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memories.map((memory) => (
          <Card 
            key={memory.id}
            className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer group"
            onClick={() => handleGiftReplay(memory.id)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Gift className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="font-medium text-lg">{memory.sender}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(memory.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {memory.amount}
                </Badge>
              </div>

              {/* Preview */}
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                <div className="absolute top-2 right-2">
                  <PartyPopper className="h-5 w-5 text-purple-400" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    This gift includes a special video message and memories
                  </p>
                </div>
              </div>

              {/* Action */}
              <Button 
                variant="ghost" 
                className="w-full group-hover:bg-purple-50 transition-colors"
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