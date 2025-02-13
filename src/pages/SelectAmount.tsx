
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AmountStep } from "@/components/gift/AmountStep";

const SelectAmountContent = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");

  const handleNext = () => {
    navigate('/preview-gift');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto">
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
