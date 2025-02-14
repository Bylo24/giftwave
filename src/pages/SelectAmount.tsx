
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
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Navigation */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-white/80 backdrop-blur-lg z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
      </div>

      {/* Centered Content */}
      <div className="min-h-screen pt-20 px-4 pb-4 max-w-md mx-auto">
        <AmountStep 
          amount={amount}
          setAmount={setAmount}
          onNext={handleNext}
        />
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
