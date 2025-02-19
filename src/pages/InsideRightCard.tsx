import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MemoryStage } from "@/components/gift/stages/MemoryStage";
import { supabase } from "@/integrations/supabase/client";
import type { Memory } from "@/types/gift";

const InsideRightCard = () => {
  const navigate = useNavigate();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [caption, setCaption] = useState("");
  const [pendingImage, setPendingImage] = useState<string | undefined>();

  useEffect(() => {
    const loadExistingMemories = async () => {
      const token = localStorage.getItem('gift_draft_token');
      if (!token) return;

      const { data: giftDesign, error } = await supabase
        .from('gift_designs')
        .select('memories')
        .eq('token', token)
        .single();

      if (error) {
        console.error('Error loading memories:', error);
        return;
      }

      if (giftDesign?.memories) {
        setMemories(giftDesign.memories as Memory[]);
      }
    };

    loadExistingMemories();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      // Upload image to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('gift_images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('gift_images')
        .getPublicUrl(fileName);

      setPendingImage(publicUrl);
      toast.info('Please add a caption to create your memory');
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Failed to upload video');
    }
  };

  const handleAddMemory = async () => {
    if (!pendingImage) {
      toast.error('Please upload a photo first');
      return;
    }

    if (!caption.trim()) {
      toast.error('Please add a caption for your memory');
      return;
    }

    const token = localStorage.getItem('gift_draft_token');
    if (!token) {
      toast.error('No gift token found');
      return;
    }

    const memory: Memory = {
      id: crypto.randomUUID(),
      imageUrl: pendingImage,
      caption: caption,
      date: new Date()
    };

    try {
      const updatedMemories = [...memories, memory];

      // Update gift design with new memories
      const { error: updateError } = await supabase
        .from('gift_designs')
        .update({ memories: updatedMemories })
        .eq('token', token);

      if (updateError) throw updateError;

      setMemories(updatedMemories);
      setCaption("");
      setPendingImage(undefined);
      toast.success('Memory added successfully');
    } catch (err) {
      console.error('Error saving memory:', err);
      toast.error('Failed to save memory');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDE1D3]">
      {/* Background dots pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 2px, transparent 2px)',
        backgroundSize: '24px 24px'
      }} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white rounded-full w-10 h-10"
            onClick={() => navigate('/insideleftcard')}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>

          <Button
            variant="ghost"
            className="bg-white rounded-full px-6 py-2 text-gray-800"
            onClick={() => navigate('/select-amount')}
          >
            <span className="mr-2">$</span>
            <span className="font-medium">Select Amount</span>
            <span className="ml-2">→</span>
          </Button>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-4">
          {/* Upload Card */}
          <motion.div 
            className="bg-white rounded-3xl p-6 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {!pendingImage ? (
              <Button
                variant="outline"
                className="w-full py-6 border-2 border-dashed rounded-2xl"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Photo
              </Button>
            ) : (
              <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-square mb-4">
                <img 
                  src={pendingImage} 
                  alt="Pending upload"
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => setPendingImage(undefined)}
                >
                  Change
                </Button>
              </div>
            )}

            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <Input
              placeholder="Add a caption..."
              className="rounded-full bg-gray-50 border-0"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-6"
              onClick={handleAddMemory}
              disabled={!pendingImage || !caption.trim()}
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Memory
            </Button>
          </motion.div>

          {/* Memories Display */}
          <div className="flex items-center justify-center">
            <motion.div 
              className="bg-white rounded-3xl p-6 w-full max-w-md aspect-[3/4]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-full overflow-auto space-y-8">
                {memories.map((memory) => (
                  <MemoryStage key={memory.id} memory={memory} />
                ))}
                {memories.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Star className="h-12 w-12 mb-4" />
                    <p>Add your first memory</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsideRightCard;
