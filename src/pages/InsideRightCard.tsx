import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MemoryStage } from "@/components/gift/stages/MemoryStage";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import type { Memory } from "@/types/gift";
import { PageContainer } from "@/components/layout/PageContainer";

const InsideRightCardContent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [caption, setCaption] = useState("");
  const [pendingImage, setPendingImage] = useState<string | undefined>();
  const { selectedThemeOption, setSelectedThemeOption } = useTheme();
  const token = localStorage.getItem('gift_draft_token');

  const { data: giftDesign } = useQuery({
    queryKey: ['gift-design', token],
    queryFn: async () => {
      if (!token) throw new Error('No gift token found');

      const { data, error } = await supabase
        .from('gift_designs')
        .select('*')
        .eq('token', token)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!token,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30
  });

  // Update theme when gift design data is loaded
  useEffect(() => {
    if (giftDesign?.screen_bg_color) {
      setSelectedThemeOption(prev => ({
        ...prev,
        screenBgColor: giftDesign.screen_bg_color
      }));
    }
  }, [giftDesign?.screen_bg_color, setSelectedThemeOption]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPendingImage(imageUrl);
  };

  const handleAddMemory = () => {
    if (!pendingImage) {
      toast.error('Please upload an image first');
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
      imageUrl: pendingImage,
      caption: caption.trim()
    };

    setMemories(prev => [...prev, newMemory]);
    setPendingImage(undefined);
    setCaption('');
    toast.success('Memory added successfully!');
  };

  return (
    <PageContainer>
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
        <div className="relative z-10">
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

          <MemoryStage
            memories={memories}
            caption={caption}
            setCaption={setCaption}
            pendingImage={pendingImage}
            setPendingImage={setPendingImage}
            onAddMemory={handleAddMemory}
            onUploadImage={handleImageUpload}
          />
        </div>
      </div>
    </PageContainer>
  );
};

const InsideRightCard = () => {
  return (
    <ThemeProvider>
      <InsideRightCardContent />
    </ThemeProvider>
  );
};

export default InsideRightCard;
