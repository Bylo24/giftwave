import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Image, Plus } from "lucide-react";
import { ThemeOption, PatternType, Sticker } from "@/types/gift";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StickerLayer } from "./StickerLayer";

interface Memory {
  imageUrl: string;
  caption: string;
}

interface InsideLeftCardProps {
  selectedThemeOption: ThemeOption;
  onBack: () => void;
  onNext: () => void;
}

const stickerOptions = [
  { emoji: "⭐", name: "Star" },
  { emoji: "💫", name: "Sparkle" },
  { emoji: "✨", name: "Glitter" },
  { emoji: "🌟", name: "Glow" },
  { emoji: "💝", name: "Heart" },
];

const InsideLeftCard = ({ selectedThemeOption, onBack, onNext }: InsideLeftCardProps) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [caption, setCaption] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showStickers, setShowStickers] = useState(false);
  const [placedStickers, setPlacedStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);

  const handleNext = () => {
    navigate('/gift');
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setPreviewImage(URL.createObjectURL(file));
  };

  const handleAddMemory = () => {
    if (!previewImage) {
      toast.error('Please upload a photo first');
      return;
    }

    if (!caption.trim()) {
      toast.error('Please add a caption');
      return;
    }

    if (memories.length >= 2) {
      toast.error('Maximum of 2 memories allowed');
      return;
    }

    const newMemory = {
      imageUrl: previewImage,
      caption: caption.trim()
    };

    setMemories(prev => [...prev, newMemory]);
    toast.success('Memory added successfully!');
    setPreviewImage(null);
    setCaption('');
  };

  const handleStickerClick = (emoji: string) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.random() * (rect.width - 80) + 40;
    const y = Math.random() * (rect.height - 80) + 40;

    setPlacedStickers(prev => [...prev, {
      id: `${emoji}-${Date.now()}`,
      emoji,
      x,
      y,
      rotation: Math.random() * 360
    }]);
    setShowStickers(false);
  };

  const handleStickerDragEnd = (event: any, info: any, stickerId: string) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = info.point.x - rect.left;
    const y = info.point.y - rect.top;

    const maxX = rect.width - 40;
    const maxY = rect.height - 40;
    const constrainedX = Math.min(Math.max(0, x), maxX);
    const constrainedY = Math.min(Math.max(0, y), maxY);

    setPlacedStickers(prev =>
      prev.map(sticker =>
        sticker.id === stickerId
          ? { ...sticker, x: constrainedX, y: constrainedY }
          : sticker
      )
    );
  };

  const handleStickerTap = (stickerId: string) => {
    setSelectedSticker(selectedSticker === stickerId ? null : stickerId);
  };

  const handleStickerRemove = (stickerId: string) => {
    setPlacedStickers(prev => prev.filter(sticker => sticker.id !== stickerId));
    setSelectedSticker(null);
  };

  const handleStickerRotate = (stickerId: string, newRotation: number) => {
    setPlacedStickers(prev =>
      prev.map(sticker =>
        sticker.id === stickerId
          ? { ...sticker, rotation: newRotation }
          : sticker
      )
    );
  };

  const renderMemoryCard = (memory: Memory | null, index: number) => {
    if (!memory) {
      return (
        <div className="flex flex-col space-y-2 w-full">
          <div className="relative rounded-lg overflow-hidden aspect-square shadow-lg bg-gray-200 w-40 h-40 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
              Your memory
            </div>
          </div>
          <p className="text-sm text-center font-medium text-gray-400">Your memory</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-2 w-full">
        <div className="relative rounded-lg overflow-hidden aspect-square shadow-lg w-40 h-40 mx-auto">
          <img 
            src={memory.imageUrl} 
            alt="Memory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <p className="text-sm text-center font-medium text-gray-800">{memory.caption}</p>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen relative transition-colors duration-300"
      style={{ backgroundColor: selectedThemeOption.screenBgColor }}
    >
      <div className="absolute inset-0" 
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 10%, transparent 11%)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px'
        }}
      />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <button 
            onClick={handleNext}
            className="px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium shadow-lg hover:bg-white/95 transition-colors"
          >
            Next
          </button>
        </div>

        <div className="px-4 py-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto shadow-lg space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  id="photo-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors"
                >
                  <Image className="h-5 w-5 mr-2" />
                  <span className="font-medium">Upload Photo</span>
                </label>
              </div>

              {previewImage && (
                <div className="rounded-lg overflow-hidden w-full aspect-square">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <input
                type="text"
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleAddMemory}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Memory
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 pb-24">
          <div 
            ref={cardRef}
            className={`${selectedThemeOption.bgColor} rounded-lg aspect-[3/4] w-full max-w-md shadow-lg transition-colors duration-300 relative overflow-hidden`}
          >
            <div className="relative z-10 h-full flex flex-col justify-between py-8">
              {[0, 1].map((index) => (
                <div key={index} className="flex-1 flex items-center justify-center">
                  {renderMemoryCard(memories[index] || null, index)}
                </div>
              ))}
            </div>

            <StickerLayer
              stickers={placedStickers}
              selectedSticker={selectedSticker}
              cardRef={cardRef}
              onStickerTap={handleStickerTap}
              onStickerDragEnd={handleStickerDragEnd}
              onStickerRemove={handleStickerRemove}
              onStickerRotate={handleStickerRotate}
            />
          </div>
        </div>

        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
          <div className="relative">
            <button 
              onClick={() => setShowStickers(!showStickers)}
              className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/95 transition-colors"
            >
              <span className="text-2xl">⭐</span>
            </button>
            
            {showStickers && (
              <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl grid grid-cols-5 gap-2 min-w-[200px]">
                {stickerOptions.map((sticker, index) => (
                  <button 
                    key={index}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white/50 rounded-full transition-colors"
                    onClick={() => handleStickerClick(sticker.emoji)}
                  >
                    <span className="text-2xl">{sticker.emoji}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsideLeftCard;
