
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeOption, Sticker } from "@/types/gift";
import { StickerLayer } from "@/components/gift/StickerLayer";
import { PatternSelector } from "@/components/gift/PatternSelector";
import { ThemeSelector } from "@/components/gift/ThemeSelector";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FrontCardProps {
  selectedThemeOption: ThemeOption;
  placedStickers: Sticker[];
  selectedSticker: string | null;
  showStickers: boolean;
  stickerOptions: Array<{ emoji: string; name: string }>;
  onBack: () => void;
  onNext: () => void;
  onPatternChange: (type: 'dots' | 'grid' | 'waves' | 'none') => void;
  onThemeChange: (theme: ThemeOption) => void;
  onShowStickers: (show: boolean) => void;
  onStickerClick: (emoji: string) => void;
  onStickerTap: (stickerId: string) => void;
  onStickerDragEnd: (event: any, info: any, stickerId: string) => void;
  onStickerRemove: (stickerId: string) => void;
  onStickerRotate: (stickerId: string, rotation: number) => void;
}

export const FrontCard = ({
  selectedThemeOption,
  placedStickers,
  selectedSticker,
  showStickers,
  stickerOptions,
  onNext,
  onPatternChange,
  onThemeChange,
  onShowStickers,
  onStickerClick,
  onStickerTap,
  onStickerDragEnd,
  onStickerRemove,
  onStickerRotate
}: FrontCardProps) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleBackClick = () => {
    navigate('/home');
  };

  return (
    <div 
      className="min-h-screen relative transition-colors duration-300"
      style={{ 
        background: 'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)'
      }}
    >
      <div className="absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(138, 43, 226, 0.4) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(72, 61, 139, 0.4) 0%, transparent 40%)',
          filter: 'blur(30px)'
        }}
      />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={handleBackClick}
            className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <ThemeSelector
            themes={[selectedThemeOption]}
            selectedTheme={selectedThemeOption}
            onThemeChange={onThemeChange}
          />
          
          <Button 
            onClick={onNext}
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
            <div className="relative z-10 h-full flex flex-col items-center justify-center space-y-8 pointer-events-none">
              <div className="text-center">
                {selectedThemeOption.text.split('').map((letter, index) => (
                  <span 
                    key={index} 
                    className={`text-3xl sm:text-5xl md:text-8xl font-serif ${selectedThemeOption.textColors[index % selectedThemeOption.textColors.length]}`}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              
              <div className="text-4xl sm:text-5xl md:text-6xl animate-bounce">
                {selectedThemeOption.emoji}
              </div>
            </div>

            <StickerLayer
              stickers={placedStickers}
              selectedSticker={selectedSticker}
              cardRef={cardRef}
              onStickerTap={onStickerTap}
              onStickerDragEnd={onStickerDragEnd}
              onStickerRemove={onStickerRemove}
              onStickerRotate={onStickerRotate}
            />
          </div>
        </div>

        <div className="flex justify-center pb-8 relative">
          <div className="relative">
            <button 
              onClick={() => onShowStickers(!showStickers)}
              className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/95 transition-colors"
            >
              <span className="text-2xl">⭐</span>
            </button>
            
            {showStickers && (
              <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl grid grid-cols-5 gap-2 min-w-[200px]">
                {stickerOptions.map((sticker, index) => (
                  <button 
                    key={index}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white/50 rounded-full transition-colors"
                    onClick={() => onStickerClick(sticker.emoji)}
                  >
                    <span className="text-2xl">{sticker.emoji}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
