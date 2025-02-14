
import { useEffect, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import animationData from '@/animations/gift-preview.json';
import { motion, AnimatePresence } from 'framer-motion';

interface GiftPreviewAnimationProps {
  messageVideo: File | null;
  amount: string;
  memories: Array<{
    id: string;
    imageUrl?: string;
    caption: string;
    date: Date;
  }>;
  onComplete: () => void;
}

export const GiftPreviewAnimation = ({ 
  messageVideo, 
  amount, 
  memories,
  onComplete 
}: GiftPreviewAnimationProps) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Track animation segments for content timing
  const segments = {
    video: { start: 0.2, end: 0.4 },
    memories: { start: 0.4, end: 0.6 },
    amount: { start: 0.6, end: 0.8 }
  };

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.8);
      
      // Set up animation frame tracking
      const animation = lottieRef.current;
      const updateProgress = () => {
        if (animation.animationItem) {
          const progress = animation.animationItem.currentFrame / animation.animationItem.totalFrames;
          setAnimationProgress(progress);
          
          if (progress >= 1) {
            onComplete();
          } else {
            requestAnimationFrame(updateProgress);
          }
        }
      };
      
      requestAnimationFrame(updateProgress);
    }
  }, [onComplete]);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square">
      {/* Base Lottie Animation */}
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={false}
        className="w-full h-full"
      />

      {/* Dynamic Content Overlays */}
      <AnimatePresence>
        {/* Video Message */}
        {animationProgress >= segments.video.start && messageVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute"
            style={{
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              aspectRatio: '16/9'
            }}
          >
            <video
              src={URL.createObjectURL(messageVideo)}
              className="w-full h-full object-cover rounded-lg"
              autoPlay
              muted
            />
          </motion.div>
        )}

        {/* Memories */}
        {animationProgress >= segments.memories.start && memories.map((memory, index) => (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.1 }}
            className="absolute"
            style={{
              top: `${30 + Math.sin(index * (Math.PI * 2 / memories.length)) * 20}%`,
              left: `${50 + Math.cos(index * (Math.PI * 2 / memories.length)) * 20}%`,
              transform: 'translate(-50%, -50%)',
              width: '20%',
              aspectRatio: '1'
            }}
          >
            {memory.imageUrl && (
              <img
                src={memory.imageUrl}
                alt={memory.caption}
                className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
              />
            )}
          </motion.div>
        ))}

        {/* Amount */}
        {animationProgress >= segments.amount.start && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="text-4xl font-bold text-blue-600 bg-white/90 px-6 py-3 rounded-full shadow-lg">
              ${amount}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
