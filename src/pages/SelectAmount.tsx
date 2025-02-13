
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AmountStep } from "@/components/gift/AmountStep";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SelectAmountContent = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");

  const handleNext = () => {
    navigate('/preview-gift');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header Navigation */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="bg-white rounded-full w-10 h-10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>

        <Button
          variant="ghost"
          className="bg-white rounded-full px-6 py-2 text-gray-800"
          onClick={() => navigate('/preview-gift')}
        >
          <span className="font-medium">Continue</span>
          <span className="ml-2">→</span>
        </Button>
      </div>

      {/* Centered Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AmountStep 
            amount={amount}
            setAmount={setAmount}
            onNext={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

const SelectAmount = () => {
  return (
    <ThemeProvider>
      <SelectAmountContent />
    </ThemeProvider>
  );
};

export default SelectAmount;
