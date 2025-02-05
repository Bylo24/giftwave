import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft, Video, Upload, Camera, Phone, Gift as GiftIcon, DollarSign, Eye, CreditCard, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Step = 'recipient' | 'video' | 'amount' | 'preview' | 'payment' | 'memory' | 'animation';

const Gift = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('recipient');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [amount, setAmount] = useState('');
  const [caption, setCaption] = useState('');

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

  const nextStep = () => {
    const steps: Step[] = ['recipient', 'video', 'amount', 'preview', 'payment', 'memory', 'animation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'recipient':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-medium">Choose Recipient</h2>
            </div>
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="text-lg"
            />
            <Button 
              className="w-full" 
              onClick={nextStep}
              disabled={!phoneNumber}
            >
              Continue
            </Button>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Video className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-medium">Record Message</h2>
            </div>
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
            <Button 
              className="w-full" 
              onClick={nextStep}
            >
              {selectedFile || isRecording ? 'Continue' : 'Skip Video Message'}
            </Button>
          </div>
        );

      case 'amount':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-medium">Select Amount</h2>
            </div>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
            />
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20, 50, 100, 200].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  onClick={() => setAmount(preset.toString())}
                  className="h-12"
                >
                  ${preset}
                </Button>
              ))}
            </div>
            <Button 
              className="w-full" 
              onClick={nextStep}
              disabled={!amount}
            >
              Continue
            </Button>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-medium">Preview Gift</h2>
            </div>
            <Card className="p-4">
              <div className="space-y-3">
                <p className="font-medium">Recipient: {phoneNumber}</p>
                <p className="font-medium">Amount: ${amount}</p>
                {selectedFile && <p className="font-medium">Video message attached</p>}
              </div>
            </Card>
            <Button className="w-full" onClick={nextStep}>
              Looks Good!
            </Button>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-medium">Choose Payment Method</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="outline" 
                className="h-16 justify-start px-4"
                onClick={nextStep}
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Pay from Wallet Balance
              </Button>
              <Button 
                variant="outline" 
                className="h-16 justify-start px-4"
                onClick={nextStep}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Pay with Card
              </Button>
            </div>
          </div>
        );

      case 'memory':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-medium">Add Memory</h2>
            </div>
            <Input
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mb-4"
            />
            <Button className="w-full" onClick={nextStep}>
              Finish Gift
            </Button>
          </div>
        );

      case 'animation':
        return (
          <div className="space-y-4 text-center">
            <GiftIcon className="h-16 w-16 text-primary mx-auto animate-bounce" />
            <h2 className="text-xl font-medium">Gift Sent Successfully!</h2>
            <p className="text-gray-500">Your gift is on its way to {phoneNumber}</p>
            <Button 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        );
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

        <Card className="p-6">
          {renderStepContent()}
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default Gift;