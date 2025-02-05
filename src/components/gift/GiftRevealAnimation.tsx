import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DollarSign, Heart, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface GiftRevealAnimationProps {
  messageVideo: File | null;
  amount: string;
  memory: {
    caption: string;
    image?: File;
    date: Date;
  };
  onComplete: () => void;
}

export const GiftRevealAnimation = ({ 
  messageVideo, 
  amount, 
  memory,
  onComplete 
}: GiftRevealAnimationProps) => {
  const [step, setStep] = useState<'video' | 'caption' | 'amount' | 'complete'>('video');
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    if (videoEnded) {
      setTimeout(() => setStep('caption'), 500);
    }
  }, [videoEnded]);

  useEffect(() => {
    if (step === 'caption') {
      setTimeout(() => setStep('amount'), 4000);
    } else if (step === 'amount') {
      setTimeout(() => {
        setStep('complete');
        onComplete();
      }, 4000);
    }
  }, [step, onComplete]);

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

        {step === 'caption' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Heart className="h-16 w-16 text-pink-500 mx-auto mb-4" />
            </motion.div>
            <motion.p
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {memory.caption}
            </motion.p>
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
      </AnimatePresence>
    </div>
  );
};