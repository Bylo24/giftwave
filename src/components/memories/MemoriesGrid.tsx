import { Card } from "@/components/ui/card";
import { Gift, Calendar, Heart } from "lucide-react";

interface Memory {
  id: string;
  sender: string;
  amount: number;
  date: string;
  message?: string;
  videoUrl?: string;
  imageUrl?: string;
}

const mockMemories: Memory[] = [
  {
    id: "1",
    sender: "John Doe",
    amount: 50,
    date: "2024-02-14",
    message: "Happy Birthday! 🎉",
  },
  {
    id: "2",
    sender: "Jane Smith",
    amount: 100,
    date: "2024-01-01",
    message: "For your special day!",
  },
];

export const MemoriesGrid = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Gift Memories
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockMemories.map((memory) => (
          <Card 
            key={memory.id}
            className="p-4 hover:shadow-lg transition-shadow animate-fade-in"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="font-medium text-purple-600">{memory.sender}</p>
                <p className="text-2xl font-bold">${memory.amount}</p>
                <p className="text-gray-600">{memory.message}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <p className="text-sm text-gray-400">
                  {new Date(memory.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-pink-500">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Tap to revisit this memory</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};