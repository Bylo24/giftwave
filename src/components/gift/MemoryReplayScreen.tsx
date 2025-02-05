import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Camera, MessageCircle, Calendar, Plus } from "lucide-react";
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Please upload an image file");
      }
    }
  };

  const handleAddMemory = () => {
    if (!selectedImage && !newCaption) {
      toast.error("Please add an image or caption");
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

        {/* Upload Section */}
        <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 border-blue-500/20">
          <label className="flex flex-col items-center gap-3 cursor-pointer">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Camera className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-center">
              <p className="font-medium">Upload Photo</p>
              <p className="text-sm text-gray-500">Share a special moment</p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
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
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleAddMemory}
            className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors"
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
        {memories.map((memory) => (
          <Card
            key={memory.id}
            className="p-4 hover:shadow-lg transition-shadow animate-fade-in bg-white"
          >
            {memory.imageUrl && (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                <img
                  src={memory.imageUrl}
                  alt="Memory"
                  className="w-full h-full object-cover"
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