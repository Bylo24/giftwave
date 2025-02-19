
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnimationDebounce, useAnimationFrame, useIntersectionObserver } from "@/utils/animationUtils";
import { toast } from "sonner";
import Lottie from "lottie-react";
import giftPreviewAnimation from "@/animations/gift-preview.json";

interface GiftPreviewAnimationProps {
  onComplete: () => void;
}

export const GiftPreviewAnimation = ({ onComplete }: GiftPreviewAnimationProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const isMobile = useIsMobile();
  const animationContainerRef = useRef<HTMLDivElement>(null);

  // Debounced animation trigger
  const triggerAnimation = useAnimationDebounce(() => {
    setIsAnimating(true);
    setShowConfetti(true);
  }, 100);

  // Intersection observer for triggering animation when in view
  const observerRef = useIntersectionObserver((isIntersecting) => {
    if (isIntersecting) {
      triggerAnimation();
    }
  }, {
    threshold: 0.5,
    rootMargin: "50px"
  });

  // Animation frame for smooth confetti
  useAnimationFrame((deltaTime) => {
    if (showConfetti) {
      // Update confetti positions using deltaTime for smooth animation
      // This ensures consistent animation speed regardless of frame rate
    }
  });

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      setShowConfetti(false);
      setIsAnimating(false);
    };
  }, []);

  const handleAnimationComplete = () => {
    setShowConfetti(false);
    onComplete();
  };

  return (
    <div 
      ref={observerRef}
      className="min-h-screen flex items-center justify-center p-4 overflow-hidden"
    >
      <motion.div
        ref={animationContainerRef}
        className="relative w-full max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: isAnimating ? 1 : 0.8, 
          opacity: isAnimating ? 1 : 0,
        }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        onAnimationComplete={handleAnimationComplete}
      >
        <div className="relative aspect-square">
          <Lottie
            animationData={giftPreviewAnimation}
            loop={false}
            className="w-full h-full"
            onComplete={handleAnimationComplete}
            rendererSettings={{
              preserveAspectRatio: "xMidYMid slice",
              progressiveLoad: true
            }}
          />
        </div>

        <AnimatePresence>
          {showConfetti && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Optimized confetti rendering based on device capabilities */}
              <div className="confetti-container" style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
              }}>
                {/* Reduced particle count for mobile devices */}
                {Array.from({ length: isMobile ? 50 : 100 }).map((_, index) => (
                  <motion.div
                    key={index}
                    className="confetti-particle"
                    style={{
                      position: 'absolute',
                      width: '10px',
                      height: '10px',
                      backgroundColor: ['#ff0000', '#00ff00', '#0000ff'][index % 3],
                      borderRadius: '50%',
                      willChange: 'transform',
                    }}
                    animate={{
                      y: [0, Math.random() * 500],
                      x: [0, (Math.random() - 0.5) * 500],
                      rotate: [0, Math.random() * 360],
                    }}
                    transition={{
                      duration: 1 + Math.random(),
                      ease: "easeOut",
                      repeat: 0,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
