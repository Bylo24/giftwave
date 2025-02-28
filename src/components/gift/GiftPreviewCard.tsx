
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Image, DollarSign, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ThemeOption } from '@/types/gift';
import { themeOptions } from '@/constants/giftOptions';

interface GiftPreviewCardProps {
  messageVideo: string;
  amount: string;
  memories: Array<{
    id: string;
    imageUrl?: string;
    caption: string;
    date: Date;
  }>;
  onComplete?: () => void;
  theme?: ThemeOption;
}

export const GiftPreviewCard = ({ 
  messageVideo, 
  amount, 
  memories, 
  onComplete,
  theme = themeOptions[0]
}: GiftPreviewCardProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const goToNextPage = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev + 1) % 4);
      setIsFlipping(false);
      
      // Shoot confetti when flipping pages
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 300);
  };

  useEffect(() => {
    if (currentPage === 3 && !isComplete) {
      // When we reach the amount page (last page), celebrate
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 }
        });
        
        setIsComplete(true);
        
        if (onComplete) {
          setTimeout(onComplete, 1500);
        }
      }, 500);
    }
  }, [currentPage, isComplete, onComplete]);

  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "$0";
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className={`aspect-[3/4] ${theme.bgColor} rounded-2xl shadow-xl overflow-hidden relative cursor-pointer`}
        onClick={goToNextPage}
        style={{ perspective: "1000px" }}
      >
        <AnimatePresence mode="wait">
          {currentPage === 0 && (
            <motion.div 
              key="frontCard"
              className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                {theme.text.split('').map((letter, index) => (
                  <span 
                    key={index} 
                    className={`text-4xl md:text-5xl font-serif ${theme.textColors[index % theme.textColors.length]} drop-shadow-sm`}
                    style={{textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)'}}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <div className="text-5xl md:text-6xl animate-bounce my-6">
                {theme.emoji}
              </div>
              <div className="mt-8 flex items-center justify-center">
                <Button 
                  variant="ghost" 
                  className="bg-white/80 backdrop-blur-sm text-black hover:bg-white/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextPage();
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2" /> Open Gift
                </Button>
              </div>
            </motion.div>
          )}
          
          {currentPage === 1 && (
            <motion.div 
              key="videoMessage"
              className="absolute inset-0 flex flex-col items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Video Message</h3>
              <div className="w-full h-64 mb-4 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 shadow-inner">
                {messageVideo ? (
                  <video 
                    src={messageVideo} 
                    controls 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <Video className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">No video message</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">Tap to continue</p>
            </motion.div>
          )}
          
          {currentPage === 2 && (
            <motion.div 
              key="memories"
              className="absolute inset-0 flex flex-col items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Memories</h3>
              <div className="w-full mb-4 grid grid-cols-2 gap-2">
                {memories && memories.length > 0 ? (
                  memories.slice(0, 4).map((memory) => (
                    <div 
                      key={memory.id} 
                      className="aspect-square rounded-lg overflow-hidden shadow-md"
                    >
                      {memory.imageUrl ? (
                        <img 
                          src={memory.imageUrl} 
                          alt={memory.caption} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg">
                    <Image className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">No memories shared</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">Tap to see your gift</p>
            </motion.div>
          )}
          
          {currentPage === 3 && (
            <motion.div 
              key="amount"
              className="absolute inset-0 flex flex-col items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex items-center justify-center mb-4"
              >
                <div className="h-20 w-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <DollarSign className="h-10 w-10 text-emerald-500" />
                </div>
              </motion.div>
              
              <motion.p 
                className="text-5xl font-bold text-gray-800 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {formatCurrency(amount)}
              </motion.p>
              
              <motion.p 
                className="text-gray-600"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Gift amount
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
