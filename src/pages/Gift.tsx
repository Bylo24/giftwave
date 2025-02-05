import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft, Video, Upload, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Gift = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        toast.success('Video uploaded successfully!');
      } else {
        toast.error('Please upload a video file');
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
      setIsRecording(true);
      toast.success('Recording started!');
    } catch (error) {
      toast.error('Unable to access camera and microphone');
    }
  };

  const stopRecording = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
      setIsRecording(false);
      toast.success('Recording stopped!');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold">Create a Gift</h1>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Recipient Details</h2>
            <Input 
              placeholder="Search for a friend"
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Add a Memory</h2>
            <p className="text-sm text-gray-500">
              Record or upload a video message to make your gift special
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <label className="flex flex-col items-center gap-3 cursor-pointer">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Upload Video</p>
                    <p className="text-sm text-gray-500">Max size: 100MB</p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </Card>

              <Card 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={isRecording ? stopRecording : startRecording}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-pink-50 rounded-full">
                    {isRecording ? (
                      <Video className="h-6 w-6 text-red-500" />
                    ) : (
                      <Camera className="h-6 w-6 text-pink-500" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-medium">
                      {isRecording ? 'Stop Recording' : 'Record Video'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isRecording ? 'Recording in progress...' : 'Create a new memory'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {(selectedFile || isRecording) && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">
                    {selectedFile ? `Selected: ${selectedFile.name}` : 'Recording in progress...'}
                  </p>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => toast.success('Gift sent successfully!')}
                >
                  Send Gift
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default Gift;