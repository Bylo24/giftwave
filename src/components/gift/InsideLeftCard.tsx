
import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Upload, Image, Plus, DollarSign, ArrowRight } from "lucide-react";
import { ThemeOption, PatternType, Sticker } from "@/types/gift";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StickerLayer } from "./StickerLayer";
import { AmountStep } from "./AmountStep";

interface Memory {
  imageUrl: string;
  caption: string;
}

interface InsideLeftCardProps {
  selectedThemeOption: ThemeOption;
  onBack: () => void;
  onNext: () => void;
}

const InsideLeftCard = ({
  selectedThemeOption,
  onBack,
  onNext
}: InsideLeftCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState("");

  const handleNavigateToAmount = () => {
    onNext();
  };

  return (
    <div className="min-h-screen relative transition-colors duration-300" 
      style={{ backgroundColor: selectedThemeOption.screenBgColor }}
    >
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 10%, transparent 11%)',
        backgroundSize: '30px 30px',
        backgroundPosition: '0 0, 15px 15px'
      }} />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-white rounded-full">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <AmountStep 
              amount={amount}
              setAmount={setAmount}
              onNext={handleNavigateToAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsideLeftCard;
