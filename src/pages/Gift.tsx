
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
type CardView = 'card' | 'message' | 'envelope';

interface ThemeOption {
  text: string;
  emoji: string;
  bgColor: string;
  textColors: string[];
}

const themeOptions: ThemeOption[] = [
  {
    text: "MERRY",
    emoji: "🧦",
    bgColor: "bg-[#F5F2E8]",
    textColors: ["text-[#2E5A2C]", "text-[#1B4B6B]", "text-[#EA384C]", "text-[#FF9EBA]", "text-[#C4D6A0]"]
  },
  {
    text: "HAPPY BIRTHDAY",
    emoji: "🎂",
    bgColor: "bg-[#FFF6E9]",
    textColors: ["text-[#FF6B6B]", "text-[#4ECDC4]", "text-[#FFD93D]", "text-[#FF6B6B]", "text-[#4ECDC4]"]
  },
  {
    text: "CONGRATS",
    emoji: "🎉",
    bgColor: "bg-[#F0FFF4]",
    textColors: ["text-[#38A169]", "text-[#2B6CB0]", "text-[#805AD5]", "text-[#38A169]", "text-[#2B6CB0]"]
  },
  {
    text: "THANK YOU",
    emoji: "💝",
    bgColor: "bg-[#FFF5F5]",
    textColors: ["text-[#E53E3E]", "text-[#DD6B20]", "text-[#D53F8C]", "text-[#E53E3E]", "text-[#DD6B20]"]
  }
];

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
  const [selectedThemeOption, setSelectedThemeOption] = useState<ThemeOption>(themeOptions[0]);

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
          
          <select
            value={selectedThemeOption.text}
            onChange={(e) => {
              const newTheme = themeOptions.find(t => t.text === e.target.value);
              if (newTheme) setSelectedThemeOption(newTheme);
            }}
            className="px-4 py-2 bg-white rounded-full text-gray-800 font-medium"
          >
            {themeOptions.map((theme) => (
              <option key={theme.text} value={theme.text}>
                {theme.text}
              </option>
            ))}
          </select>
          
          <button 
            onClick={() => goToNextStep('message')}
            className="px-6 py-2 bg-white rounded-full text-gray-800 font-medium"
          >
            Next
          </button>
        </div>

        <div className="flex-1 px-4 pt-4">
          <div className={`${selectedThemeOption.bgColor} rounded-lg aspect-[3/4] w-full max-w-md mx-auto shadow-lg p-8 transition-colors duration-300`}>
            <div className="h-full flex flex-col items-center justify-center space-y-8">
              <div className="text-center">
                {selectedThemeOption.text.split('').map((letter, index) => (
                  <span 
                    key={index} 
                    className={`text-8xl font-serif ${selectedThemeOption.textColors[index % selectedThemeOption.textColors.length]}`}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              
              <div className="text-6xl animate-bounce">
                {selectedThemeOption.emoji}
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
