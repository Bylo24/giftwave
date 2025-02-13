
import { useState } from "react";
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

const GiftContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<'front' | 'blank' | 'inside-left'>('front');
  const [currentStep, setCurrentStep] = useState<'recipient' | 'message' | 'amount' | 'memory' | 'preview' | 'payment'>('recipient');
  const [previousSteps, setPreviousSteps] = useState<Array<'recipient' | 'message' | 'amount' | 'memory' | 'preview' | 'payment'>>([]);
  const [selectedTheme] = useState<ThemeType>('holiday');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const [amount, setAmount] = useState('');

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

  const handleDuplicatePage = () => {
    navigate('/preview');
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

const Gift = () => {
  return (
    <ThemeProvider>
      <GiftContent />
    </ThemeProvider>
  );
};

export default Gift;
