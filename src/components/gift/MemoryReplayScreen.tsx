
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Camera, MessageCircle, Calendar, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Memory {
  id: string;
  imageUrl?: string;
  caption: string;
  date: Date;
}

interface MemoryReplayScreenProps {
  memories: Memory[];
  onAddMemory: (memory: Omit<Memory, "id">) => void;
  onNext: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_MEMORIES = 6;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const CAPTION_SUGGESTIONS = [
  "my favourite moment with you",
  "something I wish to forget",
  "that time we laughed until we cried",
  "a memory I'll cherish forever",
  "the day everything changed"
];

export const MemoryReplayScreen = ({ memories, onAddMemory, onNext }: MemoryReplayScreenProps) => {
  const [newCaption, setNewCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Please upload a JPG, PNG or WebP image');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    // Validate total memories
    if (memories.length >= MAX_MEMORIES) {
      toast.error(`Maximum ${MAX_MEMORIES} memories allowed`);
      return;
    }

    try {
      setIsUploading(true);
      const url = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewUrl(url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to process image");
      console.error("Image processing error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMemory = () => {
    if (!selectedImage && !newCaption) {
      toast.error("Please add an image or caption");
      return;
    }

    if (memories.length >= MAX_MEMORIES) {
      toast.error(`Maximum ${MAX_MEMORIES} memories allowed`);
      return;
    }

    onAddMemory({
      imageUrl: previewUrl || undefined,
      caption: newCaption,
      date: new Date(),
    });

    // Reset form
    setNewCaption("");
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6 space-y-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <Image className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-blue-600">
            Add Memories
          </h2>
        </div>

        {memories.length >= MAX_MEMORIES && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">Maximum number of memories reached</p>
          </div>
        )}

        {/* Upload Section */}
        <Card 
          className={`p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 
            ${isUploading ? 'border-blue-300 bg-blue-50' : 'border-blue-500/20'}
            ${memories.length >= MAX_MEMORIES ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <label className={`flex flex-col items-center gap-3 ${memories.length >= MAX_MEMORIES ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Camera className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-center">
              <p className="font-medium">Upload Photo</p>
              <p className="text-sm text-gray-500">
                {isUploading ? 'Uploading...' : 'Share a special moment (max 5MB)'}
              </p>
            </div>
            <input
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              className="hidden"
              onChange={handleImageUpload}
              disabled={memories.length >= MAX_MEMORIES || isUploading}
            />
          </label>
        </Card>

        {/* Preview Section */}
        {previewUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="loading-spinner" />
              </div>
            )}
          </div>
        )}

        {/* Caption Input */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            <label className="font-medium">Add a Caption</label>
          </div>
          <Textarea
            placeholder={`Write something meaningful like... "${CAPTION_SUGGESTIONS[Math.floor(Math.random() * CAPTION_SUGGESTIONS.length)]}"`}
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
            className="min-h-[100px] border-2 border-blue-500/20 focus:border-blue-500/40"
            maxLength={200}
          />
          <p className="text-xs text-gray-500 text-right">
            {newCaption.length}/200 characters
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleAddMemory}
            className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors"
            disabled={isUploading || (!selectedImage && !newCaption) || memories.length >= MAX_MEMORIES}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Memory
          </Button>
          
          <Button
            onClick={onNext}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity"
          >
            Continue
          </Button>
        </div>
      </Card>

      {/* Memories List */}
      <div className="space-y-4">
        {memories.map((memory, index) => (
          <Card
            key={memory.id}
            className="p-4 hover:shadow-lg transition-shadow animate-fade-in bg-white"
          >
            {memory.imageUrl && (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                <img
                  src={memory.imageUrl}
                  alt={`Memory ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <p className="text-gray-600 italic mb-2">{memory.caption}</p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{memory.date.toLocaleDateString()}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
