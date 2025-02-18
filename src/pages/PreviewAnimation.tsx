import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PatternType } from "@/types/gift";
import Confetti from 'react-confetti';
import { PreviewNavigationButtons } from "@/components/gift/preview/PreviewNavigationButtons";
import { PreviewCard } from "@/components/gift/preview/PreviewCard";
import { PreviewContainer } from "@/components/gift/preview/PreviewContainer";
import { GiftLoadingState } from "@/components/gift/GiftLoadingState";

const sampleThemeOption = {
  text: "Happy Birthday!",
  emoji: "🎉",
  bgColor: "bg-purple-100",
  screenBgColor: "#f3e8ff",
  textColors: ["text-purple-600"],
  pattern: {
    type: "dots" as PatternType,
    color: "rgba(147, 51, 234, 0.1)"
  }
};

const PreviewAnimation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const totalPages = 4;

  useEffect(() => {
    if (showConfetti) {
      // Start fading out after 1 second
      const fadeStartTimer = setTimeout(() => {
        setConfettiOpacity(0);
      }, 1000);

      // Remove confetti after fade completes
      const removeTimer = setTimeout(() => {
        setShowConfetti(false);
        setConfettiOpacity(1); // Reset opacity for next animation
      }, 1500);

      return () => {
        clearTimeout(fadeStartTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [showConfetti]);

  const nextPage = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setShowConfetti(true);
    setTimeout(() => setIsFlipping(false), 500);
  };

  const previousPage = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setShowConfetti(true);
    setTimeout(() => setIsFlipping(false), 500);
  };

  const getPatternStyle = (pattern: { type: PatternType; color: string }) => {
    switch (pattern.type) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle, ${pattern.color} 10%, transparent 11%)`,
          backgroundSize: '20px 20px'
        };
      case 'grid':
        return {
          backgroundImage: `linear-gradient(to right, ${pattern.color} 1px, transparent 1px),
                           linear-gradient(to bottom, ${pattern.color} 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        };
      case 'waves':
        return {
          backgroundImage: `repeating-linear-gradient(45deg, ${pattern.color} 0px, ${pattern.color} 2px,
                           transparent 2px, transparent 8px)`,
          backgroundSize: '20px 20px'
        };
      case 'none':
      default:
        return {};
    }
  };

  if (isLoading) {
    return <GiftLoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => navigate("/home")}>Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-8 py-12 sm:p-6">
      {showConfetti && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          opacity: confettiOpacity,
          transition: 'opacity 0.5s ease-out',
          pointerEvents: 'none'
        }}>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={150}
            gravity={0.5}
            initialVelocityY={15}
            colors={['#FF69B4', '#9370DB', '#4B0082', '#FF1493', '#8A2BE2']}
          />
        </div>
      )}
      <div className="w-full max-w-md relative">
        <PreviewNavigationButtons
          onPrevious={previousPage}
          onNext={nextPage}
          isFlipping={isFlipping}
        />
        
        <PreviewContainer
          currentPage={currentPage}
          onClick={nextPage}
        >
          {[0, 1, 2, 3].map((pageIndex) => (
            <div
              key={pageIndex}
              className="w-full h-full absolute bg-white rounded-xl shadow-xl"
              style={{
                transform: `rotateY(${pageIndex * 90}deg) translateZ(200px)`,
                backfaceVisibility: "hidden"
              }}
            >
              <PreviewCard
                pageIndex={pageIndex}
                themeOption={sampleThemeOption}
                getPatternStyle={getPatternStyle}
              />
            </div>
          ))}
        </PreviewContainer>
      </div>
    </div>
  );
};

export default PreviewAnimation;
