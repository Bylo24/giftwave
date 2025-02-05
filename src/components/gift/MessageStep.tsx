import { Video, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

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
  const handleMessageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setMessageVideo(file);
        toast.success('Video message uploaded successfully!');
      } else {
        toast.error('Please upload a video file');
      }
    }
  };

  return (
    <Card className="p-6 space-y-4 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-secondary/10 rounded-full animate-pulse">
          <Video className="h-6 w-6 text-secondary" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary to-orange-500 bg-clip-text text-transparent">
          Record Your Message
        </h2>
      </div>
      <p className="text-gray-600">Send them a personal video message they'll love!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 border-secondary/20">
          <label className="flex flex-col items-center gap-3 cursor-pointer">
            <div className="p-3 bg-secondary/10 rounded-full">
              <Upload className="h-6 w-6 text-secondary" />
            </div>
            <div className="text-center">
              <p className="font-medium">Upload Message</p>
              <p className="text-sm text-gray-500">Max size: 100MB</p>
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
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 border-secondary/20"
          onClick={isRecordingMessage ? stopMessageRecording : startMessageRecording}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-secondary/10 rounded-full">
              {isRecordingMessage ? (
                <Video className="h-6 w-6 text-red-500 animate-pulse" />
              ) : (
                <Camera className="h-6 w-6 text-secondary" />
              )}
            </div>
            <div className="text-center">
              <p className="font-medium">
                {isRecordingMessage ? 'Stop Recording' : 'Record Message'}
              </p>
              <p className="text-sm text-gray-500">
                {isRecordingMessage ? 'Recording in progress...' : 'Create a new message'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Button 
        className="w-full bg-gradient-to-r from-secondary to-orange-500 hover:opacity-90 transition-opacity"
        onClick={onNext}
      >
        {messageVideo ? 'Continue' : 'Skip Message'}
      </Button>
    </Card>
  );
};