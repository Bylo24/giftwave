
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GiftPreviewAnimation } from "@/components/gift/GiftPreviewAnimation";

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

  const flipCard = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentFlip > 0) {
      setCurrentFlip(prev => prev - 1);
    } else if (direction === 'right' && currentFlip < 1) {
      setCurrentFlip(prev => prev + 1);
    }
  };

  const handleCardClick = () => {
    setCurrentFlip(prev => prev === 0 ? 1 : 0);
  };

  return (
    <div className="relative flex items-center">
      <button 
        onClick={() => flipCard('left')} 
        className="absolute -left-16 text-3xl text-gray-700 hover:text-gray-900 transition-colors cursor-pointer z-10"
        aria-label="Flip left"
      >
        <ChevronLeft size={30} />
      </button>

      <div className="perspective-[1000px]">
        <div 
          onClick={handleCardClick}
          className="w-[300px] h-[400px] transform-style-3d transition-transform duration-1000 cursor-pointer"
          style={{ transform: `rotateY(${currentFlip * -180}deg)` }}
        >
          <div className="absolute w-full h-full backface-hidden">
            <GiftPreviewAnimation
              messageVideo={messageVideo}
              messageVideoType="url"
              amount={amount}
              memories={memories}
              onComplete={() => {}}
            />
          </div>
          
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center text-xl font-bold text-white rotate-y-180 rounded-lg shadow-xl">
            <span className="text-4xl mb-2">Amount</span>
            <span className="text-6xl">${amount || 0}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => flipCard('right')} 
        className="absolute -right-16 text-3xl text-gray-700 hover:text-gray-900 transition-colors cursor-pointer z-10"
        aria-label="Flip right"
      >
        <ChevronRight size={30} />
      </button>
    </div>
  );
};
