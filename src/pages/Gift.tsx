
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { ThemeType } from "@/utils/giftThemes";

interface ThemeOption {
  text: string;
  emoji: string;
  bgColor: string;
  textColors: string[];
}

interface Memory {
  id: string;
  imageUrl?: string;
  caption: string;
  date: Date;
}

interface GiftMemory {
  caption: string;
  date: Date;
}

const themeOptions: ThemeOption[] = [
  {
    text: "HAPPY BIRTHDAY",
    emoji: "🎂",
    bgColor: "bg-[#FFF6E9]",
    textColors: ["text-[#FF6B6B]", "text-[#4ECDC4]", "text-[#FFD93D]", "text-[#FF6B6B]", "text-[#4ECDC4]"]
  },
  {
    text: "CONGRATULATIONS",
    emoji: "🎉",
    bgColor: "bg-[#F0FFF4]",
    textColors: ["text-[#38A169]", "text-[#2B6CB0]", "text-[#805AD5]", "text-[#38A169]", "text-[#2B6CB0]"]
  },
  {
    text: "MERRY CHRISTMAS",
    emoji: "🎄",
    bgColor: "bg-[#F5F2E8]",
    textColors: ["text-[#2E5A2C]", "text-[#1B4B6B]", "text-[#EA384C]", "text-[#FF9EBA]", "text-[#C4D6A0]"]
  },
  {
    text: "THANK YOU",
    emoji: "💝",
    bgColor: "bg-[#FFF5F5]",
    textColors: ["text-[#E53E3E]", "text-[#DD6B20]", "text-[#D53F8C]", "text-[#E53E3E]", "text-[#DD6B20]"]
  },
  {
    text: "GOOD LUCK",
    emoji: "🍀",
    bgColor: "bg-[#ECFDF5]",
    textColors: ["text-[#047857]", "text-[#059669]", "text-[#10B981]", "text-[#047857]", "text-[#059669]"]
  }
];

const stickerOptions = [
  { emoji: "⭐", name: "Star" },
  { emoji: "💫", name: "Sparkle" },
  { emoji: "✨", name: "Glitter" },
  { emoji: "🌟", name: "Glow" },
  { emoji: "💝", name: "Heart" },
];

const Gift = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'recipient' | 'message' | 'amount' | 'memory' | 'preview' | 'payment'>('recipient');
  const [previousSteps, setPreviousSteps] = useState<Array<'recipient' | 'message' | 'amount' | 'memory' | 'preview' | 'payment'>>([]);
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
  const [selectedThemeOption, setSelectedThemeOption] = useState<ThemeOption>(themeOptions[0]);
  const [showStickers, setShowStickers] = useState(false);

  const goToPreviousStep = () => {
    if (previousSteps.length > 0) {
      const prevStep = previousSteps[previousSteps.length - 1];
      setCurrentStep(prevStep);
      setPreviousSteps(prev => prev.slice(0, -1));
    } else {
      navigate('/');
    }
  };

  const goToNextStep = (nextStep: 'recipient' | 'message' | 'amount' | 'memory' | 'preview' | 'payment') => {
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
          
          <div className="relative">
            <select
              value={selectedThemeOption.text}
              onChange={(e) => {
                const newTheme = themeOptions.find(t => t.text === e.target.value);
                if (newTheme) setSelectedThemeOption(newTheme);
              }}
              className="appearance-none pl-4 pr-10 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium border-0 shadow-lg focus:ring-2 focus:ring-white/50 focus:outline-none cursor-pointer"
            >
              {themeOptions.map((theme) => (
                <option key={theme.text} value={theme.text} className="py-2">
                  {theme.text}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
          </div>
          
          <button 
            onClick={() => goToNextStep('message')}
            className="px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium shadow-lg hover:bg-white/95 transition-colors"
          >
            Next
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className={`${selectedThemeOption.bgColor} rounded-lg aspect-[3/4] w-full max-w-md shadow-lg p-8 transition-colors duration-300`}>
            <div className="h-full flex flex-col items-center justify-center space-y-8">
              <div className="text-center">
                {selectedThemeOption.text.split('').map((letter, index) => (
                  <span 
                    key={index} 
                    className={`text-3xl sm:text-5xl md:text-8xl font-serif ${selectedThemeOption.textColors[index % selectedThemeOption.textColors.length]}`}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              
              <div className="text-4xl sm:text-5xl md:text-6xl animate-bounce">
                {selectedThemeOption.emoji}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-center max-w-md mx-auto relative">
            <div className="relative group">
              <button 
                onClick={() => setShowStickers(!showStickers)}
                className="flex flex-col items-center space-y-1"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg group-hover:bg-white/95 transition-colors">
                  <span className="text-2xl">⭐</span>
                </div>
                <span className="text-xs text-white font-medium">Stickers</span>
              </button>
              
              {showStickers && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl grid grid-cols-5 gap-2 min-w-[200px]">
                  {stickerOptions.map((sticker, index) => (
                    <button 
                      key={index}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white/50 rounded-full transition-colors"
                    >
                      <span className="text-2xl">{sticker.emoji}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
