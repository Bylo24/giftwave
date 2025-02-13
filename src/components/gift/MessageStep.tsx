
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface MessageStepProps {
  isOpen: boolean;
  onClose: () => void;
  messageVideo: File | null;
  setMessageVideo: (file: File | null) => void;
  onNext: () => void;
}

export const MessageStep = ({
  isOpen,
  onClose,
  messageVideo,
  setMessageVideo,
  onNext,
}: MessageStepProps) => {
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
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
                      {isUploading ? 'Uploading...' : 'Upload a video message'}
                    </Button>
                  </label>
                  <p className="text-sm text-gray-500 mt-2">Videos will be saved automatically</p>
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
