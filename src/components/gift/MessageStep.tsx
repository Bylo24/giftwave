
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MessageStepProps {
  isOpen: boolean;
  onClose: () => void;
  messageVideo: File | null;
  setMessageVideo: (file: File | null) => void;
  onNext: () => void;
}

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_VIDEO_DURATION = 60; // seconds

export const MessageStep = ({
  isOpen,
  onClose,
  messageVideo,
  setMessageVideo,
  onNext,
}: MessageStepProps) => {
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    return () => {
      // Cleanup preview URL when component unmounts
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const validateVideo = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > MAX_VIDEO_DURATION) {
          toast.error(`Video must be shorter than ${MAX_VIDEO_DURATION} seconds`);
          resolve(false);
          return;
        }
        setVideoDuration(video.duration);
        resolve(true);
      };

      video.onerror = () => {
        toast.error('Error validating video format');
        resolve(false);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleMessageUpload = async (file: File) => {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      toast.error('Please upload an MP4, MOV, or WebM video');
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      toast.error('Video must be smaller than 50MB');
      return;
    }

    const isValid = await validateVideo(file);
    if (!isValid) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      // Create upload event handler
      const handleProgress = (event: ProgressEvent) => {
        const percent = (event.loaded / event.total) * 100;
        setUploadProgress(Math.round(percent));
      };

      const { error: uploadError, data } = await supabase.storage
        .from('gift_videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

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
      setUploadProgress(0);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleMessageUpload(file);
    }
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
                <div className="text-center space-y-4">
                  <input 
                    type="file" 
                    accept={ALLOWED_VIDEO_TYPES.join(',')}
                    capture="user"
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
                      className="bg-white/10 hover:bg-white/20 text-white"
                      disabled={isUploading}
                    >
                      {isUploading ? `Uploading: ${uploadProgress}%` : 'Upload/Record a video message'}
                    </Button>
                  </label>
                  <div className="space-y-2 text-white/80 text-sm">
                    <p>Maximum video length: {MAX_VIDEO_DURATION} seconds</p>
                    <p>Maximum file size: 50MB</p>
                    <p>Supported formats: MP4, MOV, WebM</p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
                  <p>Uploading: {uploadProgress}%</p>
                </div>
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
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="bg-black p-6">
            <div className="flex justify-center">
              {messageVideo && (
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
