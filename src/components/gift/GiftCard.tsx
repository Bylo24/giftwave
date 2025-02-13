
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeType } from "@/utils/giftThemes";

interface GiftCardProps {
  theme: ThemeType;
  messageVideo: File | null;
  memories: Array<{
    id: string;
    imageUrl?: string;
    caption: string;
    date: Date;
  }>;
  amount: string;
}

type CardPage = 'front' | 'left' | 'right' | 'back';

export const GiftCard = ({ theme, messageVideo, memories, amount }: GiftCardProps) => {
  const [currentPage, setCurrentPage] = useState<CardPage>('front');
  const [isRevealed, setIsRevealed] = useState(false);

  const getPageIndex = (page: CardPage) => {
    const pages: CardPage[] = ['front', 'left', 'right', 'back'];
    return pages.indexOf(page);
  };

  const handleNextPage = () => {
    const pages: CardPage[] = ['front', 'left', 'right', 'back'];
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex < pages.length - 1) {
      setCurrentPage(pages[currentIndex + 1]);
    }
  };

  const handlePreviousPage = () => {
    const pages: CardPage[] = ['front', 'left', 'right', 'back'];
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      setCurrentPage(pages[currentIndex - 1]);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'front':
        return (
          <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-white rounded-lg">
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                You've received a gift!
              </h2>
              <p className="text-gray-600 text-center">Swipe or tap to open</p>
            </div>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Templates</span>
              <span>Text</span>
              <span>Stickers</span>
            </div>
          </div>
        );

      case 'left':
        return (
          <div className="w-full h-full bg-white rounded-lg p-4">
            <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
              {messageVideo ? (
                <video
                  className="w-full h-full object-cover rounded-lg"
                  src={URL.createObjectURL(messageVideo)}
                  controls
                  playsInline
                />
              ) : (
                <p className="text-gray-500">Video message will appear here</p>
              )}
            </div>
            <div className="mt-4 flex justify-center gap-4 text-sm text-gray-500">
              <span>Video Frames</span>
              <span>Retake</span>
            </div>
          </div>
        );

      case 'right':
        return (
          <div className="w-full h-full bg-white rounded-lg p-4 space-y-4">
            <div className="space-y-4">
              {memories.map((memory) => (
                <div key={memory.id} className="space-y-2">
                  {memory.imageUrl && (
                    <img
                      src={memory.imageUrl}
                      alt={memory.caption}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <p className="text-sm text-gray-600">{memory.caption}</p>
                </div>
              ))}
              {memories.length === 0 && (
                <p className="text-center text-gray-500">Memories will appear here</p>
              )}
            </div>
            <div className="flex justify-center gap-4 text-sm text-gray-500">
              <span>Frames</span>
              <span>Stickers</span>
            </div>
          </div>
        );

      case 'back':
        return (
          <div className="w-full h-full bg-white rounded-lg p-4">
            <div 
              className="w-full h-full flex flex-col items-center justify-center space-y-6 cursor-pointer"
              onClick={() => setIsRevealed(true)}
            >
              {isRevealed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center"
                >
                  <span className="text-2xl font-bold text-white">${amount}</span>
                </motion.div>
              ) : (
                <p className="text-gray-500">Tap to reveal amount</p>
              )}
              <p className="text-sm text-gray-500">Collect gift here</p>
            </div>
            <div className="mt-4 flex justify-center gap-4 text-sm text-gray-500">
              <span>Frames</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto aspect-[3/4] relative">
      <motion.div
        className="w-full h-full"
        animate={{ 
          rotateY: getPageIndex(currentPage) * 90,
          transition: { duration: 0.5 }
        }}
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {renderPage()}
      </motion.div>
      
      <div className="absolute top-1/2 left-4 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousPage}
          disabled={currentPage === 'front'}
          className="rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute top-1/2 right-4 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextPage}
          disabled={currentPage === 'back'}
          className="rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
