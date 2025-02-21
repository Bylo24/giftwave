
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
import { supabase } from "@/integrations/supabase/client";

const ANIMATION_DURATION = 500;
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
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState(0);
  const [bgColor, setBgColor] = useState(colorPalettes[0].screenBg);
  const [cardBgColor, setCardBgColor] = useState(colorPalettes[0].cardBg);
  
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

  useEffect(() => {
    if (giftDesign?.screen_bg_color) {
      const paletteIndex = colorPalettes.findIndex(p => 
        p.screenBg.toLowerCase() === giftDesign.screen_bg_color.toLowerCase() &&
        p.cardBg.toLowerCase() === giftDesign.card_bg_color.toLowerCase()
      );
      
      if (paletteIndex !== -1) {
        setSelectedPaletteIndex(paletteIndex);
      }
      
      setBgColor(giftDesign.screen_bg_color);
      setCardBgColor(giftDesign.card_bg_color);
    }
  }, [giftDesign?.screen_bg_color, giftDesign?.card_bg_color]);

  const handlePaletteChange = async (index: number) => {
    const newPalette = colorPalettes[index];
    setSelectedPaletteIndex(index);
    setBgColor(newPalette.screenBg);
    setCardBgColor(newPalette.cardBg);

    if (!token) return;

    try {
      const { error: updateError } = await supabase
        .from('gift_designs')
        .update({ 
          screen_bg_color: newPalette.screenBg,
          card_bg_color: newPalette.cardBg
        })
        .eq('token', token);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error updating colors:', err);
      toast.error('Failed to save color palette');
      
      const prevPalette = colorPalettes[selectedPaletteIndex];
      setBgColor(prevPalette.screenBg);
      setCardBgColor(prevPalette.cardBg);
      setSelectedPaletteIndex(selectedPaletteIndex);
    }
  };

  useEffect(() => {
    if (giftDesign?.screen_bg_color) {
      console.log('Updating background color to:', giftDesign.screen_bg_color);
      setBgColor(giftDesign.screen_bg_color);
    }
    if (giftDesign?.card_bg_color) {
      console.log('Updating card background color to:', giftDesign.card_bg_color);
      setCardBgColor(giftDesign.card_bg_color);
    }
  }, [giftDesign?.screen_bg_color, giftDesign?.card_bg_color]);

  useEffect(() => {
    if (giftDesign && !isPreviewMode && !isFinalized && giftDesign.status === 'draft') {
      startEditing();
    }
  }, [giftDesign, isPreviewMode, isFinalized, startEditing]);

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

  useEffect(() => {
    if (error) {
      toast.error("Unable to load gift preview");
      console.error("Gift preview error:", error);
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

  const handleContinue = async () => {
    if (!token || !giftDesign) {
      toast.error("Gift details not found");
      return;
    }

    // Check if we have a valid amount
    if (!giftDesign.selected_amount || giftDesign.selected_amount <= 0) {
      toast.error("Please select a gift amount first");
      navigate(`/select-amount?token=${token}`);
      return;
    }

    try {
      const loadingToast = toast.loading("Preparing checkout...");

      const { data: sessionData, error: checkoutError } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: { 
            giftId: giftDesign.id,
            amount: giftDesign.selected_amount,
            token: token
          }
        }
      );

      toast.dismiss(loadingToast);

      if (checkoutError || !sessionData) {
        console.error('Checkout error:', checkoutError);
        toast.error("Failed to create checkout session");
        return;
      }

      const checkoutUrl = sessionData.url;
      if (!checkoutUrl) {
        console.error('No URL in session data:', sessionData);
        toast.error("Invalid checkout response");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error("Failed to start checkout process");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">No gift token provided</p>
        <Button 
          onClick={() => navigate("/frontcard")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Start New Gift
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

  if (!isPreviewMode && !isFinalized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-amber-600 mb-4">This gift is still being edited</p>
        <Button 
          onClick={() => navigate("/frontcard")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Start New Gift
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center px-4 pb-8 pt-8 md:px-8 transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      {/* Color palette selector */}
      <div className="mb-8 w-[85vw] max-w-[360px]">
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20">
          <h3 className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Color Theme
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {colorPalettes.map((palette, index) => (
              <button
                key={palette.name}
                onClick={() => handlePaletteChange(index)}
                className={`group flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${
                  selectedPaletteIndex === index 
                    ? 'bg-purple-50 shadow-sm scale-[0.98]' 
                    : 'hover:bg-gray-50/50 hover:scale-[1.02]'
                }`}
              >
                <div 
                  className={`w-6 h-6 rounded-lg border-2 transition-shadow duration-300 ${
                    selectedPaletteIndex === index 
                      ? 'border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.35)]' 
                      : 'border-gray-200 group-hover:border-purple-200'
                  }`}
                  style={{ backgroundColor: palette.screenBg }}
                />
                <span className={`text-xs transition-colors duration-300 ${
                  selectedPaletteIndex === index 
                    ? 'text-purple-700' 
                    : 'text-gray-600 group-hover:text-gray-800'
                }`}>
                  {palette.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

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
      
      {/* Main content container */}
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
                backgroundColor: cardBgColor
              }}
            >
              <PreviewCard
                pageIndex={pageIndex}
                themeOption={{
                  text: "Happy Birthday!",
                  emoji: "🎉",
                  bgColor: cardBgColor,
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

      {/* Continue button */}
      <div className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-md mx-auto mt-auto pt-12">
        <Button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default PreviewAnimation;
