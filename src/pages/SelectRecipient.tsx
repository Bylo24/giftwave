
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RecipientStep } from "@/components/gift/RecipientStep";

const SelectRecipientContent = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleNext = () => {
    navigate('/add-message');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto">
        <RecipientStep 
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          onNext={handleNext}
        />
      </div>
    </div>
  );
};

const SelectRecipient = () => {
  return (
    <ThemeProvider>
      <SelectRecipientContent />
    </ThemeProvider>
  );
};

export default SelectRecipient;
