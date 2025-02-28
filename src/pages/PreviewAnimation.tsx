
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PatternType, ThemeOption } from "@/types/gift";
import { PreviewNavigationButtons } from "@/components/gift/preview/PreviewNavigationButtons";
import { PreviewCard } from "@/components/gift/preview/PreviewCard";
import { PreviewContainer } from "@/components/gift/preview/PreviewContainer";
import { ColorPaletteSelector } from "@/components/gift/preview/ColorPaletteSelector";
import { ConfettiOverlay } from "@/components/gift/preview/ConfettiOverlay";
import { GiftLoadingState } from "@/components/gift/GiftLoadingState";
import { GiftNotFound } from "@/components/gift/GiftNotFound";
import { useGiftDesign } from "@/hooks/useGiftDesign";
import { useGiftPayment } from "@/hooks/useGiftPayment";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { colorPalettes } from "@/constants/colorPalettes";
import { supabase } from "@/integrations/supabase/client";
import { themeOptions } from "@/constants/giftOptions";

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
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>(themeOptions[0]);
  
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

  const { handleProceedToPayment } = useGiftPayment();

  // Load the saved theme from gift design
  useEffect(() => {
    if (giftDesign?.theme) {
      const savedTheme = themeOptions.find(t => t.text === giftDesign.theme);
      if (savedTheme) {
        console.log("Loaded theme from gift design:", savedTheme.text);
        setCurrentTheme(savedTheme);
      }
    }
  }, [giftDesign?.theme]);

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
      <ColorPaletteSelector
        selectedPaletteIndex={selectedPaletteIndex}
        onPaletteChange={handlePaletteChange}
      />

      <ConfettiOverlay
        show={showConfetti}
        opacity={confettiOpacity}
      />
      
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
                themeOption={currentTheme}
                getPatternStyle={getPatternStyle}
                giftDesign={giftDesign}
              />
            </div>
          ))}
        </PreviewContainer>
      </div>

      <div className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-md mx-auto mt-auto pt-12">
        <Button
          onClick={() => handleProceedToPayment(token, giftDesign)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
};

export default PreviewAnimation;
