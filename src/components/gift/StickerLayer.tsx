
import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sticker } from '@/types/gift';

interface StickerLayerProps {
  stickers: Sticker[];
  selectedSticker: string | null;
  cardRef: React.RefObject<HTMLDivElement>;
  onStickerTap: (id: string) => void;
  onStickerDragEnd: (event: any, info: any, id: string) => void;
  onStickerRemove: (id: string) => void;
}

export const StickerLayer: React.FC<StickerLayerProps> = ({
  stickers,
  selectedSticker,
  cardRef,
  onStickerTap,
  onStickerDragEnd,
  onStickerRemove,
}) => {
  return (
    <AnimatePresence>
      {stickers.map((sticker) => (
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
          drag
          dragMomentum={false}
          dragConstraints={cardRef}
          onDragEnd={(event, info) => onStickerDragEnd(event, info, sticker.id)}
          onClick={() => onStickerTap(sticker.id)}
          style={{ touchAction: 'none' }}
        >
          {sticker.emoji}
          {selectedSticker === sticker.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
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
      ))}
    </AnimatePresence>
  );
};
