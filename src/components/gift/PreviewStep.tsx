import { Gift, Heart, Video, DollarSign, ArrowRight } from "lucide-react";
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
          <Gift className="h-6 w-6 text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Preview Your Gift
        </h2>
      </div>

      <div className="space-y-6">
        {/* Recipient Preview */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm animate-fade-in">
          <Heart className="h-5 w-5 text-pink-500" />
          <div>
            <p className="text-sm text-gray-500">Sending to</p>
            <p className="font-medium">{phoneNumber}</p>
          </div>
        </div>

        {/* Message Preview */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm animate-fade-in delay-100">
          <Video className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Video Message</p>
            <p className="font-medium">
              {messageVideo ? messageVideo.name : 'No message recorded'}
            </p>
          </div>
        </div>

        {/* Amount Preview */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm animate-fade-in delay-200">
          <DollarSign className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Gift Amount</p>
            <p className="font-medium">${amount}</p>
          </div>
        </div>

        {/* Gift Sequence Preview */}
        <div className="relative h-40 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Gift Sequence Preview</p>
              <div className="flex items-center gap-2 text-gray-400">
                <Heart className="h-4 w-4 animate-pulse" />
                <ArrowRight className="h-4 w-4" />
                <Video className="h-4 w-4 animate-pulse delay-100" />
                <ArrowRight className="h-4 w-4" />
                <DollarSign className="h-4 w-4 animate-pulse delay-200" />
              </div>
            </div>
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