
import { motion } from "framer-motion";
import { Gift } from "lucide-react";

interface InitialStageProps {
  onOpen: () => void;
}

export const InitialStage = ({ onOpen }: InitialStageProps) => {
  return (
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
        onClick={onOpen}
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
  );
};
