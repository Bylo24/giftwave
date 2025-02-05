import { Card } from "@/components/ui/card";
import { Gift, Calendar, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { demoGifts } from "@/utils/demoGifts";

export const MemoriesGrid = () => {
  const navigate = useNavigate();
  const memories = Object.values(demoGifts);

  const handleGiftReplay = (giftId: string) => {
    navigate(`/collect/${giftId}?replay=true`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Your Gift Memories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memories.map((memory) => (
          <Card 
            key={memory.id}
            className="p-4 hover:shadow-lg transition-shadow animate-fade-in cursor-pointer"
            onClick={() => handleGiftReplay(memory.id)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">{memory.sender}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(memory.date).toLocaleDateString()}</span>
                </div>
                <p className="text-lg font-bold">${memory.amount}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-pink-500">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Tap to replay this memory</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};