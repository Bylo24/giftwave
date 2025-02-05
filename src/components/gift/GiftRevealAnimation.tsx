import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Heart, PartyPopper, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface GiftRevealAnimationProps {
  messageVideo: File | null;
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
  memory,
  memories = [],
  onComplete 
}: GiftRevealAnimationProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'video' | 'memories' | 'amount' | 'collect'>('video');
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    if (videoEnded) {
      setTimeout(() => setStep('memories'), 500);
    }
  }, [videoEnded]);

  useEffect(() => {
    if (step === 'memories') {
      const timer = setInterval(() => {
        if (currentMemoryIndex < memories.length - 1) {
          setCurrentMemoryIndex(prev => prev + 1);
        } else {
          clearInterval(timer);
          setStep('amount');
        }
      }, 3000);
      return () => clearInterval(timer);
    } else if (step === 'amount') {
      setTimeout(() => setStep('collect'), 4000);
    }
  }, [step, currentMemoryIndex, memories.length]);

  const handleCollect = () => {
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <AnimatePresence mode="wait">
        {step === 'video' && messageVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-2xl aspect-video"
          >
            <video
              src={URL.createObjectURL(messageVideo)}
              className="w-full h-full object-cover rounded-lg"
              autoPlay
              onEnded={() => setVideoEnded(true)}
              controls={false}
            />
          </motion.div>
        )}

        {step === 'memories' && memories[currentMemoryIndex] && (
          <motion.div
            key={memories[currentMemoryIndex].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6 max-w-xl mx-auto p-6"
          >
            {memories[currentMemoryIndex].imageUrl && (
              <motion.img
                src={memories[currentMemoryIndex].imageUrl}
                alt="Memory"
                className="w-full h-64 object-cover rounded-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Heart className="h-8 w-8 text-pink-500 mx-auto mb-4" />
              <p className="text-2xl font-bold text-white">
                {memories[currentMemoryIndex].caption}
              </p>
            </motion.div>
          </motion.div>
        )}

        {step === 'amount' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-center"
          >
            <Card className="p-8 bg-gradient-to-br from-green-400 to-blue-500">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <DollarSign className="h-16 w-16 text-white mx-auto mb-4" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-5xl font-bold text-white"
              >
                ${amount}
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-4"
              >
                <PartyPopper className="h-8 w-8 text-yellow-300 mx-auto animate-bounce" />
              </motion.div>
            </Card>
          </motion.div>
        )}

        {step === 'collect' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 p-6"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Gift className="h-20 w-20 text-pink-500 mx-auto" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white">Your Gift Awaits!</h2>
            <p className="text-gray-300 max-w-md mx-auto">
              Sign up or log in to collect your special gift and keep it forever.
            </p>
            <Button 
              onClick={handleCollect}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Collect Your Gift
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};