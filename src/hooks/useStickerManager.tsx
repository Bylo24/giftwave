
import { useState } from "react";
import { Sticker } from "@/types/gift";

export const useStickerManager = () => {
  const [placedStickers, setPlacedStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [showStickers, setShowStickers] = useState(false);

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

  const handleStickerRemove = (stickerId: string) => {
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

  return {
    placedStickers,
    selectedSticker,
    showStickers,
    setShowStickers,
    handleStickerClick,
    handleStickerDragEnd,
    handleStickerTap,
    handleStickerRemove,
    handleStickerRotate
  };
};
