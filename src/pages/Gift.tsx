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

type Step = 'theme' | 'memory' | 'amount' | 'recipient' | 'message' | 'preview' | 'payment' | 'replay';

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
  const [previousSteps, setPreviousSteps] = useState<Step[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('birthday');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const [isRecordingMessage, setIsRecordingMessage] = useState(false);
  const [amount, setAmount] = useState('');
  const [memory, setMemory] = useState<GiftMemory>({
    caption: '',
    date: new Date()
  });
  const [memories, setMemories] = useState<Memory[]>([]);

  const goToPreviousStep = () => {
    if (previousSteps.length > 0) {
      const prevStep = previousSteps[previousSteps.length - 1];
      setCurrentStep(prevStep);
      setPreviousSteps(prev => prev.slice(0, -1));
    }
  };

  const goToNextStep = (nextStep: Step) => {
    setPreviousSteps(prev => [...prev, currentStep]);
    setCurrentStep(nextStep);
  };

  const handleAddMemory = (newMemory: Omit<Memory, "id">) => {
    const memoryWithId = {
      ...newMemory,
      id: crypto.randomUUID(),
    };
    setMemories(prev => [...prev, memoryWithId]);
    toast.success("Memory added successfully!");
  };

  const startMessageRecording = () => {
    setIsRecordingMessage(true);
    // Here you would typically implement the actual video recording logic
    toast.info("Recording started...");
  };

  const stopMessageRecording = () => {
    setIsRecordingMessage(false);
    // Here you would typically implement the logic to save the recorded video
    toast.success("Recording stopped!");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'theme':
        return (
          <ThemeStep
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            onNext={() => goToNextStep('memory')}
          />
        );
      case 'memory':
        return (
          <MemoryReplayScreen
            memories={memories}
            onAddMemory={handleAddMemory}
            onNext={() => goToNextStep('amount')}
          />
        );
      case 'amount':
        return (
          <AmountStep
            amount={amount}
            setAmount={setAmount}
            onNext={() => goToNextStep('recipient')}
          />
        );
      case 'recipient':
        return (
          <RecipientStep
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onNext={() => goToNextStep('message')}
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
            onNext={() => goToNextStep('preview')}
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
            onNext={() => goToNextStep('payment')}
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
            onClick={goToPreviousStep}
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