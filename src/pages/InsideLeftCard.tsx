
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useStickerManager } from "@/hooks/useStickerManager";
import { BlankCard } from "@/components/gift/cards/BlankCard";
import { stickerOptions } from "@/constants/giftOptions";
import { toast } from "sonner";

const InsideLeftCardContent = () => {
  const navigate = useNavigate();
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const { selectedThemeOption, handlePatternChange } = useTheme();
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }

    setMessageVideo(file);
  };

  return (
    <BlankCard
      selectedThemeOption={selectedThemeOption}
      messageVideo={messageVideo}
      placedStickers={placedStickers}
      selectedSticker={selectedSticker}
      showStickers={showStickers}
      stickerOptions={stickerOptions}
      onBack={() => navigate(-1)}
      onNext={() => navigate('/insiderightcard')}
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
};

const InsideLeftCard = () => {
  return (
    <ThemeProvider>
      <InsideLeftCardContent />
    </ThemeProvider>
  );
};

export default InsideLeftCard;
