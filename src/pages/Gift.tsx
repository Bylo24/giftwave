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
import { EditableText } from "@/components/gift/EditableText";
import { toast } from "sonner";
import { ThemeType } from "@/utils/giftThemes";

type Step = 'recipient' | 'message' | 'amount' | 'memory' | 'preview' | 'payment';
type CardView = 'card' | 'message' | 'envelope';

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
  const [selectedTheme] = useState<ThemeType>('holiday');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const [isRecordingMessage, setIsRecordingMessage] = useState(false);
  const [amount, setAmount] = useState('');
  const [memory, setMemory] = useState<GiftMemory>({
    caption: '',
    date: new Date()
  });
  const [memories, setMemories] = useState<Memory[]>([]);
  const [currentView, setCurrentView] = useState<CardView>('card');
  const [messageText, setMessageText] = useState(
    "Wishing you peace, joy and\nlove this holiday season. I miss\nyou like crazy and can't wait\nto see you in February."
  );
  const [signatureText, setSignatureText] = useState("Love,\nAllison");

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

  return (
    <div className="min-h-screen bg-[#8AB878] relative">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 10%, transparent 11%)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px'
        }}
      />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={goToPreviousStep}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full">
            <div className="h-5 w-5 text-gray-600">1</div>
          </button>
          
          <button 
            onClick={() => goToNextStep('message')}
            className="px-6 py-2 bg-white rounded-full text-gray-800 font-medium"
          >
            Next
          </button>
        </div>

        <div className="flex-1 px-4 pt-4">
          <div className="bg-[#F5F2E8] rounded-lg aspect-[3/4] w-full max-w-md mx-auto shadow-lg p-8">
            <div className="h-full flex flex-col items-center justify-between">
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <span className="text-8xl font-serif text-[#2E5A2C]">M</span>
                  <span className="text-8xl font-serif text-[#1B4B6B]">E</span>
                  <span className="text-8xl font-serif text-[#EA384C]">R</span>
                  <span className="text-8xl font-serif text-[#FF9EBA]">R</span>
                  <span className="text-8xl font-serif text-[#C4D6A0]">Y</span>
                </div>
                <div className="text-center mt-8">
                  <div className="text-[#EA384C] text-6xl">🧦</div>
                </div>
              </div>
              
              <div className="text-center text-[#2E5A2C] space-y-4 w-full">
                <EditableText
                  initialText={messageText}
                  onTextChange={setMessageText}
                  className="text-lg leading-relaxed"
                />
                <EditableText
                  initialText={signatureText}
                  onTextChange={setSignatureText}
                  className="text-xl"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-white rounded-full p-1 flex justify-between max-w-md mx-auto">
            <button 
              onClick={() => setCurrentView('card')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium ${
                currentView === 'card' ? 'bg-gray-900 text-white' : 'text-gray-600'
              }`}
            >
              Card
            </button>
            <button 
              onClick={() => setCurrentView('message')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium ${
                currentView === 'message' ? 'bg-gray-900 text-white' : 'text-gray-600'
              }`}
            >
              Message
            </button>
            <button 
              onClick={() => setCurrentView('envelope')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium ${
                currentView === 'envelope' ? 'bg-gray-900 text-white' : 'text-gray-600'
              }`}
            >
              Envelope
            </button>
          </div>

          <div className="flex justify-between items-center max-w-md mx-auto px-4">
            <button className="flex flex-col items-center space-y-1">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/lovable-uploads/209f908f-8bcc-4832-823d-f6dc2c0a1e50.png" alt="Templates" className="w-8 h-8" />
              </div>
              <span className="text-xs text-gray-500">Templates</span>
            </button>
            <button className="flex flex-col items-center space-y-1">
              <div className="w-12 h-12 flex items-center justify-center">
                <span className="text-3xl">T</span>
              </div>
              <span className="text-xs text-gray-500">Text</span>
            </button>
            <button className="flex flex-col items-center space-y-1">
              <div className="w-12 h-12 flex items-center justify-center">
                <span className="text-3xl">⭐</span>
              </div>
              <span className="text-xs text-gray-500">Stickers</span>
            </button>
            <button className="flex flex-col items-center space-y-1">
              <div className="w-12 h-12 flex items-center justify-center">
                <span className="text-3xl">📷</span>
              </div>
              <span className="text-xs text-gray-500">Video</span>
            </button>
            <button className="flex flex-col items-center space-y-1">
              <div className="w-12 h-12 flex items-center justify-center">
                <span className="text-3xl">📎</span>
              </div>
              <span className="text-xs text-gray-500">Props</span>
            </button>
          </div>
        </div>

        <div className="h-8 flex items-center justify-center">
          <div className="w-32 h-1 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Gift;
