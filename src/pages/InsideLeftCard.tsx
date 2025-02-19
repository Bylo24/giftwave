
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useStickerManager } from "@/hooks/useStickerManager";
import { BlankCard } from "@/components/gift/cards/BlankCard";
import { stickerOptions } from "@/constants/giftOptions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const InsideLeftCardContent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const { selectedThemeOption, handlePatternChange } = useTheme();
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

  // Fetch the current gift design data with caching
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
    staleTime: Infinity, // Keep the data fresh indefinitely
    cacheTime: 1000 * 60 * 30, // Cache for 30 minutes
  });

  // Set video from URL when gift design data is loaded
  useEffect(() => {
    const fetchVideoFile = async () => {
      if (giftDesign?.message_video_url) {
        try {
          const response = await fetch(giftDesign.message_video_url);
          const blob = await response.blob();
          const file = new File([blob], 'message_video.mp4', { type: 'video/mp4' });
          setMessageVideo(file);
        } catch (error) {
          console.error('Error fetching video:', error);
          toast.error('Failed to load saved video');
        }
      }
    };

    fetchVideoFile();
  }, [giftDesign?.message_video_url]);

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
      
      // Upload video to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('gift_videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded video
      const { data: { publicUrl } } = supabase.storage
        .from('gift_videos')
        .getPublicUrl(fileName);

      // Update the gift design with the video URL
      const { error: updateError } = await supabase
        .from('gift_designs')
        .update({ message_video_url: publicUrl })
        .eq('token', token);

      if (updateError) throw updateError;

      // Update the query cache
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
    <BlankCard
      selectedThemeOption={selectedThemeOption}
      messageVideo={messageVideo}
      placedStickers={placedStickers}
      selectedSticker={selectedSticker}
      showStickers={showStickers}
      stickerOptions={stickerOptions}
      onBack={() => navigate(-1)}
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
