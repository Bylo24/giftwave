import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiftPreviewCard } from "@/components/gift/GiftPreviewCard";
import { GiftRevealAnimation } from "@/components/gift/GiftRevealAnimation";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const sampleThemeOption = {
  text: "Happy Birthday!",
  emoji: "🎉",
  bgColor: "bg-purple-100",
  screenBgColor: "#f3e8ff",
  textColors: ["text-purple-600"],
  pattern: {
    type: "dots" as const,
    color: "rgba(147, 51, 234, 0.1)"
  }
};

const PreviewAnimation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gift, setGift] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const navigate = useNavigate();

  const totalPages = 3;

  useEffect(() => {
    const loadGift = async () => {
      try {
        const giftId = '12345678-1234-1234-1234-123456789abc';
        
        console.log("Starting gift load...");
        console.log("Using gift ID:", giftId);

        const { data: giftData, error: giftError } = await supabase
          .from('gifts')
          .select(`
            *,
            sender:profiles(full_name),
            gift_memories(*)
          `)
          .eq('id', giftId)
          .maybeSingle();

        if (giftError) {
          console.error("Supabase error:", giftError);
          setError("Failed to load gift");
          return;
        }

        console.log("Raw gift data:", giftData);

        if (!giftData) {
          console.log("No gift data returned from query");
          setError("Gift not found");
          return;
        }

        const formattedMemories = giftData.gift_memories?.map((memory: any) => ({
          id: memory.id,
          imageUrl: memory.image_url,
          caption: memory.caption,
          date: new Date(memory.date)
        })) || [];

        console.log("Formatted memories:", formattedMemories);

        const formattedGift = {
          ...giftData,
          memories: formattedMemories
        };

        console.log("Final formatted gift:", formattedGift);
        
        setGift(formattedGift);
      } catch (err) {
        console.error("Error in loadGift:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadGift();
  }, []);

  const nextPage = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setTimeout(() => setIsFlipping(false), 500);
  };

  const previousPage = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setTimeout(() => setIsFlipping(false), 500);
  };

  const handleComplete = () => {
    navigate("/collect-gift");
  };

  const getPatternStyle = (pattern: typeof sampleThemeOption.pattern) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate("/home")}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl relative">
        <div className="flex justify-between mb-20">
          <button
            onClick={previousPage}
            disabled={isFlipping}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={nextPage}
            disabled={isFlipping}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div 
          onClick={nextPage}
          className="cursor-pointer"
          style={{ perspective: "1000px" }}
        >
          <div 
            className="w-full aspect-[3/4] relative transition-transform duration-500"
            style={{ 
              transform: `rotateY(${currentPage * -120}deg)`,
              transformStyle: "preserve-3d"
            }}
          >
            {[0, 1, 2].map((pageIndex) => (
              <div
                key={pageIndex}
                className="w-full h-full absolute bg-white rounded-xl shadow-xl p-8"
                style={{
                  transform: `rotateY(${pageIndex * 120}deg) translateZ(300px)`,
                  backfaceVisibility: "hidden"
                }}
              >
                {pageIndex === 0 ? (
                  <div className={`${sampleThemeOption.bgColor} w-full h-full rounded-lg relative overflow-hidden`}>
                    <div 
                      className="absolute inset-0" 
                      style={getPatternStyle(sampleThemeOption.pattern)}
                    />
                    <div className="relative z-10 h-full flex flex-col items-center justify-center space-y-8">
                      <div className="text-center">
                        {sampleThemeOption.text.split('').map((letter, index) => (
                          <span 
                            key={index} 
                            className={`text-3xl sm:text-5xl md:text-8xl font-serif ${sampleThemeOption.textColors[index % sampleThemeOption.textColors.length]}`}
                          >
                            {letter}
                          </span>
                        ))}
                      </div>
                      <div className="text-4xl sm:text-5xl md:text-6xl animate-bounce">
                        {sampleThemeOption.emoji}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-gray-400">
                      Page {pageIndex + 1}
                    </h2>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewAnimation;
