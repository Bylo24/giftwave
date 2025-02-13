
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft } from "lucide-react";
import { RecipientStep } from "@/components/gift/RecipientStep";
import { MessageStep } from "@/components/gift/MessageStep";
import { AmountStep } from "@/components/gift/AmountStep";
import { PreviewStep } from "@/components/gift/PreviewStep";
import { MemoryStep } from "@/components/gift/MemoryStep";
import { MemoryReplayScreen } from "@/components/gift/MemoryReplayScreen";
import { GiftCard } from "@/components/gift/GiftCard";
import { toast } from "sonner";
import { ThemeType } from "@/utils/giftThemes";

type Step = 'recipient' | 'message' | 'amount' | 'memory' | 'preview' | 'payment';

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
  const [currentStep, setCurrentStep] = useState<Step>('recipient');
  const [previousSteps, setPreviousSteps] = useState<Step[]>([]);
  const [selectedTheme] = useState<ThemeType>('birthday');
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
    } else {
      navigate('/');
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
    toast.info("Recording started...");
  };

  const stopMessageRecording = () => {
    setIsRecordingMessage(false);
    toast.success("Recording stopped!");
  };

  const renderStep = () => {
    const commonCardProps = {
      theme: selectedTheme,
      messageVideo,
      memories,
      amount,
    };

    switch (currentStep) {
      case 'recipient':
        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4 mb-4">
              <p className="text-sm text-blue-600">Step 1 of 6: Enter the recipient's phone number</p>
            </div>
            <GiftCard {...commonCardProps} />
            <RecipientStep
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onNext={() => {
                if (!phoneNumber) {
                  toast.error("Please enter a phone number to continue");
                  return;
                }
                goToNextStep('message');
              }}
            />
          </div>
        );
      case 'message':
        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4 mb-4">
              <p className="text-sm text-blue-600">Step 2 of 6: Record or upload your message</p>
            </div>
            <GiftCard {...commonCardProps} />
            <MessageStep
              messageVideo={messageVideo}
              setMessageVideo={setMessageVideo}
              isRecordingMessage={isRecordingMessage}
              startMessageRecording={startMessageRecording}
              stopMessageRecording={stopMessageRecording}
              onNext={() => goToNextStep('amount')}
            />
          </div>
        );
      case 'amount':
        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4 mb-4">
              <p className="text-sm text-blue-600">Step 3 of 6: Choose the gift amount</p>
            </div>
            <GiftCard {...commonCardProps} />
            <AmountStep
              amount={amount}
              setAmount={setAmount}
              onNext={() => {
                if (!amount) {
                  toast.error("Please enter an amount to continue");
                  return;
                }
                goToNextStep('memory');
              }}
            />
          </div>
        );
      case 'memory':
        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4 mb-4">
              <p className="text-sm text-blue-600">Step 4 of 6: Add special memories</p>
              <p className="text-xs text-blue-500 mt-1">Your memories are automatically saved when added</p>
            </div>
            <GiftCard {...commonCardProps} />
            <MemoryReplayScreen
              memories={memories}
              onAddMemory={handleAddMemory}
              onNext={() => {
                if (memories.length === 0) {
                  if (window.confirm("Are you sure you want to continue without adding any memories? Click 'Add Memory' to lock it in.")) {
                    goToNextStep('preview');
                  }
                } else {
                  goToNextStep('preview');
                }
              }}
            />
          </div>
        );
      case 'preview':
        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4 mb-4">
              <p className="text-sm text-blue-600">Step 5 of 6: Review your gift</p>
            </div>
            <PreviewStep
              theme={selectedTheme}
              phoneNumber={phoneNumber}
              amount={amount}
              messageVideo={messageVideo}
              memory={memory}
              memories={memories}
              onNext={() => goToNextStep('payment')}
            />
          </div>
        );
      case 'payment':
        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4 mb-4">
              <p className="text-sm text-blue-600">Final Step: Complete payment</p>
            </div>
            <GiftCard {...commonCardProps} />
            <div className="text-center p-6">
              <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>
              <p className="text-gray-600">Payment processing coming soon!</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'recipient':
        return 'Select Your Recipient';
      case 'message':
        return 'Record Your Message';
      case 'amount':
        return 'Choose Amount';
      case 'memory':
        return 'Add Memories';
      case 'preview':
        return 'Preview & Send';
      case 'payment':
        return "Complete Payment";
      default:
        return 'Create a Gift';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'recipient':
        return 'Choose who you want to send a gift to by phone number, and let us do the rest!';
      case 'message':
        return 'Record a heartfelt video message or upload one from your device.';
      case 'amount':
        return 'Choose how much you would like to gift.';
      case 'memory':
        return 'Add special photos and memories to make your gift more meaningful.';
      case 'preview':
        return 'Review your gift, confirm the details, and proceed to payment.';
      case 'payment':
        return 'Complete your payment to send this special gift!';
      default:
        return '';
    }
  };

  const getProgressPercentage = () => {
    const steps: Step[] = ['recipient', 'message', 'amount', 'memory', 'preview', 'payment'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              {getStepTitle()}
            </h1>
            <p className="text-sm text-gray-600 mt-1">{getStepDescription()}</p>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${getProgressPercentage()}%` }}
          />
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
