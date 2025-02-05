import { Gift, Heart, Video, DollarSign, PartyPopper, User, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { giftThemes, ThemeType } from "@/utils/giftThemes";
import { useState } from "react";
import { GiftRevealAnimation } from "./GiftRevealAnimation";
import { toast } from "sonner";

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
  onNext: () => void;
}

export const PreviewStep = ({ 
  theme = 'birthday',
  phoneNumber, 
  amount, 
  messageVideo,
  memory,
  onNext 
}: PreviewStepProps) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const selectedTheme = giftThemes[theme] || giftThemes.birthday;

  const handlePreview = () => {
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    toast.success("Gift preview complete!");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-md mx-auto">
      {showAnimation && (
        <GiftRevealAnimation
          messageVideo={messageVideo}
          amount={amount}
          memory={memory}
          onComplete={handleAnimationComplete}
        />
      )}

      <Card className={`p-6 space-y-6 bg-gradient-to-br ${selectedTheme.colors.secondary}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 bg-opacity-10 rounded-full ${selectedTheme.animations[0]}`}>
            <PartyPopper className={`h-6 w-6 ${selectedTheme.colors.accent}`} />
          </div>
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${selectedTheme.colors.primary} bg-clip-text text-transparent`}>
            Preview Gift
          </h2>
        </div>

        <Card className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div className={`h-24 bg-gradient-to-r ${selectedTheme.colors.primary} relative`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl">{selectedTheme.icon}</span>
                <h3 className="text-xl font-bold text-white mt-2">
                  Special Gift!
                </h3>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg">
              <Avatar>
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-purple-600">From</p>
                <p className="font-medium">Your Friend</p>
              </div>
            </div>

            {messageVideo && (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <Video className="h-8 w-8 text-gray-400" />
              </div>
            )}

            <div className="text-center p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-4xl font-bold">${amount}</p>
            </div>

            {(memory.image || memory.caption) && (
              <div className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg">
                {memory.image && (
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                {memory.caption && (
                  <p className="text-gray-600 italic">"{memory.caption}"</p>
                )}
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            className={`flex-1 bg-gradient-to-r ${selectedTheme.colors.primary} hover:opacity-90 transition-opacity text-white`}
            onClick={handlePreview}
          >
            Preview Animation
          </Button>

          <Button
            className={`flex-1 bg-gradient-to-r ${selectedTheme.colors.primary} hover:opacity-90 transition-opacity text-white`}
            onClick={onNext}
          >
            Continue to Payment
          </Button>
        </div>
      </Card>
    </div>
  );
};
