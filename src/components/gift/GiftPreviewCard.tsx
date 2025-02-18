
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Memory {
  id: string;
  imageUrl?: string;
  caption: string;
  date: Date;
}

interface GiftPreviewCardProps {
  messageVideo: string | null;
  amount: string;
  memories: Memory[];
}

export const GiftPreviewCard = ({ messageVideo, amount, memories }: GiftPreviewCardProps) => {
  const [currentFlip, setCurrentFlip] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const flipCard = (direction: 'left' | 'right') => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    if (direction === 'left' && currentFlip > 0) {
      setCurrentFlip(prev => prev - 1);
    } else if (direction === 'right' && currentFlip < 3) {
      setCurrentFlip(prev => prev + 1);
    }
    setTimeout(() => setIsFlipping(false), 1000);
  };

  return (
    <div className="relative flex items-center">
      <button 
        onClick={() => flipCard('left')} 
        className="absolute -left-16 text-3xl text-gray-700 hover:text-gray-900 transition-colors cursor-pointer z-10 disabled:opacity-50"
        disabled={currentFlip === 0 || isFlipping}
        aria-label="Previous side"
      >
        <ChevronLeft size={30} />
      </button>

      <div className="perspective-[1000px] w-[300px] h-[400px]">
        <div 
          className="relative w-full h-full transition-transform duration-1000 transform-style-3d cursor-pointer"
          style={{ transform: `rotateY(${currentFlip * -90}deg)` }}
        >
          {/* Front of card */}
          <Card className="absolute w-full h-full backface-hidden bg-gradient-to-br from-purple-100 to-pink-100 p-6 flex flex-col items-center justify-center text-center rounded-xl shadow-xl">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Happy Birthday!
            </div>
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-gray-600">You received a gift!</p>
            <p className="text-sm text-gray-500 mt-2">Tap the arrow to reveal</p>
          </Card>

          {/* Video message */}
          <Card 
            className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex flex-col justify-center items-center text-white rounded-xl shadow-xl"
            style={{ transform: 'rotateY(90deg) translateX(100%)', transformOrigin: 'left center' }}
          >
            <div className="text-2xl font-bold mb-4">Video Message</div>
            {messageVideo ? (
              <video 
                src={messageVideo} 
                className="w-full rounded-lg shadow-lg" 
                controls
              />
            ) : (
              <div className="w-full h-48 bg-white/10 rounded-lg flex items-center justify-center">
                <p className="text-white/70">Video message will appear here</p>
              </div>
            )}
          </Card>

          {/* Memories */}
          <Card 
            className="absolute w-full h-full backface-hidden bg-gradient-to-br from-pink-500 to-rose-600 p-6 flex flex-col justify-center items-center text-white rounded-xl shadow-xl"
            style={{ transform: 'rotateY(180deg) translateX(100%)', transformOrigin: 'left center' }}
          >
            <div className="text-2xl font-bold mb-4">Memories</div>
            {memories.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 w-full">
                {memories.slice(0, 4).map((memory) => (
                  <div 
                    key={memory.id} 
                    className="aspect-square rounded-lg overflow-hidden bg-white/10"
                  >
                    {memory.imageUrl ? (
                      <img 
                        src={memory.imageUrl} 
                        alt={memory.caption}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/70">
                        Photo
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-48 bg-white/10 rounded-lg flex items-center justify-center">
                <p className="text-white/70">Memories will appear here</p>
              </div>
            )}
          </Card>

          {/* Amount */}
          <Card 
            className="absolute w-full h-full backface-hidden bg-gradient-to-br from-green-500 to-emerald-600 p-6 flex flex-col justify-center items-center text-white rounded-xl shadow-xl"
            style={{ transform: 'rotateY(270deg) translateX(100%)', transformOrigin: 'left center' }}
          >
            <div className="text-2xl font-bold mb-4">Your Gift</div>
            <div className="text-6xl font-bold mb-4">${amount}</div>
            <p className="text-white/90">Tap to claim your gift</p>
          </Card>
        </div>
      </div>

      <button 
        onClick={() => flipCard('right')} 
        className="absolute -right-16 text-3xl text-gray-700 hover:text-gray-900 transition-colors cursor-pointer z-10 disabled:opacity-50"
        disabled={currentFlip === 3 || isFlipping}
        aria-label="Next side"
      >
        <ChevronRight size={30} />
      </button>
    </div>
  );
};
