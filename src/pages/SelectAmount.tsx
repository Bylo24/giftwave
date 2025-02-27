
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
    return (
      <div className="min-h-screen relative transition-colors duration-300">
        <GiftLoadingState />
      </div>
    );
  }

  // Handle errors or missing data
  if (error || !giftDesign) {
    return (
      <div className="min-h-screen relative transition-colors duration-300">
        <GiftNotFound />
      </div>
    );
  }

  // Check if gift is editable
  if (!isEditable) {
    return (
      <div 
        className="min-h-screen relative transition-colors duration-300"
        style={{ 
          background: 'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)'
        }}
      >
        <div className="absolute inset-0" 
          style={{
            background: 'radial-gradient(circle at 30% 40%, rgba(138, 43, 226, 0.4) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(72, 61, 139, 0.4) 0%, transparent 40%)',
            filter: 'blur(30px)'
          }}
        />
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
          <p className="text-amber-600 mb-4">This gift cannot be edited</p>
          <Button 
            onClick={() => navigate("/frontcard")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Start New Gift
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative transition-colors duration-300"
      style={{ 
        background: 'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)'
      }}
    >
      <div className="absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(138, 43, 226, 0.4) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(72, 61, 139, 0.4) 0%, transparent 40%)',
          filter: 'blur(30px)'
        }}
      />
      
      <div className="relative z-10">
        <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-white/80 backdrop-blur-lg z-20">
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
