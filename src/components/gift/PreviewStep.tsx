
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { giftThemes, ThemeType } from "@/utils/giftThemes";
import { GiftCard } from "./GiftCard";

interface Memory {
  id: string;
  imageUrl?: string;
  caption: string;
  date: Date;
}

interface GiftMemory {
  caption: string;
  image?: File;
  date: Date;
}

interface PreviewStepProps {
  theme: ThemeType;
  phoneNumber: string;
  amount: string;
  messageVideo: File | null;
  memory: GiftMemory;
  memories: Memory[];
  onNext: () => void;
}

export const PreviewStep = ({ 
  theme = 'birthday',
  phoneNumber, 
  amount, 
  messageVideo,
  memories,
  onNext 
}: PreviewStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <GiftCard
        theme={theme}
        messageVideo={messageVideo}
        memories={memories}
        amount={amount}
      />
      
      <Button 
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
        onClick={onNext}
      >
        Continue to Payment
      </Button>
    </div>
  );
};
