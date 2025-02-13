
import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { ThemeOption } from "@/types/gift";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface InsideLeftCardProps {
  selectedThemeOption: ThemeOption;
  onBack: () => void;
  onNext: () => void;
}

const InsideLeftCard = ({ selectedThemeOption, onBack, onNext }: InsideLeftCardProps) => {
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Selected file:', file.name, file.type);

    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      console.log('Uploading file:', fileName);
      
      const { data, error: uploadError } = await supabase.storage
        .from('gift_videos')
        .upload(fileName, file);

      console.log('Upload response:', { data, error: uploadError });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('gift_videos')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      setMessageVideo(file);
      setVideoUrl(publicUrl);
      toast.success('Video uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
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

        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <div 
            className={`${selectedThemeOption.bgColor} rounded-lg aspect-[3/4] w-full max-w-md shadow-lg p-4 transition-colors duration-300 relative`}
          >
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              <div className="w-full h-[85%] rounded-lg flex items-center justify-center overflow-hidden relative">
                {messageVideo ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                    playsInline
                  />
                ) : (
                  <div className="text-center">
                    <input
                      type="file"
                      accept="video/*"
                      id="video-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="video-upload"
                      className="cursor-pointer"
                    >
                      <Button
                        disabled={isUploading}
                        variant="outline"
                        size="default"
                        className="bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg hover:bg-white/95"
                      >
                        <Upload className="mr-2 h-5 w-5" />
                        {isUploading ? 'Uploading...' : 'Upload Video'}
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsideLeftCard;
