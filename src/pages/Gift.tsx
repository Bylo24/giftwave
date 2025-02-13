import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeType } from "@/utils/giftThemes";
import { ThemeOption, PatternType, Sticker } from "@/types/gift";
import InsideLeftCard from "@/components/gift/InsideLeftCard";
import { AmountStep } from "@/components/gift/AmountStep";
import { FrontCard } from "@/components/gift/cards/FrontCard";
import { BlankCard } from "@/components/gift/cards/BlankCard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<'front' | 'blank' | 'inside-left'>('front');
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

  const handlePatternChange = (type: PatternType) => {
    setSelectedThemeOption(prev => ({
      ...prev,
      pattern: {
        ...prev.pattern,
        type
      }
    }));
  };

  const handleDuplicatePage = () => {
    const timestamp = Date.now();
    const searchParams = new URLSearchParams(location.search);
    const currentInstance = searchParams.get('instance') || '0';
    const nextInstance = parseInt(currentInstance) + 1;
    
    // Just navigate to a new instance while preserving the current one
    navigate(`/gift?instance=${nextInstance}`);
  };

  const handleStickerClick = (emoji: string) => {
    const cardRef = document.querySelector('.card-container');
    if (!cardRef) return;

    const rect = cardRef.getBoundingClientRect();
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

  const handleStickerDragEnd = (event: any, info: any, stickerId: string) => {
    const cardRef = document.querySelector('.card-container');
    if (!cardRef) return;

    const rect = cardRef.getBoundingClientRect();
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }

    setMessageVideo(file);
  };

  const goToPreviousStep = () => {
    if (currentPage === 'inside-left') {
      setCurrentPage('blank');
    } else if (currentPage === 'blank') {
      setCurrentPage('front');
    } else if (previousSteps.length > 0) {
      const prevStep = previousSteps[previousSteps.length - 1];
      setCurrentStep(prevStep);
      setPreviousSteps(prev => prev.slice(0, -1));
    } else {
      navigate('/');
    }
  };

  const goToNextStep = () => {
    if (currentPage === 'front') {
      setCurrentPage('blank');
    } else if (currentPage === 'blank') {
      setCurrentPage('inside-left');
    } else {
      setPreviousSteps(prev => [...prev, currentStep]);
      setCurrentStep('memory');
    }
  };

  const handleMemoryComplete = () => {
    setPreviousSteps(prev => [...prev, 'memory']);
    setCurrentStep('amount');
  };

  if (currentPage === 'front') {
    return (
      <FrontCard
        selectedThemeOption={selectedThemeOption}
        placedStickers={placedStickers}
        selectedSticker={selectedSticker}
        showStickers={showStickers}
        stickerOptions={stickerOptions}
        onBack={goToPreviousStep}
        onNext={goToNextStep}
        onPatternChange={handlePatternChange}
        onThemeChange={setSelectedThemeOption}
        onShowStickers={setShowStickers}
        onStickerClick={handleStickerClick}
        onStickerTap={handleStickerTap}
        onStickerDragEnd={handleStickerDragEnd}
        onStickerRemove={handleRemoveSticker}
        onStickerRotate={handleStickerRotate}
      />
    );
  }

  if (currentPage === 'blank') {
    return (
      <BlankCard
        selectedThemeOption={selectedThemeOption}
        messageVideo={messageVideo}
        placedStickers={placedStickers}
        selectedSticker={selectedSticker}
        showStickers={showStickers}
        stickerOptions={stickerOptions}
        onBack={goToPreviousStep}
        onNext={goToNextStep}
        onPatternChange={handlePatternChange}
        onShowStickers={setShowStickers}
        onStickerClick={handleStickerClick}
        onStickerTap={handleStickerTap}
        onStickerDragEnd={handleStickerDragEnd}
        onStickerRemove={handleRemoveSticker}
        onStickerRotate={handleStickerRotate}
        onFileChange={handleFileChange}
        setMessageVideo={setMessageVideo}
      />
    );
  }

  if (currentPage === 'inside-left') {
    return (
      <InsideLeftCard
        selectedThemeOption={selectedThemeOption}
        onBack={() => setCurrentPage('blank')}
        onNext={handleDuplicatePage}
      />
    );
  }

  if (currentStep === 'amount') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: selectedThemeOption.screenBgColor }}
      >
        <div className="w-full max-w-md">
          <AmountStep
            amount={amount}
            setAmount={setAmount}
            onNext={goToNextStep}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default Gift;
