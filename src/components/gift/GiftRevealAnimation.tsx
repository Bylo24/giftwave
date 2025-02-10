
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { InitialStage } from "./stages/InitialStage";
import { VideoStage } from "./stages/VideoStage";
import { MemoryStage } from "./stages/MemoryStage";
import { demoContent } from "@/utils/demoContent";

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
  messageVideo = demoContent.sampleVideo, 
  amount, 
  memories = demoContent.memories,
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
          <InitialStage onOpen={() => setStage('opening')} />
        )}

        {stage === 'opening' && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 0] }}
            transition={{ duration: 1, times: [0, 0.3, 1] }}
            className="relative"
          >
            <Confetti
              numberOfPieces={isMobile ? 50 : 100}
              gravity={0.2}
              recycle={false}
              colors={['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9']}
            />
          </motion.div>
        )}

        {stage === 'video' && messageVideo && (
          <VideoStage videoUrl={getVideoUrl()} />
        )}

        {stage === 'memories' && memories[memoryIndex] && (
          <MemoryStage 
            memory={memories[memoryIndex]} 
            key={memoryIndex}
          />
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
