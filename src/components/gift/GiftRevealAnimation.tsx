
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
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
  const [opened, setOpened] = useState(false);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [memoryIndex, setMemoryIndex] = useState(-1);
  const [amountRevealed, setAmountRevealed] = useState(false);
  const [showClaim, setShowClaim] = useState(false);

  useEffect(() => {
    if (opened) {
      setTimeout(() => setVideoPlayed(true), 1000);
    }
  }, [opened]);

  useEffect(() => {
    if (videoPlayed && memoryIndex < memories.length - 1) {
      setTimeout(() => setMemoryIndex(memoryIndex + 1), 3000);
    } else if (memoryIndex === memories.length - 1) {
      setTimeout(() => setAmountRevealed(true), 3000);
    }
  }, [videoPlayed, memoryIndex]);

  useEffect(() => {
    if (amountRevealed) {
      setTimeout(() => setShowClaim(true), 2000);
    }
  }, [amountRevealed]);

  const getVideoUrl = () => {
    if (!messageVideo) return '';
    if (typeof messageVideo === 'string') return messageVideo;
    return URL.createObjectURL(messageVideo);
  };

  const handleCollect = () => {
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      {!opened && (
        <div className="flex flex-col items-center space-y-6">
          <div className="text-2xl md:text-3xl font-bold text-white animate-pulse">
            You have a gift!
          </div>
          <motion.div
            className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center cursor-pointer shadow-xl hover:shadow-yellow-400/20"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            onClick={() => setOpened(true)}
          >
            <Gift className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </motion.div>
        </div>
      )}

      {opened && (
        <Confetti 
          numberOfPieces={isMobile ? 50 : 100}
          width={window.innerWidth} 
          height={window.innerHeight}
          gravity={0.2}
          recycle={false}
        />
      )}

      {opened && !videoPlayed && messageVideo && (
        <motion.video
          className="w-full h-full md:h-auto md:max-w-2xl md:aspect-video object-cover rounded-lg"
          src={getVideoUrl()}
          autoPlay
          muted
          playsInline
          onEnded={() => setVideoPlayed(true)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {videoPlayed && memoryIndex >= 0 && memoryIndex < memories.length && (
        <motion.div
          className="text-center space-y-6 max-w-sm md:max-w-xl mx-auto p-4 md:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {memories[memoryIndex].imageUrl && (
            <motion.img 
              src={memories[memoryIndex].imageUrl} 
              className="w-full h-48 md:h-64 object-cover rounded-xl shadow-xl" 
              alt="Memory"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
          <motion.p 
            className="mt-4 text-lg md:text-xl font-medium text-center text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {memories[memoryIndex].caption}
          </motion.p>
        </motion.div>
      )}

      {amountRevealed && (
        <motion.div
          className="bg-gradient-to-br from-green-400 to-blue-500 w-56 md:w-64 h-28 md:h-32 rounded-2xl flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-2xl"
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.6,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        >
          ${amount}
        </motion.div>
      )}

      {showClaim && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-10 left-0 right-0 text-center px-4"
        >
          <Button 
            onClick={handleCollect}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity shadow-xl hover:shadow-pink-500/20"
          >
            Collect Your Gift
          </Button>
        </motion.div>
      )}
    </div>
  );
};
