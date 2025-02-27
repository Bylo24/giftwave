
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RecipientStep } from "@/components/gift/RecipientStep";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGiftDesign } from "@/hooks/useGiftDesign";
import { GiftLoadingState } from "@/components/gift/GiftLoadingState";
import { GiftNotFound } from "@/components/gift/GiftNotFound";
import { toast } from "sonner";

const SelectRecipientContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");

  const {
    giftDesign,
    isLoading,
    error,
    isEditable
  } = useGiftDesign(token);

  if (!token) {
    navigate('/frontcard');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative transition-colors duration-300">
        <GiftLoadingState />
      </div>
    );
  }

  if (error || !giftDesign) {
    return (
      <div className="min-h-screen relative transition-colors duration-300">
        <GiftNotFound />
      </div>
    );
  }

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

  const handleNext = async () => {
    try {
      navigate(`/previewanimation?token=${token}`);
      toast.success("Recipient details saved");
    } catch (error) {
      console.error("Error proceeding to preview:", error);
      toast.error("Failed to proceed to preview");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

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
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10 bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        <div className="px-4 pb-4 max-w-md mx-auto">
          <RecipientStep 
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            recipientName={recipientName}
            setRecipientName={setRecipientName}
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>
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
