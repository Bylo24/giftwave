
import { Video, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";

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

  const handleMessageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setMessageVideo(file);
        const url = URL.createObjectURL(file);
        setVideoPreviewUrl(url);
        toast.success('Video message uploaded successfully!');
      } else {
        toast.error('Please upload a video file');
      }
    }
  };

  return (
    <Card className="p-4 space-y-2 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-secondary/10 rounded-full">
          <Video className="h-4 w-4 text-secondary" />
        </div>
        <h2 className="text-lg font-semibold bg-gradient-to-r from-secondary to-orange-500 bg-clip-text text-transparent">
          Record Your Message
        </h2>
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
