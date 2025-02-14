import { useState } from 'react';
import { GiftPreviewAnimation } from './GiftPreviewAnimation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface GiftRevealAnimationProps {
  messageVideo: File | null;
  amount: string;
  memories: Array<{
    id: string;
    imageUrl?: string;
    caption: string;
    date: Date;
  }>;
  memory: any; // Keep existing type
  onComplete: () => void;
}

export const GiftRevealAnimation = ({
  messageVideo,
  amount,
  memories,
  onComplete
}: GiftRevealAnimationProps) => {
  const [isRevealing, setIsRevealing] = useState(false);

  const handleRevealClick = () => {
    setIsRevealing(true);
  };

  const handleAnimationComplete = () => {
    setTimeout(() => {
      onComplete();
    }, 1000); // Add a small delay before transitioning
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="w-full max-w-md">
        {!isRevealing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              Your Gift is Ready!
            </h2>
            <p className="text-gray-600">
              Click to reveal your personalized gift message
            </p>
            <Button
              onClick={handleRevealClick}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
            >
              Reveal Gift
            </Button>
          </motion.div>
        ) : (
          <GiftPreviewAnimation
            messageVideo={messageVideo}
            amount={amount}
            memories={memories}
            onComplete={handleAnimationComplete}
          />
        )}
      </div>
    </div>
  );
};
