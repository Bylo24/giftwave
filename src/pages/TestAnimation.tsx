
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TestAnimation = () => {
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
    <PageContainer>
      <PageHeader title="Animation Test" />
      <div className="flex justify-center items-center min-h-[600px] bg-gray-100 p-4" data-testid="animation-container">
        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button 
            onClick={() => flipCard('left')} 
            className="absolute -left-16 text-3xl text-gray-700 hover:text-gray-900 transition-colors cursor-pointer z-10"
            aria-label="Flip left"
          >
            <ChevronLeft size={30} />
          </button>

          {/* Card Container */}
          <div className="perspective-[1000px]">
            <div 
              onClick={handleCardClick}
              className="w-[300px] h-[400px] transform-style-3d transition-transform duration-1000 cursor-pointer"
              style={{ transform: `rotateY(${currentFlip * -180}deg)` }}
            >
              {/* Front of Card */}
              <div className="absolute w-full h-full backface-hidden bg-[#f8b400] flex justify-center items-center text-2xl font-bold text-white">
                <span>Front of the Card</span>
              </div>
              
              {/* Back of Card */}
              <div className="absolute w-full h-full backface-hidden bg-[#4CAF50] flex justify-center items-center text-xl font-bold text-white rotate-y-180">
                <span>$50</span>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => flipCard('right')} 
            className="absolute -right-16 text-3xl text-gray-700 hover:text-gray-900 transition-colors cursor-pointer z-10"
            aria-label="Flip right"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default TestAnimation;
