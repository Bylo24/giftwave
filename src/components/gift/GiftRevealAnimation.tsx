
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Gift, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface GiftRevealAnimationProps {
  messageVideo: File | string | null;
  amount: string;
  memory: {
    caption: string;
    image?: File;
    date: Date;
  };
  memories: Array<{
    id: string;
    imageUrl?: string;
    caption: string;
    date: Date;
  }>;
  onComplete: () => void;
}

export const GiftRevealAnimation = ({ 
  messageVideo, 
  amount, 
  memories = [],
  onComplete 
}: GiftRevealAnimationProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [stage, setStage] = useState<'initial' | 'opening' | 'video' | 'memories' | 'tapping' | 'revealed' | 'claim'>('initial');
  const [taps, setTaps] = useState(0);
  const [memoryIndex, setMemoryIndex] = useState(0);
  const [blurAmount, setBlurAmount] = useState(20);

  useEffect(() => {
    if (stage === 'opening') {
      const timer = setTimeout(() => {
        if (messageVideo) {
          setStage('video');
        } else if (memories.length > 0) {
          setStage('memories');
        } else {
          setStage('tapping');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stage, messageVideo, memories.length]);

  useEffect(() => {
    if (stage === 'video') {
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.onended = () => {
          if (memories.length > 0) {
            setStage('memories');
          } else {
            setStage('tapping');
          }
        };
      }
    }
  }, [stage, memories.length]);

  useEffect(() => {
    if (stage === 'memories' && memoryIndex >= Math.min(memories.length - 1, 1)) {
      const timer = setTimeout(() => setStage('tapping'), 3000);
      return () => clearTimeout(timer);
    }
  }, [memoryIndex, stage, memories.length]);

  useEffect(() => {
    if (stage === 'tapping') {
      const interval = setInterval(() => {
        if (blurAmount > 0) {
          setBlurAmount(prev => Math.max(0, prev - 0.2));
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleTap = () => {
    if (stage === 'tapping') {
      setTaps(prev => {
        const newTaps = prev + 1;
        if (newTaps >= 10) {
          setStage('revealed');
          setTimeout(() => setStage('claim'), 2000);
        }
        return newTaps;
      });
      setBlurAmount(prev => Math.max(0, prev - 2));
    }
  };

  const getVideoUrl = () => {
    if (!messageVideo) return '';
    if (typeof messageVideo === 'string') return messageVideo;
    return URL.createObjectURL(messageVideo);
  };

  const handleCollect = () => {
    onComplete();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white to-gray-50 flex items-center justify-center z-50">
      <AnimatePresence mode="wait">
        {stage === 'initial' && (
          <motion.div 
            className="flex flex-col items-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              You've received a gift!
            </h2>
            <motion.div
              className="relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center cursor-pointer shadow-xl hover:shadow-violet-400/20"
              animate={{ 
                y: [0, -10, 0],
                rotateZ: [0, -2, 2, 0]
              }}
              transition={{ 
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotateZ: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStage('opening')}
            >
              <Gift className="w-12 h-12 md:w-16 md:h-16 text-white" />
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-white/30"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <p className="text-gray-500 animate-pulse">Tap to open</p>
          </motion.div>
        )}

        {stage === 'opening' && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 0] }}
            transition={{ duration: 1, times: [0, 0.3, 1] }}
            className="relative"
          >
            <Gift className="w-24 h-24 md:w-32 md:h-32 text-violet-500" />
            <Confetti
              numberOfPieces={isMobile ? 50 : 100}
              gravity={0.2}
              recycle={false}
              colors={['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9']}
            />
          </motion.div>
        )}

        {stage === 'video' && messageVideo && (
          <motion.div
            className="w-full max-w-lg mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black/5">
              <video
                className="w-full h-full object-cover"
                src={getVideoUrl()}
                autoPlay
                playsInline
                controls={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>
        )}

        {stage === 'memories' && memories[memoryIndex] && (
          <motion.div
            className="w-full max-w-lg mx-auto px-4 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onAnimationComplete={() => {
              if (memoryIndex < Math.min(memories.length - 1, 1)) {
                setTimeout(() => setMemoryIndex(prev => prev + 1), 3000);
              }
            }}
          >
            {memories[memoryIndex].imageUrl && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square">
                <img 
                  src={memories[memoryIndex].imageUrl} 
                  alt="Memory"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}
            <motion.p 
              className="text-lg md:text-xl text-center text-gray-800 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {memories[memoryIndex].caption}
            </motion.p>
          </motion.div>
        )}

        {stage === 'tapping' && (
          <motion.div
            className="space-y-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-lg text-gray-600">Tap rapidly to reveal your gift!</p>
            <motion.div
              className="w-64 h-32 md:w-80 md:h-40 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center cursor-pointer shadow-xl"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              onClick={handleTap}
              style={{ 
                filter: `blur(${blurAmount}px)`,
                WebkitFilter: `blur(${blurAmount}px)`
              }}
            >
              <span className="text-4xl md:text-5xl font-bold text-white">
                ${amount}
              </span>
            </motion.div>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronUp className="w-6 h-6 text-gray-400 mx-auto" />
            </motion.div>
          </motion.div>
        )}

        {stage === 'revealed' && (
          <motion.div
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
          >
            <motion.div
              className="w-64 h-32 md:w-80 md:h-40 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl"
              animate={{ 
                boxShadow: [
                  "0 25px 50px -12px rgba(139, 92, 246, 0.25)",
                  "0 25px 50px -12px rgba(139, 92, 246, 0.45)",
                  "0 25px 50px -12px rgba(139, 92, 246, 0.25)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-4xl md:text-5xl font-bold text-white">
                ${amount}
              </span>
            </motion.div>
            <Confetti
              numberOfPieces={isMobile ? 50 : 100}
              gravity={0.2}
              recycle={false}
              colors={['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9']}
            />
          </motion.div>
        )}

        {stage === 'claim' && (
          <motion.div
            className="space-y-6 text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={handleCollect}
              className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-8 py-6 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity shadow-xl hover:shadow-violet-500/20"
            >
              Claim Your Gift
            </Button>
            <p className="text-sm text-gray-500">
              Sign up or log in to receive your gift
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
