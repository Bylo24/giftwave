
import { useRef } from "react";
import { ThemeOption, Sticker, PatternType } from "@/types/gift";
import { StickerLayer } from "@/components/gift/StickerLayer";
import { PatternSelector } from "@/components/gift/PatternSelector";
import { ThemeSelector } from "@/components/gift/ThemeSelector";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FrontCardProps {
  selectedThemeOption: ThemeOption;
  placedStickers: Sticker[];
  selectedSticker: string | null;
  showStickers: boolean;
  stickerOptions: Array<{ emoji: string; name: string }>;
  onBack: () => void;
  onNext: () => void;
  onPatternChange: (type: PatternType) => void;
  onThemeChange: (theme: ThemeOption) => void;
  onShowStickers: (show: boolean) => void;
  onStickerClick: (emoji: string) => void;
  onStickerTap: (stickerId: string) => void;
  onStickerDragEnd: (event: any, info: any, stickerId: string) => void;
  onStickerRemove: (stickerId: string) => void;
  onStickerRotate: (stickerId: string, rotation: number) => void;
}

const colorOptions = [
  { name: 'Soft Peach', value: '#FDE1D3' },
  { name: 'Soft Orange', value: '#FEC6A1' },
  { name: 'Soft Pink', value: '#FFDEE2' },
  { name: 'Soft Purple', value: '#E5DEFF' },
  { name: 'Soft Blue', value: '#D3E4FD' },
  { name: 'Soft Green', value: '#F2FCE2' },
  { name: 'Soft Yellow', value: '#FEF7CD' },
  { name: 'Soft Gray', value: '#F1F0FB' },
];

export const FrontCard = ({
  selectedThemeOption,
  placedStickers,
  selectedSticker,
  showStickers,
  stickerOptions,
  onBack,
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
  const cardRef = useRef<HTMLDivElement>(null);

  const handleColorChange = (color: string) => {
    onThemeChange({
      ...selectedThemeOption,
      screenBgColor: color
    });
  };

  const getPatternStyle = (pattern: ThemeOption['pattern']) => {
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

  return (
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
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-10 px-4 rounded-full">
                  <div 
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: selectedThemeOption.screenBgColor }}
                  />
                  Background
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className="w-12 h-12 rounded-lg border-2 transition-all hover:scale-105"
                      style={{ 
                        backgroundColor: color.value,
                        borderColor: selectedThemeOption.screenBgColor === color.value ? '#000' : 'transparent'
                      }}
                      onClick={() => handleColorChange(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <ThemeSelector
              themes={[selectedThemeOption]}
              selectedTheme={selectedThemeOption}
              onThemeChange={onThemeChange}
            />
          </div>
          
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
            <div 
              className="absolute inset-0 z-0" 
              style={getPatternStyle(selectedThemeOption.pattern)}
            />
            
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

        <PatternSelector
          currentPattern={selectedThemeOption.pattern.type}
          onPatternChange={onPatternChange}
        />

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
