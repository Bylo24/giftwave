import { Gift, Heart, Video, DollarSign, PartyPopper, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
        <div className="absolute top-0 w-full h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Gift className="h-8 w-8 text-white animate-bounce" />
              <h3 className="text-xl font-bold text-white">You've received a gift!</h3>
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="pt-24 p-6 space-y-6">
          {/* Sender Preview */}
          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg animate-fade-in">
            <Smile className="h-6 w-6 text-purple-500" />
            <div>
              <p className="text-sm text-purple-600">From</p>
              <p className="font-medium text-purple-700">Your Friend</p>
            </div>
          </div>

          {/* Video Message Preview */}
          {messageVideo && (
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden animate-fade-in">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="h-12 w-12 text-purple-500 animate-pulse" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-full">
                    Tap to play message
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Gift Amount Preview */}
          <div className="relative p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg animate-fade-in">
            <div className="absolute -top-3 -right-3">
              <div className="p-3 bg-green-500 rounded-full animate-bounce">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg text-gray-600">Gift Amount</p>
              <p className="text-4xl font-bold text-green-600">${amount}</p>
            </div>
          </div>

          {/* Interactive Elements Preview */}
          <div className="flex items-center justify-center gap-4 text-gray-400 animate-fade-in">
            <Heart className="h-5 w-5 animate-pulse" />
            <p className="text-sm">Swipe to reveal your gift</p>
            <Heart className="h-5 w-5 animate-pulse" />
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
        onClick={onNext}
      >
        Continue to Payment
      </Button>
    </Card>
  );
};