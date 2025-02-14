
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { giftThemes, ThemeType } from "@/utils/giftThemes";
import { GiftCard } from "./GiftCard";
import {
  giftContainerVariants,
  messageVariants,
  memoriesVariants,
  amountVariants,
  confettiVariants,
  GiftAnimationProps
} from "@/utils/giftAnimationSequence";

interface Memory {
  id: string;
  imageUrl?: string;
  caption: string;
  date: Date;
}

interface GiftMemory {
  caption: string;
  image?: File;
  date: Date;
}

interface PreviewStepProps {
  theme: ThemeType;
  phoneNumber: string;
  amount: string;
  messageVideo: File | null;
  memory: GiftMemory;
  memories: Memory[];
  onNext: () => void;
}

export const PreviewStep = ({ 
  theme = 'birthday',
  phoneNumber, 
  amount, 
  messageVideo,
  memories,
  onNext 
}: PreviewStepProps) => {
  return (
    <motion.div 
      className="space-y-6 animate-fade-in"
      variants={giftContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={messageVariants}>
        <GiftCard
          theme={theme}
          messageVideo={messageVideo}
          memories={memories}
          amount={amount}
        />
      </motion.div>
      
      {memories.length > 0 && (
        <motion.div className="grid grid-cols-2 gap-4">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              variants={memoriesVariants}
              custom={index}
              className="aspect-square rounded-lg overflow-hidden bg-white shadow-md"
            >
              {memory.imageUrl && (
                <img 
                  src={memory.imageUrl} 
                  alt={memory.caption}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div variants={amountVariants} className="text-center">
        <span className="text-3xl font-bold text-blue-600">${amount}</span>
      </motion.div>

      <motion.div variants={confettiVariants}>
        <Button 
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
          onClick={onNext}
        >
          Continue to Payment
        </Button>
      </motion.div>
    </motion.div>
  );
};
