
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RecipientStep } from "@/components/gift/RecipientStep";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
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
      <PageContainer>
        <GiftLoadingState />
      </PageContainer>
    );
  }

  if (error || !giftDesign) {
    return (
      <PageContainer>
        <GiftNotFound />
      </PageContainer>
    );
  }

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

  const handleNext = async () => {
    try {
      navigate(`/previewanimation?token=${token}`);
      toast.success("Recipient details saved");
    } catch (error) {
      console.error("Error proceeding to preview:", error);
      toast.error("Failed to proceed to preview");
    }
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

const SelectRecipient = () => {
  return (
    <ThemeProvider>
      <SelectRecipientContent />
    </ThemeProvider>
  );
};

export default SelectRecipient;
