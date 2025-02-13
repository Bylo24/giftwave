
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ThemeOption } from "@/types/gift";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface InsideLeftCardProps {
  selectedThemeOption: ThemeOption;
  onBack: () => void;
  onNext: () => void;
}

const videoFrames = [
  { id: 'frame1', src: '/frames/frame1.png', name: 'Classic Gold' },
  { id: 'frame2', src: '/frames/frame2.png', name: 'Modern Silver' },
  { id: 'frame3', src: '/frames/frame3.png', name: 'Vintage Bronze' },
  { id: 'frame4', src: '/frames/frame4.png', name: 'Floral' },
  { id: 'frame5', src: '/frames/frame5.png', name: 'Minimalist' },
];

const InsideLeftCard = ({ selectedThemeOption, onBack, onNext }: InsideLeftCardProps) => {
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string>('frame1');
  const [isUploading, setIsUploading] = useState(false);

  const handleMessageUpload = async (file: File) => {
    if (file.type.startsWith('video/')) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('gift_videos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('gift_videos')
          .getPublicUrl(fileName);

        setMessageVideo(file);
        toast.success('Video message uploaded successfully!');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload video. Please try again.');
      } finally {
        setIsUploading(false);
      }
    } else {
      toast.error('Please upload a video file');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleMessageUpload(file);
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
                  <>
                    <video
                      src={URL.createObjectURL(messageVideo)}
                      controls
                      className="w-full h-full object-cover rounded-lg"
                      playsInline
                    />
                    <img 
                      src={videoFrames.find(f => f.id === selectedFrame)?.src}
                      alt="Video frame"
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    />
                  </>
                ) : (
                  <div className="text-center">
                    <input 
                      type="file" 
                      accept="video/*"
                      className="hidden" 
                      id="video-upload"
                      onChange={handleFileChange}
                    />
                    <label 
                      htmlFor="video-upload"
                      className="cursor-pointer inline-block"
                    >
                      <Button
                        variant="ghost"
                        className="bg-black/10 hover:bg-black/20 text-gray-700"
                        disabled={isUploading}
                      >
                        {isUploading ? 'Uploading...' : 'Upload/Record a video message'}
                      </Button>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">Videos will be saved automatically</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pb-8">
          <div className="px-4 max-w-md mx-auto">
            <div className="overflow-x-auto">
              <div className="flex gap-3 pb-4">
                {videoFrames.map((frame) => (
                  <Card
                    key={frame.id}
                    className={`flex-shrink-0 w-20 h-20 cursor-pointer transition-all ${
                      selectedFrame === frame.id 
                        ? 'ring-2 ring-secondary scale-110' 
                        : 'hover:scale-105'
                    }`}
                    onClick={() => setSelectedFrame(frame.id)}
                  >
                    <img
                      src={frame.src}
                      alt={frame.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsideLeftCard;
