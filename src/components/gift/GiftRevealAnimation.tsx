
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        <>
          <div className="text-lg font-semibold mb-4 text-white">You have a gift!</div>
          <motion.div
            className="relative w-24 h-24 bg-yellow-400 rounded-lg flex items-center justify-center cursor-pointer"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            onClick={() => setOpened(true)}
          >
            <Gift size={36} />
          </motion.div>
        </>
      )}

      {opened && <Confetti numberOfPieces={100} width={window.innerWidth} height={window.innerHeight} />}

      {opened && !videoPlayed && messageVideo && (
        <motion.video
          className="w-full max-w-2xl aspect-video object-cover rounded-lg"
          src={getVideoUrl()}
          autoPlay
          muted
          onEnded={() => setVideoPlayed(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      )}

      {videoPlayed && memoryIndex >= 0 && memoryIndex < memories.length && (
        <motion.div
          className="text-center space-y-6 max-w-xl mx-auto p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {memories[memoryIndex].imageUrl && (
            <img 
              src={memories[memoryIndex].imageUrl} 
              className="w-full h-64 object-cover rounded-lg shadow-lg" 
              alt="Memory" 
            />
          )}
          <p className="mt-4 text-lg font-semibold text-center text-white">
            {memories[memoryIndex].caption}
          </p>
        </motion.div>
      )}

      {amountRevealed && (
        <motion.div
          className="bg-gradient-to-br from-green-400 to-blue-500 w-64 h-32 rounded-lg flex items-center justify-center text-white text-3xl font-bold shadow-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          ${amount}
        </motion.div>
      )}

      {showClaim && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-6 p-6"
        >
          <Button 
            onClick={handleCollect}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Collect Your Gift
          </Button>
        </motion.div>
      )}
    </div>
  );
};
