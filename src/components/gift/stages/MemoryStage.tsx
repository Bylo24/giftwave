
import { motion } from "framer-motion";
import type { Memory } from "@/types/gift";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";

interface MemoryStageProps {
  memories: Memory[];
  caption: string;
  setCaption: (caption: string) => void;
  pendingImage?: string;
  setPendingImage: (image?: string) => void;
  onAddMemory: () => void;
  onUploadImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MemoryStage = ({ 
  memories,
  caption,
  setCaption,
  pendingImage,
  setPendingImage,
  onAddMemory,
  onUploadImage
}: MemoryStageProps) => {
  return (
    <div className="w-full max-w-sm mx-auto px-4 space-y-6">
      {/* Display existing memories */}
      {memories.map((memory, index) => (
        <motion.div
          key={memory.id}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {memory.imageUrl && (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square max-h-[200px] mx-auto">
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
      ))}

      {/* Add new memory section */}
      <div className="space-y-4">
        {pendingImage ? (
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square max-h-[200px] mx-auto">
            <img 
              src={pendingImage} 
              alt="New memory"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full h-48 border-dashed"
            onClick={() => document.getElementById('memory-upload')?.click()}
          >
            <input
              id="memory-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onUploadImage}
            />
            <Upload className="w-6 h-6 mr-2" />
            Upload Image
          </Button>
        )}

        <Input
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <Button
          className="w-full"
          onClick={onAddMemory}
          disabled={!pendingImage || !caption.trim()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Memory
        </Button>
      </div>
    </div>
  );
};
