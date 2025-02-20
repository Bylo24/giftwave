
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useStickerManager } from "@/hooks/useStickerManager";
import { BlankCard } from "@/components/gift/cards/BlankCard";
import { stickerOptions } from "@/constants/giftOptions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/PageContainer";

const InsideLeftCardContent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const { selectedThemeOption, handlePatternChange, setSelectedThemeOption } = useTheme();
  const {
    placedStickers,
    selectedSticker,
    showStickers,
    setShowStickers,
    handleStickerClick,
    handleStickerDragEnd,
    handleStickerTap,
    handleStickerRemove,
    handleStickerRotate
  } = useStickerManager();

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
      const newTheme = {
        ...selectedThemeOption,
        screenBgColor: giftDesign.screen_bg_color
      };
      setSelectedThemeOption(newTheme);
    }
  }, [giftDesign?.screen_bg_color, setSelectedThemeOption, selectedThemeOption]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }

    if (!token) {
      toast.error('No gift token found');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('gift_videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gift_videos')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('gift_designs')
        .update({ message_video_url: publicUrl })
        .eq('token', token);

      if (updateError) throw updateError;

      queryClient.setQueryData(['gift-design', token], (oldData: any) => ({
        ...oldData,
        message_video_url: publicUrl
      }));

      setMessageVideo(file);
      toast.success('Video uploaded successfully');
    } catch (err) {
      console.error('Error uploading video:', err);
      toast.error('Failed to upload video');
    }
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
        <BlankCard
          selectedThemeOption={selectedThemeOption}
          messageVideo={messageVideo}
          placedStickers={placedStickers}
          selectedSticker={selectedSticker}
          showStickers={showStickers}
          stickerOptions={stickerOptions}
          onBack={() => navigate('/frontcard')}
          onNext={() => navigate('/insiderightcard')}
          onPatternChange={handlePatternChange}
          onShowStickers={setShowStickers}
          onStickerClick={handleStickerClick}
          onStickerTap={handleStickerTap}
          onStickerDragEnd={handleStickerDragEnd}
          onStickerRemove={handleStickerRemove}
          onStickerRotate={handleStickerRotate}
          onFileChange={handleFileChange}
          setMessageVideo={setMessageVideo}
        />
      </div>
    </PageContainer>
  );
};

const InsideLeftCard = () => {
  return (
    <ThemeProvider>
      <InsideLeftCardContent />
    </ThemeProvider>
  );
};

export default InsideLeftCard;
