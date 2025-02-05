import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft } from "lucide-react";
import { RecipientStep } from "@/components/gift/RecipientStep";
import { MessageStep } from "@/components/gift/MessageStep";
import { AmountStep } from "@/components/gift/AmountStep";
import { toast } from "sonner";

type Step = 'recipient' | 'message' | 'amount' | 'preview' | 'payment' | 'memory' | 'animation';

const Gift = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('recipient');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const [memoryVideo, setMemoryVideo] = useState<File | null>(null);
  const [isRecordingMessage, setIsRecordingMessage] = useState(false);
  const [messageStream, setMessageStream] = useState<MediaStream | null>(null);
  const [amount, setAmount] = useState('');
  const [memoryCaption, setMemoryCaption] = useState('');

  const startMessageRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMessageStream(stream);
      setIsRecordingMessage(true);
      toast.success('Recording started!');
    } catch (error) {
      toast.error('Unable to access camera and microphone');
    }
  };

  const stopMessageRecording = () => {
    if (messageStream) {
      messageStream.getTracks().forEach(track => track.stop());
      setMessageStream(null);
      setIsRecordingMessage(false);
      toast.success('Recording stopped!');
    }
  };

  const nextStep = () => {
    const steps: Step[] = ['recipient', 'message', 'amount', 'preview', 'payment', 'memory', 'animation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'recipient':
        return (
          <RecipientStep
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onNext={nextStep}
          />
        );
      case 'message':
        return (
          <MessageStep
            messageVideo={messageVideo}
            setMessageVideo={setMessageVideo}
            isRecordingMessage={isRecordingMessage}
            startMessageRecording={startMessageRecording}
            stopMessageRecording={stopMessageRecording}
            onNext={nextStep}
          />
        );
      case 'amount':
        return (
          <AmountStep
            amount={amount}
            setAmount={setAmount}
            onNext={nextStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 pb-16">
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/")}
            className="p-2 hover:bg-white/80 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create a Gift
          </h1>
        </div>

        <div className="animate-fade-in">
          {renderStep()}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Gift;