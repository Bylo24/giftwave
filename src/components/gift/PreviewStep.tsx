import { Gift, Heart, Video, DollarSign, PartyPopper, Smile, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PreviewStepProps {
  phoneNumber: string;
  amount: string;
  messageVideo: File | null;
  onNext: () => void;
}

export const PreviewStep = ({ phoneNumber, amount, messageVideo, onNext }: PreviewStepProps) => {
  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-purple-500/10 rounded-full animate-bounce">
          <PartyPopper className="h-6 w-6 text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Preview Gift Experience
        </h2>
      </div>

      {/* Recipient Preview Experience */}
      <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Header Animation */}
        <div className="absolute top-0 w-full h-24 bg-gradient-to-r from-[#9b87f5] via-[#D946EF] to-[#8B5CF6] animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Gift className="h-8 w-8 text-white animate-bounce" />
              <h3 className="text-xl font-bold text-white">You've received a special gift!</h3>
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="pt-28 p-6 space-y-6">
          {/* Sender Preview */}
          <div className="flex items-center gap-4 p-4 bg-[#E5DEFF] rounded-lg animate-fade-in">
            <Avatar className="h-12 w-12 border-2 border-[#9b87f5]">
              <AvatarFallback className="bg-[#D6BCFA]">
                <User className="h-6 w-6 text-[#6E59A5]" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-[#6E59A5]">A gift from</p>
              <p className="font-medium text-[#1A1F2C]">Your Friend</p>
            </div>
          </div>

          {/* Video Message Preview */}
          {messageVideo && (
            <div className="relative aspect-video bg-[#E5DEFF] rounded-lg overflow-hidden animate-fade-in">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="h-12 w-12 text-[#9b87f5] animate-pulse" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-sm text-[#6E59A5] bg-white/80 px-3 py-1 rounded-full">
                    Tap to watch your special message
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Gift Amount Preview */}
          <div className="relative p-6 bg-gradient-to-br from-[#E5DEFF] to-[#D6BCFA] rounded-lg animate-fade-in">
            <div className="absolute -top-3 -right-3">
              <div className="p-3 bg-[#9b87f5] rounded-full animate-bounce">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg text-[#6E59A5]">Your Gift Amount</p>
              <p className="text-4xl font-bold text-[#1A1F2C]">${amount}</p>
            </div>
          </div>

          {/* Interactive Elements Preview */}
          <div className="flex items-center justify-center gap-4 text-[#9b87f5] animate-fade-in">
            <Heart className="h-5 w-5 animate-pulse" />
            <p className="text-sm">Swipe up to reveal your gift</p>
            <Heart className="h-5 w-5 animate-pulse" />
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-gradient-to-r from-[#9b87f5] to-[#D946EF] hover:opacity-90 transition-opacity"
        onClick={onNext}
      >
        Continue to Payment
      </Button>
    </Card>
  );
};