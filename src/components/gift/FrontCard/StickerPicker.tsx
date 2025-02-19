
import { stickerOptions } from "@/constants/giftOptions";

interface StickerPickerProps {
  showStickers: boolean;
  setShowStickers: (show: boolean) => void;
  onStickerClick: (emoji: string) => void;
}

export const StickerPicker = ({ 
  showStickers, 
  setShowStickers, 
  onStickerClick 
}: StickerPickerProps) => {
  return (
    <div className="flex justify-center pb-8 relative">
      <div className="relative">
        <button 
          onClick={() => setShowStickers(!showStickers)}
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
  );
};
