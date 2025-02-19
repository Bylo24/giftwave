
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AmountStep } from "@/components/gift/AmountStep";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGiftDesign } from "@/hooks/useGiftDesign";
import { GiftLoadingState } from "@/components/gift/GiftLoadingState";
import { GiftNotFound } from "@/components/gift/GiftNotFound";

const SelectAmountContent = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const draftToken = localStorage.getItem('gift_draft_token');
  
  const {
    giftDesign,
    isLoading,
    error,
    setPreviewMode,
    isEditable
  } = useGiftDesign(draftToken);

  useEffect(() => {
    if (giftDesign?.selected_amount) {
      setAmount(giftDesign.selected_amount.toString());
    }
  }, [giftDesign]);

  // Handle missing token
  if (!draftToken) {
    navigate('/frontcard');
    return null;
  }

  // Show loading state
  if (isLoading) {
    return <GiftLoadingState />;
  }

  // Handle errors or missing data
  if (error || !giftDesign) {
    return <GiftNotFound />;
  }

  // Check if gift is editable
  if (!isEditable) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-amber-600 mb-4">This gift cannot be edited</p>
        <Button 
          onClick={() => navigate("/frontcard")}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Start New Gift
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
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

      <div className="min-h-screen pt-20 px-4 pb-4 max-w-md mx-auto">
        <AmountStep 
          amount={amount}
          setAmount={setAmount}
          onNext={setPreviewMode}
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

