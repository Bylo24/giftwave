import { useState } from "react";
import { ArrowLeft, Upload, Image, Plus } from "lucide-react";
import { ThemeOption } from "@/types/gift";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Memory {
  imageUrl: string;
  caption: string;
}

interface InsideLeftCardProps {
  selectedThemeOption: ThemeOption;
  onBack: () => void;
  onNext: () => void;
}

const InsideLeftCard = ({ selectedThemeOption, onBack, onNext }: InsideLeftCardProps) => {
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);

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
            onClick={onNext}
            className="px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium shadow-lg hover:bg-white/95 transition-colors"
          >
            Next
          </button>
        </div>

        {/* Memory Creation Section */}
        <div className="px-4 py-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto shadow-lg space-y-4">
            <div className="flex flex-col space-y-4">
              {/* Photo Upload */}
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

              {/* Preview */}
              {previewImage && (
                <div className="rounded-lg overflow-hidden w-full aspect-square">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Caption Input */}
              <input
                type="text"
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Add Memory Button */}
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

        {/* Card Section */}
        <div className="flex-1 flex items-center justify-center px-4 pb-24">
          <div 
            className={`${selectedThemeOption.bgColor} rounded-lg aspect-[3/4] w-full max-w-md shadow-lg transition-colors duration-300 relative`}
          >
            <div className="relative z-10 h-full flex flex-col justify-between py-8">
              {[0, 1].map((index) => (
                <div key={index} className="flex-1 flex items-center justify-center">
                  {renderMemoryCard(memories[index] || null, index)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsideLeftCard;
