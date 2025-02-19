
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeType } from "@/utils/giftThemes";
import InsideLeftCard from "@/components/gift/InsideLeftCard";
import { AmountStep } from "@/components/gift/AmountStep";
import { FrontCard } from "@/components/gift/cards/FrontCard";
import { BlankCard } from "@/components/gift/cards/BlankCard";
import { useStickerManager } from "@/hooks/useStickerManager";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { stickerOptions } from "@/constants/giftOptions";
import { toast } from "sonner";
import { GiftRevealAnimation } from "@/components/gift/GiftRevealAnimation";
import { MemoryReplayScreen } from "@/components/gift/MemoryReplayScreen";

const GiftContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<'front' | 'blank' | 'inside-left'>('front');
  const [currentStep, setCurrentStep] = useState<'recipient' | 'message' | 'amount' | 'memory' | 'reveal' | 'preview' | 'payment'>('recipient');
  const [previousSteps, setPreviousSteps] = useState<Array<'recipient' | 'message' | 'amount' | 'memory' | 'reveal' | 'preview' | 'payment'>>([]);
  const [selectedTheme] = useState<ThemeType>('holiday');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const [messageVideoUrl, setMessageVideoUrl] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [memories, setMemories] = useState<Array<{ id: string; imageUrl?: string; caption: string; date: Date }>>([]);

  const { selectedThemeOption, handlePatternChange, setSelectedThemeOption } = useTheme();
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

  const handleAddMemory = (memory: Omit<{ id: string; imageUrl?: string; caption: string; date: Date }, "id">) => {
    const newMemory = {
      ...memory,
      id: crypto.randomUUID()
    };
    setMemories(prev => [...prev, newMemory]);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }

    setMessageVideo(file);
    // Create a temporary URL for the video file
    const videoUrl = URL.createObjectURL(file);
    setMessageVideoUrl(videoUrl);
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

  const handleNext = async (): Promise<void> => {
    // Since we're now explicitly returning a Promise<void>, TypeScript will be happy
    return Promise.resolve();
  };

  const goToNextStep = () => {
    if (currentStep === 'memory') {
      setPreviousSteps(prev => [...prev, currentStep]);
      setCurrentStep('reveal');
      return;
    }

    if (currentPage === 'front') {
      setCurrentPage('blank');
    } else if (currentPage === 'blank') {
      navigate('/insideleftscreen');
    } else {
      setPreviousSteps(prev => [...prev, currentStep]);
      setCurrentStep('memory');
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (messageVideoUrl) {
        URL.revokeObjectURL(messageVideoUrl);
      }
    };
  }, [messageVideoUrl]);

  if (currentStep === 'reveal') {
    return (
      <GiftRevealAnimation
        messageVideo={messageVideoUrl}
        amount={amount}
        memories={memories}
        memory={null}
        onComplete={() => {
          setPreviousSteps(prev => [...prev, 'reveal']);
          setCurrentStep('preview');
        }}
      />
    );
  }

  if (currentStep === 'memory') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: selectedThemeOption.screenBgColor }}
      >
        <div className="w-full max-w-md">
          <MemoryReplayScreen
            memories={memories}
            onAddMemory={handleAddMemory}
            onNext={goToNextStep}
          />
        </div>
      </div>
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
            onNext={handleNext}
          />
        </div>
      </div>
    );
  }

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
        onStickerRemove={handleStickerRemove}
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
        onStickerRemove={handleStickerRemove}
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
        onNext={goToNextStep}
      />
    );
  }

  return null;
};

const Gift = () => {
  return (
    <ThemeProvider>
      <GiftContent />
    </ThemeProvider>
  );
};

export default Gift;
