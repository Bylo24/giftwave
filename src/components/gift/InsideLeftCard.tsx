
import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { ThemeOption, PatternType, Sticker } from "@/types/gift";
import { StickerLayer } from "@/components/gift/StickerLayer";
import { PatternSelector } from "@/components/gift/PatternSelector";
import { ThemeSelector } from "@/components/gift/ThemeSelector";
import { MessageStep } from "@/components/gift/MessageStep";

interface InsideLeftCardProps {
  selectedThemeOption: ThemeOption;
  onBack: () => void;
  onNext: () => void;
}

const InsideLeftCard = ({ selectedThemeOption, onBack, onNext }: InsideLeftCardProps) => {
  const [placedStickers, setPlacedStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [showStickers, setShowStickers] = useState(false);
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const [isRecordingMessage, setIsRecordingMessage] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStickerClick = (emoji: string) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.random() * (rect.width - 80) + 40;
    const y = Math.random() * (rect.height - 80) + 40;

    setPlacedStickers(prev => [...prev, {
      id: `${emoji}-${Date.now()}`,
      emoji,
      x,
      y,
      rotation: Math.random() * 360
    }]);
    setShowStickers(false);
  };

  const handleDragEnd = (event: any, info: any, stickerId: string) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = info.point.x - rect.left;
    const y = info.point.y - rect.top;

    const maxX = rect.width - 40;
    const maxY = rect.height - 40;
    const constrainedX = Math.min(Math.max(0, x), maxX);
    const constrainedY = Math.min(Math.max(0, y), maxY);

    setPlacedStickers(prev =>
      prev.map(sticker =>
        sticker.id === stickerId
          ? { ...sticker, x: constrainedX, y: constrainedY }
          : sticker
      )
    );
  };

  const handleStickerTap = (stickerId: string) => {
    setSelectedSticker(selectedSticker === stickerId ? null : stickerId);
  };

  const handleRemoveSticker = (stickerId: string) => {
    setPlacedStickers(prev => prev.filter(sticker => sticker.id !== stickerId));
    setSelectedSticker(null);
  };

  const handleStickerRotate = (stickerId: string, newRotation: number) => {
    setPlacedStickers(prev =>
      prev.map(sticker =>
        sticker.id === stickerId
          ? { ...sticker, rotation: newRotation }
          : sticker
      )
    );
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
          
          <button 
            onClick={onNext}
            className="px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium shadow-lg hover:bg-white/95 transition-colors"
          >
            Next
          </button>
        </div>

        <div className="px-4 mb-6">
          <MessageStep
            messageVideo={messageVideo}
            setMessageVideo={setMessageVideo}
            isRecordingMessage={isRecordingMessage}
            startMessageRecording={() => setIsRecordingMessage(true)}
            stopMessageRecording={() => setIsRecordingMessage(false)}
            onNext={onNext}
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <div 
            ref={cardRef}
            className={`${selectedThemeOption.bgColor} rounded-lg aspect-[3/4] w-full max-w-md shadow-lg p-8 transition-colors duration-300 relative`}
          >
            <div className="relative z-10 h-full flex flex-col items-center justify-center space-y-8">
              <div className="w-full aspect-video bg-black/10 rounded-lg flex items-center justify-center overflow-hidden">
                {messageVideo ? (
                  <video
                    src={URL.createObjectURL(messageVideo)}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-500">Record or upload a video message</span>
                )}
              </div>
            </div>

            <StickerLayer
              stickers={placedStickers}
              selectedSticker={selectedSticker}
              cardRef={cardRef}
              onStickerTap={handleStickerTap}
              onStickerDragEnd={handleDragEnd}
              onStickerRemove={handleRemoveSticker}
              onStickerRotate={handleStickerRotate}
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pb-8">
          <div className="flex justify-center max-w-md mx-auto relative">
            <div className="relative group">
              <button 
                onClick={() => setShowStickers(!showStickers)}
                className="flex flex-col items-center space-y-1"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg group-hover:bg-white/95 transition-colors">
                  <span className="text-2xl">⭐</span>
                </div>
                <span className="text-xs text-white font-medium">Stickers</span>
              </button>
              
              {showStickers && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl grid grid-cols-5 gap-2 min-w-[200px]">
                  {[
                    { emoji: "⭐", name: "Star" },
                    { emoji: "💫", name: "Sparkle" },
                    { emoji: "✨", name: "Glitter" },
                    { emoji: "🌟", name: "Glow" },
                    { emoji: "💝", name: "Heart" },
                  ].map((sticker, index) => (
                    <button 
                      key={index}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white/50 rounded-full transition-colors"
                      onClick={() => handleStickerClick(sticker.emoji)}
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
    </div>
  );
};

export default InsideLeftCard;
