
import { useRef, useState, useEffect } from "react";
import { Video, Image, Star, DollarSign } from "lucide-react";
import { PatternType } from "@/types/gift";
import { GiftDesign } from "@/hooks/useGiftDesign";
import { Skeleton } from "@/components/ui/skeleton";

interface PreviewCardProps {
  pageIndex: number;
  themeOption: {
    text: string;
    emoji: string;
    bgColor: string;
    textColors: string[];
    pattern: {
      type: PatternType;
      color: string;
    };
  };
  getPatternStyle: (pattern: { type: PatternType; color: string }) => React.CSSProperties;
  giftDesign: GiftDesign;
}

export const PreviewCard = ({ 
  pageIndex, 
  themeOption, 
  getPatternStyle, 
  giftDesign 
}: PreviewCardProps) => {
  const [videoProgress, setVideoProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoProgress > 0) {
      videoRef.current.currentTime = videoProgress;
    }
  }, [videoProgress]);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      // Simulate content loading
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    };

    loadContent();
  }, [pageIndex]);

  const formatAmount = (amount: number | null) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoProgress(videoRef.current.currentTime);
    }
  };

  if (isLoading) {
    return (
      <div className={`${themeOption.bgColor} w-full h-full rounded-xl relative overflow-hidden`}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className={`${themeOption.bgColor} w-full h-full rounded-xl relative overflow-hidden`}>
      <div 
        className="absolute inset-0" 
        style={getPatternStyle(themeOption.pattern)}
      />
      
      {pageIndex === 0 ? (
        // Front card
        <div className="relative z-10 h-full flex flex-col items-center justify-center space-y-8 p-4">
          <div className="text-center">
            {themeOption.text.split('').map((letter, index) => (
              <span 
                key={index} 
                className={`text-2xl sm:text-3xl md:text-4xl font-serif ${themeOption.textColors[index % themeOption.textColors.length]}`}
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl animate-bounce">
            {themeOption.emoji}
          </div>
          {giftDesign.front_card_stickers?.map((sticker: any, index: number) => (
            <div
              key={`sticker-${index}-${sticker.emoji}`}
              style={{
                position: 'absolute',
                left: `${(sticker.x / window.innerWidth) * 100}%`,
                top: `${(sticker.y / window.innerHeight) * 100}%`,
                transform: `rotate(${sticker.rotation}deg)`,
                maxWidth: '15%',
                maxHeight: '15%'
              }}
              className="text-2xl pointer-events-none select-none"
            >
              {sticker.emoji}
            </div>
          ))}
        </div>
      ) : pageIndex === 1 ? (
        // Inside left - Video message
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
          {giftDesign.message_video_url ? (
            <video
              ref={videoRef}
              src={giftDesign.message_video_url}
              className="w-full h-full object-cover rounded-lg"
              controls
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current && videoProgress > 0) {
                  videoRef.current.currentTime = videoProgress;
                }
              }}
            />
          ) : (
            <>
              <div className="w-16 h-16 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg mb-4">
                <Video className="h-8 w-8 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                Video message
              </span>
            </>
          )}
        </div>
      ) : pageIndex === 2 ? (
        // Inside right - Memories
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
          {giftDesign.memories && giftDesign.memories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-h-[80vh] overflow-y-auto">
              {giftDesign.memories.slice(0, 6).map((memory: any, index: number) => (
                <div
                  key={`memory-${index}`}
                  className="aspect-square rounded-lg overflow-hidden bg-white shadow-md"
                >
                  {memory.imageUrl ? (
                    <img 
                      src={memory.imageUrl} 
                      alt={memory.caption}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="w-16 h-16 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg mb-4">
                <Image className="h-8 w-8 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                Photo memories
              </span>
              <div className="flex flex-col items-center justify-center mt-4">
                <Star className="h-6 w-6 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Add your first memory</p>
              </div>
            </>
          )}
        </div>
      ) : (
        // Back card - Amount
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg mb-4">
            <DollarSign className="h-8 w-8 text-gray-600" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-gray-700 mb-2">
              {formatAmount(giftDesign.selected_amount)}
            </span>
            <span className="text-sm font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
              Gift amount
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
