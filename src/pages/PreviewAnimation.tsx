
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

const ANIMATION_DURATION = 500; // Match with CSS transition duration
const CONFETTI_DURATION = 1500;

const PreviewAnimation = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  
  // Use refs to track animation and cleanup state
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
    isFinalized,
    startEditing
  } = useGiftDesign(token);

  // Initialize edit session if needed
  useEffect(() => {
    if (giftDesign && !isPreviewMode && !isFinalized && giftDesign.status === 'draft') {
      startEditing();
    }
  }, [giftDesign, isPreviewMode, isFinalized, startEditing]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    if (!token) {
      toast.error("No gift token provided");
      navigate("/frontcard");
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

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error("Unable to load gift preview");
      console.error("Gift preview error:", error);
    }
  }, [error]);

  // Update loading state
  useEffect(() => {
    if (!isLoadingGift) {
      setIsLoading(false);
    }
  }, [isLoadingGift]);

  // Handle confetti animation
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

  // Handle missing token
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">No gift token provided</p>
        <button 
          onClick={() => navigate("/frontcard")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Start New Gift
        </button>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return <GiftLoadingState />;
  }

  // Handle errors or missing data
  if (error || !giftDesign) {
    return <GiftNotFound />;
  }

  // Check for incomplete gift
  if (giftDesign.status !== 'preview' && !isFinalized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-amber-600 mb-4">This gift is still being edited</p>
        <button 
          onClick={() => navigate("/frontcard")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Start New Gift
        </button>
      </div>
    );
  }

  // Theme configuration
  const themeOption = {
    text: "Happy Birthday!",
    emoji: "🎉",
    bgColor: "bg-purple-100",
    screenBgColor: "#f3e8ff",
    textColors: ["text-purple-600"],
    pattern: {
      type: (giftDesign.front_card_pattern as PatternType) || "dots",
      color: "rgba(147, 51, 234, 0.1)"
    }
  };

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
              key={`${pageIndex}-${giftDesign.id}`}
              className="w-full h-full absolute bg-white rounded-xl shadow-xl"
              style={{
                transform: `rotateY(${pageIndex * 90}deg) translateZ(200px)`,
                backfaceVisibility: "hidden"
              }}
            >
              <PreviewCard
                pageIndex={pageIndex}
                themeOption={themeOption}
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

export default PreviewAnimation;
