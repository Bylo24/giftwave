
import { Video, Camera, X, StopCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MessageStepProps {
  isOpen: boolean;
  onClose: () => void;
  messageVideo: File | null;
  setMessageVideo: (file: File | null) => void;
  isRecordingMessage: boolean;
  startMessageRecording: () => void;
  stopMessageRecording: () => void;
  onNext: () => void;
}

export const MessageStep = ({
  isOpen,
  onClose,
  messageVideo,
  setMessageVideo,
  isRecordingMessage,
  startMessageRecording,
  stopMessageRecording,
  onNext,
}: MessageStepProps) => {
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

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
          onClose();
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

  const handleStartRecording = () => {
    startMessageRecording();
    setRecordingDuration(0);
    recordingTimer.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    stopMessageRecording();
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
      recordingTimer.current = null;
    }
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="p-0 border-0 max-w-full h-full sm:h-[80vh] bg-black">
        <div className="flex flex-col h-full">
          {/* Camera Preview Area */}
          <div className="flex-1 relative">
            {messageVideo ? (
              <video
                src={URL.createObjectURL(messageVideo)}
                className="w-full h-full object-cover"
                controls
                playsInline
              />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <Camera className="h-20 w-20 text-gray-600" />
              </div>
            )}

            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </Button>
              
              {isRecordingMessage && (
                <div className="bg-black/50 px-4 py-2 rounded-full">
                  <span className="text-white font-medium">
                    {formatDuration(recordingDuration)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="bg-black p-6 space-y-4">
            <div className="flex justify-center gap-4">
              {!messageVideo ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-16 h-16 rounded-full",
                      isRecordingMessage
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-white hover:bg-gray-200"
                    )}
                    onClick={isRecordingMessage ? handleStopRecording : handleStartRecording}
                  >
                    {isRecordingMessage ? (
                      <StopCircle className="h-8 w-8 text-white" />
                    ) : (
                      <Circle className="h-8 w-8 text-red-500" />
                    )}
                  </Button>

                  <label className="flex items-center">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleMessageUpload}
                      disabled={isUploading}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-16 h-16 rounded-full bg-white hover:bg-gray-200"
                    >
                      <Video className="h-8 w-8 text-gray-900" />
                    </Button>
                  </label>
                </>
              ) : (
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => setMessageVideo(null)}
                  >
                    Retake
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={() => {
                      onNext();
                      onClose();
                    }}
                  >
                    Continue
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
