import { Image, Camera, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface GiftMemory {
  caption: string;
  image?: File;
  date: Date;
}

interface MemoryStepProps {
  memory: GiftMemory;
  setMemory: (memory: GiftMemory) => void;
  onNext: () => void;
}

export const MemoryStep = ({ memory, setMemory, onNext }: MemoryStepProps) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setMemory({ ...memory, image: file });
        toast.success('Memory image uploaded successfully!');
      } else {
        toast.error('Please upload an image file');
      }
    }
  };

  return (
    <Card className="p-6 space-y-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-500/10 rounded-full animate-pulse">
          <Image className="h-6 w-6 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Add a Memory
        </h2>
      </div>
      
      <p className="text-gray-600">Make this moment special with a photo and message!</p>
      
      <div className="space-y-4">
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

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            <label className="font-medium">Add a Caption</label>
          </div>
          <Textarea
            placeholder="Write something meaningful..."
            value={memory.caption}
            onChange={(e) => setMemory({ ...memory, caption: e.target.value })}
            className="min-h-[100px] border-2 border-blue-500/20 focus:border-blue-500/40"
          />
        </div>
      </div>

      <Button 
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity"
        onClick={onNext}
      >
        Continue to Preview
      </Button>
    </Card>
  );
};