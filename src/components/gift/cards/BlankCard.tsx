
import { useRef } from "react";
import { Video, ArrowLeft } from "lucide-react";
import { ThemeOption, Sticker } from "@/types/gift";
import { StickerLayer } from "@/components/gift/StickerLayer";
import { PatternSelector } from "@/components/gift/PatternSelector";
import { useNavigate } from "react-router-dom";

interface BlankCardProps {
  selectedThemeOption: ThemeOption;
  messageVideo: File | null;
  placedStickers: Sticker[];
  selectedSticker: string | null;
  showStickers: boolean;
  stickerOptions: Array<{ emoji: string; name: string }>;
  onBack: () => void;
  onNext: () => void;
  onPatternChange: (type: 'dots' | 'grid' | 'waves' | 'none') => void;
  onShowStickers: (show: boolean) => void;
  onStickerClick: (emoji: string) => void;
  onStickerTap: (stickerId: string) => void;
  onStickerDragEnd: (event: any, info: any, stickerId: string) => void;
  onStickerRemove: (stickerId: string) => void;
  onStickerRotate: (stickerId: string, rotation: number) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setMessageVideo: (video: File | null) => void;
}

export const BlankCard = ({
  selectedThemeOption,
  messageVideo,
  placedStickers,
  selectedSticker,
  showStickers,
  stickerOptions,
  onBack,
  onNext,
  onPatternChange,
  onShowStickers,
  onStickerClick,
  onStickerTap,
  onStickerDragEnd,
  onStickerRemove,
  onStickerRotate,
  onFileChange,
  setMessageVideo
}: BlankCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
    <div className="min-h-screen flex flex-col z-10 relative">
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={() => navigate('/frontcard')}
          className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        
        <button 
          onClick={onNext}
          className="px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium shadow-lg hover:bg-white/95 transition-colors"
        >
          Next
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div 
          ref={cardRef}
          className={`${selectedThemeOption.bgColor} rounded-lg aspect-[3/4] w-full max-w-md shadow-lg p-8 transition-colors duration-300 relative overflow-hidden`}
        >
          <div 
            className="absolute inset-0 z-0" 
            style={getPatternStyle(selectedThemeOption.pattern)}
          />
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            {messageVideo ? (
              <div className="w-full h-full relative rounded-lg overflow-hidden">
                <video
                  className="w-full h-full object-cover rounded-lg"
                  src={URL.createObjectURL(messageVideo)}
                  controls
                  playsInline
                />
                <button 
                  onClick={() => setMessageVideo(null)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white/95 transition-colors"
                >
                  <span className="sr-only">Remove video</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <input 
                  type="file" 
                  accept="video/*"
                  capture="user"
                  className="hidden" 
                  id="video-upload"
                  onChange={onFileChange}
                />
                <label 
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/95 transition-colors">
                    <Video className="h-8 w-8 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    Add video message
                  </span>
                </label>
              </>
            )}
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
  );
};
