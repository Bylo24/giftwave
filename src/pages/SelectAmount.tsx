
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RecipientStep } from "@/components/gift/RecipientStep";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGiftDesign } from "@/hooks/useGiftDesign";
import { GiftLoadingState } from "@/components/gift/GiftLoadingState";
import { GiftNotFound } from "@/components/gift/GiftNotFound";
import { PageContainer } from "@/components/layout/PageContainer";

const SelectAmountContent = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const draftToken = localStorage.getItem('gift_draft_token');
  
  const {
    giftDesign,
    isLoading,
    error,
    setPreviewMode,
    isEditable
  } = useGiftDesign(draftToken);

  // Handle missing token
  if (!draftToken) {
    navigate('/frontcard');
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <PageContainer>
        <GiftLoadingState />
      </PageContainer>
    );
  }

  // Handle errors or missing data
  if (error || !giftDesign) {
    return (
      <PageContainer>
        <GiftNotFound />
      </PageContainer>
    );
  }

  // Check if gift is editable
  if (!isEditable) {
    return (
      <PageContainer>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <p className="text-amber-600 mb-4">This gift cannot be edited</p>
          <Button 
            onClick={() => navigate("/frontcard")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Start New Gift
          </Button>
        </div>
      </PageContainer>
    );
  }

  const handleNext = () => {
    setPreviewMode();
  };

  return (
    <PageContainer>
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
        <RecipientStep 
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          recipientName={recipientName}
          setRecipientName={setRecipientName}
          onNext={handleNext}
        />
      </div>
    </PageContainer>
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
