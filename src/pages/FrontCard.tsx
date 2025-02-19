
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useStickerManager } from "@/hooks/useStickerManager";
import { useGiftDesign } from "@/hooks/useGiftDesign";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StickerLayer } from "@/components/gift/StickerLayer";
import { PatternSelector } from "@/components/gift/PatternSelector";
import { ThemeSelector } from "@/components/gift/ThemeSelector";
import { BackgroundPattern } from "@/components/gift/FrontCard/BackgroundPattern";
import { CardContent } from "@/components/gift/FrontCard/CardContent";
import { StickerPicker } from "@/components/gift/FrontCard/StickerPicker";
import { LoadingState } from "@/components/gift/FrontCard/LoadingState";

const FrontCardContent = () => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const { selectedThemeOption, handlePatternChange, setSelectedThemeOption } = useTheme();
  const draftToken = localStorage.getItem('gift_draft_token');
  const { giftDesign, isLoading, error } = useGiftDesign(draftToken);
  
  const {
    placedStickers,
    selectedSticker,
    showStickers,
    setShowStickers,
    handleStickerClick,
    handleStickerDragEnd,
    handleStickerTap,
    handleStickerRemove,
    handleStickerRotate
  } = useStickerManager();

  useEffect(() => {
    const initializeDraft = async () => {
      if (!draftToken) {
        try {
          const { data, error } = await supabase
            .from('gift_designs')
            .insert([{}])
            .select()
            .single();

          if (error) throw error;
          localStorage.setItem('gift_draft_token', data.token);
          toast.success('Started new gift draft');
        } catch (err) {
          console.error('Error creating draft:', err);
          toast.error('Failed to start new gift draft');
        }
      }
    };

    initializeDraft();
  }, [draftToken]);

  const handleBackClick = () => {
    navigate('/home');
  };

  return (
    <>
      <LoadingState 
        isLoading={isLoading} 
        error={error} 
        onRetry={() => window.location.reload()} 
      />

      {!isLoading && !error && (
        <div 
          className="min-h-screen relative transition-colors duration-300"
          style={{ backgroundColor: selectedThemeOption.screenBgColor }}
        >
          <div className="absolute inset-0" 
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 10%, transparent 11%)',
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 15px 15px'
            }}
          />
          
          <div className="relative z-10 min-h-screen flex flex-col">
            <div className="flex items-center justify-between p-4">
              <button 
                onClick={handleBackClick}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              <ThemeSelector
                themes={[selectedThemeOption]}
                selectedTheme={selectedThemeOption}
                onThemeChange={setSelectedThemeOption}
              />
              
              <Button 
                onClick={() => navigate('/insideleftcard')}
                className="px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium shadow-lg hover:bg-white/95 transition-colors"
              >
                Next
              </Button>
            </div>

            <div className="flex-1 flex items-center justify-center px-4">
              <div 
                ref={cardRef}
                className={`${selectedThemeOption.bgColor} rounded-lg aspect-[3/4] w-full max-w-md shadow-lg p-8 transition-colors duration-300 relative card-container overflow-hidden`}
              >
                <BackgroundPattern pattern={selectedThemeOption.pattern} />
                
                <CardContent 
                  text={selectedThemeOption.text}
                  emoji={selectedThemeOption.emoji}
                  textColors={selectedThemeOption.textColors}
                />

                <StickerLayer
                  stickers={placedStickers}
                  selectedSticker={selectedSticker}
                  cardRef={cardRef}
                  onStickerTap={handleStickerTap}
                  onStickerDragEnd={handleStickerDragEnd}
                  onStickerRemove={handleStickerRemove}
                  onStickerRotate={handleStickerRotate}
                />
              </div>
            </div>

            <PatternSelector
              currentPattern={selectedThemeOption.pattern.type}
              onPatternChange={handlePatternChange}
            />

            <StickerPicker 
              showStickers={showStickers}
              setShowStickers={setShowStickers}
              onStickerClick={handleStickerClick}
            />
          </div>
        </div>
      )}
    </>
  );
};

export const FrontCard = () => {
  return (
    <ThemeProvider>
      <FrontCardContent />
    </ThemeProvider>
  );
};
