
import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { Sticker } from '@/types/gift';

interface StickerLayerProps {
  stickers: Sticker[];
  selectedSticker: string | null;
  cardRef: React.RefObject<HTMLDivElement>;
  onStickerTap: (id: string) => void;
  onStickerDragEnd: (event: any, info: any, id: string) => void;
  onStickerRemove: (id: string) => void;
  onStickerRotate?: (id: string, rotation: number) => void;
}

export const StickerLayer: React.FC<StickerLayerProps> = ({
  stickers,
  selectedSticker,
  cardRef,
  onStickerTap,
  onStickerDragEnd,
  onStickerRemove,
  onStickerRotate,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {stickers.map((sticker) => {
          const rotateValue = useMotionValue(sticker.rotation);

          return (
            <motion.div
              key={sticker.id}
              className="absolute text-4xl cursor-move"
              initial={{ scale: 0, x: sticker.x, y: sticker.y }}
              animate={{ 
                scale: 1,
                x: sticker.x,
                y: sticker.y,
                rotate: sticker.rotation 
              }}
              transition={{ duration: 0.15 }}
              drag
              dragMomentum={false}
              dragConstraints={cardRef}
              onDragEnd={(event, info) => onStickerDragEnd(event, info, sticker.id)}
              onClick={() => onStickerTap(sticker.id)}
              style={{ 
                touchAction: 'none', 
                pointerEvents: 'auto',
                rotate: rotateValue
              }}
              whileTap={{ scale: selectedSticker === sticker.id ? 1 : 0.95 }}
              whileHover={{ scale: 1.05 }}
              onPointerDown={(event) => {
                // Check if it's a touch event with multiple touches (pinch)
                if (event.pointerType === 'touch' && (event as any).touches?.length === 2) {
                  const touch1 = (event as any).touches[0];
                  const touch2 = (event as any).touches[1];
                  
                  // Calculate the angle between the two touch points
                  const angle = Math.atan2(
                    touch2.clientY - touch1.clientY,
                    touch2.clientX - touch1.clientX
                  ) * (180 / Math.PI);
                  
                  // Update rotation
                  const newRotation = sticker.rotation + angle;
                  rotateValue.set(newRotation);
                  
                  if (onStickerRotate) {
                    onStickerRotate(sticker.id, newRotation);
                  }
                }
              }}
            >
              {sticker.emoji}
              {selectedSticker === sticker.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -top-3 -right-3 bg-red-500 rounded-full p-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStickerRemove(sticker.id);
                  }}
                >
                  <X className="h-3 w-3 text-white" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
