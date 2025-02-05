import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft } from "lucide-react";
import { RecipientStep } from "@/components/gift/RecipientStep";
import { MessageStep } from "@/components/gift/MessageStep";
import { AmountStep } from "@/components/gift/AmountStep";
import { PreviewStep } from "@/components/gift/PreviewStep";
import { ThemeStep } from "@/components/gift/ThemeStep";
import { MemoryStep } from "@/components/gift/MemoryStep";
import { MemoryReplayScreen } from "@/components/gift/MemoryReplayScreen";
import { toast } from "sonner";
import { ThemeType } from "@/utils/giftThemes";

type Step = 'theme' | 'recipient' | 'message' | 'amount' | 'memory' | 'preview' | 'payment' | 'replay';

interface GiftMemory {
  caption: string;
  image?: File;
  date: Date;
}

interface Memory {
  id: string;
  imageUrl?: string;
  caption: string;
  date: Date;
}

const Gift = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('theme');
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('birthday');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const [isRecordingMessage, setIsRecordingMessage] = useState(false);
  const [messageStream, setMessageStream] = useState<MediaStream | null>(null);
  const [amount, setAmount] = useState('');
  const [memory, setMemory] = useState<GiftMemory>({
    caption: '',
    date: new Date()
  });
  const [memories, setMemories] = useState<Memory[]>([]);

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

  const handlePayment = async () => {
    try {
      // Simulated payment process
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Payment successful!');
      navigate('/my-gifts');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  const handleAddMemory = (newMemory: Omit<Memory, "id">) => {
    const memoryWithId = {
      ...newMemory,
      id: crypto.randomUUID(),
    };
    setMemories([...memories, memoryWithId]);
  };

  const nextStep = () => {
    const steps: Step[] = ['theme', 'recipient', 'message', 'amount', 'memory', 'preview', 'payment', 'replay'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      handlePayment();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'theme':
        return (
          <ThemeStep
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            onNext={nextStep}
          />
        );
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
      case 'memory':
        return (
          <MemoryStep
            memory={memory}
            setMemory={setMemory}
            onNext={nextStep}
          />
        );
      case 'preview':
        return (
          <PreviewStep
            theme={selectedTheme}
            phoneNumber={phoneNumber}
            amount={amount}
            messageVideo={messageVideo}
            memory={memory}
            onNext={nextStep}
          />
        );
      case 'replay':
        return (
          <MemoryReplayScreen
            memories={memories}
            onAddMemory={handleAddMemory}
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            {currentStep === 'replay' ? 'Memory Replay' : 'Create a Gift'}
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
