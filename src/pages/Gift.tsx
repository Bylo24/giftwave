import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ThemeType } from "@/utils/giftThemes";
import { ThemeOption, PatternType, Sticker } from "@/types/gift";
import { StickerLayer } from "@/components/gift/StickerLayer";
import { PatternSelector } from "@/components/gift/PatternSelector";
import { ThemeSelector } from "@/components/gift/ThemeSelector";

const themeOptions: ThemeOption[] = [
  {
    text: "HAPPY BIRTHDAY",
    emoji: "🎂",
    bgColor: "bg-[#FFF6E9]",
    screenBgColor: "#FEC6A1",
    textColors: ["text-[#FF6B6B]", "text-[#4ECDC4]", "text-[#FFD93D]", "text-[#FF6B6B]", "text-[#4ECDC4]"],
    pattern: {
      type: 'dots',
      color: 'rgba(255, 107, 107, 0.1)'
    }
  },
  {
    text: "CONGRATULATIONS",
    emoji: "🎉",
    bgColor: "bg-[#F0FFF4]",
    screenBgColor: "#F2FCE2",
    textColors: ["text-[#38A169]", "text-[#2B6CB0]", "text-[#805AD5]", "text-[#38A169]", "text-[#2B6CB0]"],
    pattern: {
      type: 'grid',
      color: 'rgba(56, 161, 105, 0.1)'
    }
  },
  {
    text: "MERRY CHRISTMAS",
    emoji: "🎄",
    bgColor: "bg-[#F5F2E8]",
    screenBgColor: "#FFDEE2",
    textColors: ["text-[#2E5A2C]", "text-[#1B4B6B]", "text-[#EA384C]", "text-[#FF9EBA]", "text-[#C4D6A0]"],
    pattern: {
      type: 'waves',
      color: 'rgba(46, 90, 44, 0.1)'
    }
  },
  {
    text: "THANK YOU",
    emoji: "💝",
    bgColor: "bg-[#FFF5F5]",
    screenBgColor: "#E5DEFF",
    textColors: ["text-[#E53E3E]", "text-[#DD6B20]", "text-[#D53F8C]", "text-[#E53E3E]", "text-[#DD6B20]"],
    pattern: {
      type: 'dots',
      color: 'rgba(229, 62, 62, 0.1)'
    }
  },
  {
    text: "GOOD LUCK",
    emoji: "🍀",
    bgColor: "bg-[#ECFDF5]",
    screenBgColor: "#D3E4FD",
    textColors: ["text-[#047857]", "text-[#059669]", "text-[#10B981]", "text-[#047857]", "text-[#059669]"],
    pattern: {
      type: 'grid',
      color: 'rgba(4, 120, 87, 0.1)'
    }
  }
];

const stickerOptions = [
  { emoji: "⭐", name: "Star" },
  { emoji: "💫", name: "Sparkle" },
  { emoji: "✨", name: "Glitter" },
  { emoji: "🌟", name: "Glow" },
  { emoji: "💝", name: "Heart" },
];

const Gift = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'recipient' | 'message' | 'amount' | 'memory' | 'preview' | 'payment'>('recipient');
  const [previousSteps, setPreviousSteps] = useState<Array<'recipient' | 'message' | 'amount' | 'memory' | 'preview' | 'payment'>>([]);
  const [selectedTheme] = useState<ThemeType>('holiday');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const [isRecordingMessage, setIsRecordingMessage] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedThemeOption, setSelectedThemeOption] = useState<ThemeOption>(themeOptions[0]);
  const [showStickers, setShowStickers] = useState(false);
  const [placedStickers, setPlacedStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const goToPreviousStep = () => {
    if (previousSteps.length > 0) {
      const prevStep = previousSteps[previousSteps.length - 1];
      setCurrentStep(prevStep);
      setPreviousSteps(prev => prev.slice(0, -1));
    } else {
      navigate('/');
    }
  };

  const goToNextStep = (nextStep: 'recipient' | 'message' | 'amount' | 'memory' | 'preview' | 'payment') => {
    setPreviousSteps(prev => [...prev, currentStep]);
    setCurrentStep(nextStep);
  };

  const handlePatternChange = (type: PatternType) => {
    setSelectedThemeOption(prev => ({
      ...prev,
      pattern: {
        ...prev.pattern,
        type
      }
    }));
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

  const handleStickerClick = (emoji: string) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = rect.width / 2 - 20; // Center X with offset for sticker size
    const y = rect.height / 2 - 20; // Center Y with offset for sticker size

    setPlacedStickers(prev => [...prev, {
      id: `${emoji}-${Date.now()}`,
      emoji,
      x,
      y,
      rotation: Math.random() * 30 - 15
    }]);
    setShowStickers(false);
  };

  const handleDragEnd = (event: any, info: any, stickerId: string) => {
    if (!cardRef.current) return;

    const x = info.point.x;
    const y = info.point.y;

    setPlacedStickers(prev =>
      prev.map(sticker =>
        sticker.id === stickerId
          ? { ...sticker, x, y }
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

  return (
    <div 
      className="min-h-screen relative transition-colors duration-300"
      style={{ backgroundColor: selectedThemeOption.screenBgColor }}
    >
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 10%, transparent 11%)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px'
        }}
      />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={goToPreviousStep}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <ThemeSelector
            themes={themeOptions}
            selectedTheme={selectedThemeOption}
            onThemeChange={setSelectedThemeOption}
          />
          
          <button 
            onClick={() => goToNextStep('message')}
            className="px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium shadow-lg hover:bg-white/95 transition-colors"
          >
            Next
          </button>
        </div>

        <PatternSelector
          currentPattern={selectedThemeOption.pattern.type}
          onPatternChange={handlePatternChange}
        />

        <div className="flex-1 flex items-center justify-center px-4">
          <div 
            ref={cardRef}
            className={`${selectedThemeOption.bgColor} rounded-lg aspect-[3/4] w-full max-w-md shadow-lg p-8 transition-colors duration-300 relative card-container overflow-hidden`}
            style={{
              ...getPatternStyle(selectedThemeOption.pattern),
              position: 'relative'
            }}
          >
            <div className="h-full flex flex-col items-center justify-center space-y-8 pointer-events-none">
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
              onStickerTap={handleStickerTap}
              onStickerDragEnd={handleDragEnd}
              onStickerRemove={handleRemoveSticker}
            />
          </div>
        </div>

        <div className="p-4">
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
                  {stickerOptions.map((sticker, index) => (
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

        <div className="h-8 flex items-center justify-center">
          <div className="w-32 h-1 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Gift;
