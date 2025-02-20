import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PatternType } from "@/types/gift";
import Confetti from 'react-confetti';
import { PreviewNavigationButtons } from "@/components/gift/preview/PreviewNavigationButtons";
import { PreviewCard } from "@/components/gift/preview/PreviewCard";
import { PreviewContainer } from "@/components/gift/preview/PreviewContainer";
import { GiftLoadingState } from "@/components/gift/GiftLoadingState";
import { GiftNotFound } from "@/components/gift/GiftNotFound";
import { useGiftDesign } from "@/hooks/useGiftDesign";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { colorPalettes } from "@/constants/colorPalettes";

const ANIMATION_DURATION = 500;
const CONFETTI_DURATION = 1500;

const RecipientGift = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  
  const isAnimatingRef = useRef(false);
  const pendingUpdateRef = useRef(false);
  const cleanupRef = useRef(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout>();
  const confettiTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const { 
    giftDesign, 
    isLoading: isLoadingGift, 
    error,
    isPreviewMode,
    isFinalized
  } = useGiftDesign(token);

  useEffect(() => {
    if (!token) {
      toast.error("No gift token provided");
      navigate("/");
      return;
    }

    return () => {
      cleanupRef.current = true;
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      confettiTimeoutRef.current.forEach(clearTimeout);
      confettiTimeoutRef.current = [];
    };
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      toast.error("Unable to load gift");
      console.error("Gift loading error:", error);
    }
  }, [error]);

  useEffect(() => {
    if (!isLoadingGift) {
      setIsLoading(false);
    }
  }, [isLoadingGift]);

  useEffect(() => {
    if (showConfetti && !cleanupRef.current) {
      const fadeStartTimeout = setTimeout(() => {
        if (!cleanupRef.current) {
          setConfettiOpacity(0);
        }
      }, CONFETTI_DURATION - 500);

      const removeTimeout = setTimeout(() => {
        if (!cleanupRef.current) {
          setShowConfetti(false);
          setConfettiOpacity(1);
          
          if (pendingUpdateRef.current) {
            pendingUpdateRef.current = false;
            setCurrentPage(curr => curr);
          }
        }
      }, CONFETTI_DURATION);

      confettiTimeoutRef.current = [fadeStartTimeout, removeTimeout];

      return () => {
        clearTimeout(fadeStartTimeout);
        clearTimeout(removeTimeout);
      };
    }
  }, [showConfetti]);

  const handlePageChange = (direction: 'next' | 'previous') => {
    if (isFlipping) return;
    
    isAnimatingRef.current = true;
    setIsFlipping(true);
    
    setCurrentPage((prev) => {
      if (direction === 'next') {
        return (prev + 1) % 4;
      }
      return (prev - 1 + 4) % 4;
    });

    if (!cleanupRef.current) {
      setShowConfetti(true);
    }

    animationTimeoutRef.current = setTimeout(() => {
      if (!cleanupRef.current) {
        setIsFlipping(false);
        isAnimatingRef.current = false;
      }
    }, ANIMATION_DURATION);
  };

  const nextPage = () => handlePageChange('next');
  const previousPage = () => handlePageChange('previous');

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

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">No gift token provided</p>
        <Button 
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Return Home
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <GiftLoadingState />;
  }

  if (error || !giftDesign) {
    return <GiftNotFound />;
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-6 md:px-8 md:py-12 transition-colors duration-300 bg-white"
      style={{ backgroundColor: giftDesign.screen_bg_color }}
    >
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
      
      <div className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-md relative mx-auto">
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
              key={`${pageIndex}-${giftDesign.id}`}
              className="w-full h-full absolute rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-transform duration-500"
              style={{
                transform: `rotateY(${pageIndex * 90}deg) translateZ(200px)`,
                backfaceVisibility: "hidden",
                backgroundColor: giftDesign.card_bg_color
              }}
            >
              <PreviewCard
                pageIndex={pageIndex}
                themeOption={{
                  text: "Happy Birthday!",
                  emoji: "🎉",
                  bgColor: giftDesign.card_bg_color,
                  textColors: ["text-purple-600"],
                  pattern: {
                    type: (giftDesign.front_card_pattern as PatternType) || "dots",
                    color: "rgba(147, 51, 234, 0.1)"
                  }
                }}
                getPatternStyle={getPatternStyle}
                giftDesign={giftDesign}
              />
            </div>
          ))}
        </PreviewContainer>
      </div>
    </div>
  );
};

export default RecipientGift;
