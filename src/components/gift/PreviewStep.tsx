import { Gift, Heart, Video, DollarSign, PartyPopper, User, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { giftThemes, ThemeType } from "@/utils/giftThemes";

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
  theme,
  phoneNumber, 
  amount, 
  messageVideo,
  memory,
  onNext 
}: PreviewStepProps) => {
  const selectedTheme = giftThemes[theme];

  return (
    <Card className={`p-6 space-y-6 bg-gradient-to-br ${selectedTheme.colors.secondary}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 bg-opacity-10 rounded-full ${selectedTheme.animations[0]}`}>
          <PartyPopper className={`h-6 w-6 ${selectedTheme.colors.accent}`} />
        </div>
        <h2 className={`text-2xl font-bold bg-gradient-to-r ${selectedTheme.colors.primary} bg-clip-text text-transparent`}>
          Preview Gift Experience
        </h2>
      </div>

      {/* Gift Preview Experience */}
      <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Animated Header */}
        <div className={`absolute top-0 w-full h-24 bg-gradient-to-r ${selectedTheme.colors.primary} animate-pulse`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl animate-bounce">{selectedTheme.icon}</span>
              <h3 className="text-xl font-bold text-white animate-fade-in">
                You've received a special gift!
              </h3>
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="pt-28 p-6 space-y-6">
          {/* Sender Preview */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg animate-fade-in">
            <Avatar className="h-12 w-12 border-2 border-purple-500">
              <AvatarFallback className="bg-purple-100">
                <User className="h-6 w-6 text-purple-500" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-purple-600">A gift from</p>
              <p className="font-medium text-gray-900">Your Friend</p>
            </div>
          </div>

          {/* Video Message Preview */}
          {messageVideo && (
            <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-white rounded-lg overflow-hidden animate-fade-in">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="h-12 w-12 text-purple-500 animate-pulse" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-sm text-purple-600 bg-white/80 px-3 py-1 rounded-full">
                    Tap to watch your special message
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Gift Amount Preview */}
          <div className="relative p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg animate-fade-in">
            <div className="absolute -top-3 -right-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-bounce">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg text-purple-600">Your Gift Amount</p>
              <p className="text-4xl font-bold text-gray-900">${amount}</p>
            </div>
          </div>

          {/* Memory Preview */}
          {(memory.image || memory.caption) && (
            <div className="relative p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg animate-fade-in">
              {memory.image && (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <Image className="h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              )}
              {memory.caption && (
                <p className="text-gray-600 italic">"{memory.caption}"</p>
              )}
            </div>
          )}

          {/* Interactive Elements */}
          <div className="flex items-center justify-center gap-4 text-pink-500 animate-fade-in">
            <Heart className="h-5 w-5 animate-pulse" />
            <p className="text-sm">Swipe up to reveal your gift</p>
            <Heart className="h-5 w-5 animate-pulse" />
          </div>
        </div>
      </div>

      <Button
        className={`w-full bg-gradient-to-r ${selectedTheme.colors.primary} hover:opacity-90 transition-opacity text-white`}
        onClick={onNext}
      >
        Continue to Payment
      </Button>
    </Card>
  );
};