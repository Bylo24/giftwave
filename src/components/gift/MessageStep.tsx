
import { Video, Upload, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MessageStepProps {
  messageVideo: File | null;
  setMessageVideo: (file: File | null) => void;
  isRecordingMessage: boolean;
  startMessageRecording: () => void;
  stopMessageRecording: () => void;
  onNext: () => void;
}

export const MessageStep = ({
  messageVideo,
  setMessageVideo,
  isRecordingMessage,
  startMessageRecording,
  stopMessageRecording,
  onNext,
}: MessageStepProps) => {
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleMessageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
          setVideoPreviewUrl(publicUrl);
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
    }
  };

  const handleRemoveVideo = () => {
    setMessageVideo(null);
    setVideoPreviewUrl(null);
  };

  return (
    <Card className="p-4 space-y-2 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-secondary/10 rounded-full">
            <Video className="h-4 w-4 text-secondary" />
          </div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-secondary to-orange-500 bg-clip-text text-transparent">
            Record Your Message
          </h2>
        </div>
        {messageVideo && (
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-red-500"
            onClick={handleRemoveVideo}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Card className="p-3 cursor-pointer hover:shadow-lg transition-shadow border-2 border-secondary/20">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="p-2 bg-secondary/10 rounded-full">
              <Upload className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium">Upload Message</p>
              <p className="text-xs text-gray-500">Max 100MB</p>
            </div>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleMessageUpload}
              disabled={isUploading}
            />
          </label>
        </Card>

        <Card 
          className="p-3 cursor-pointer hover:shadow-lg transition-shadow border-2 border-secondary/20"
          onClick={isRecordingMessage ? stopMessageRecording : startMessageRecording}
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-secondary/10 rounded-full">
              {isRecordingMessage ? (
                <Video className="h-4 w-4 text-red-500 animate-pulse" />
              ) : (
                <Camera className="h-4 w-4 text-secondary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {isRecordingMessage ? 'Stop Recording' : 'Record Message'}
              </p>
              <p className="text-xs text-gray-500">
                {isRecordingMessage ? 'Recording...' : 'Create new'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};
