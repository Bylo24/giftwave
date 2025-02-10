
import { motion } from "framer-motion";

interface MemoryStageProps {
  memory: {
    imageUrl?: string;
    caption: string;
  };
}

export const MemoryStage = ({ memory }: MemoryStageProps) => {
  return (
    <motion.div
      className="w-full max-w-lg mx-auto px-4 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {memory.imageUrl && (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square">
          <img 
            src={memory.imageUrl} 
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
        {memory.caption}
      </motion.p>
    </motion.div>
  );
};
