
import { motion } from "framer-motion";

interface VideoStageProps {
  videoUrl: string;
}

export const VideoStage = ({ videoUrl }: VideoStageProps) => {
  return (
    <motion.div
      className="w-full max-w-sm mx-auto px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] bg-black/5">
        <video
          className="w-full h-full object-cover"
          src={videoUrl}
          autoPlay
          playsInline
          controls={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    </motion.div>
  );
};

