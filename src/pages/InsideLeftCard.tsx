
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
import { ArrowLeft } from "lucide-react"; // Added missing import

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
  const { data: giftDesign, error } = useQuery({
    queryKey: ['gift-design', token],
    queryFn: async () => {
      if (!token) {
        console.error('No gift token found');
        throw new Error('No gift token found');
      }

      const { data, error } = await supabase
        .from('gift_designs')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        console.error('No gift design found');
        throw new Error('No gift design found');
      }

      return data;
    },
    enabled: !!token,
    retry: 1
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load gift design");
      console.error("Gift design error:", error);
    }
  }, [error]);

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Gift</h2>
          <p className="text-gray-600 mb-4">Please try again or start a new gift</p>
          <button 
            onClick={() => navigate('/frontcard')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Start New Gift
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="min-h-screen bg-white">
        <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-white/80 backdrop-blur-lg z-10 border-b border-gray-100">
          <button 
            onClick={() => navigate('/frontcard')}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div></div>
          <button 
            onClick={() => navigate('/insiderightcard')}
            className="px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium shadow-lg hover:bg-white/95 transition-colors"
          >
            Next
          </button>
        </div>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div 
            className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-lg rounded-2xl overflow-hidden w-full max-w-md aspect-[3/4] p-8"
          >
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
          </div>
        </div>
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
