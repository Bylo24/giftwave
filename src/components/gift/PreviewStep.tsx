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
  theme = 'birthday',
  phoneNumber, 
  amount, 
  messageVideo,
  memory,
  onNext 
}: PreviewStepProps) => {
  const selectedTheme = giftThemes[theme] || giftThemes.birthday;
  const formattedPhoneNumber = `+1 ${phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}`;

  return (
    <div className="space-y-6 animate-fade-in max-w-md mx-auto">
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
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-purple-600">To</p>
                  <p className="font-medium">{formattedPhoneNumber}</p>
                </div>
              </div>
            </div>

            {messageVideo && (
              <Card className="p-4 bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-center gap-3 mb-2">
                  <Video className="h-5 w-5 text-purple-500" />
                  <p className="font-medium">Video Message</p>
                </div>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <Video className="h-8 w-8 text-gray-400" />
                </div>
              </Card>
            )}

            <Card className="p-4 bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <p className="font-medium">Gift Amount</p>
              </div>
              <p className="text-4xl font-bold text-center text-green-500">${amount}</p>
            </Card>

            {(memory.image || memory.caption) && (
              <Card className="p-4 bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <p className="font-medium">Memory</p>
                </div>
                {memory.image && (
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                {memory.caption && (
                  <p className="text-gray-600 italic">"{memory.caption}"</p>
                )}
              </Card>
            )}
          </div>
        </Card>

        <Button
          className={`w-full bg-gradient-to-r ${selectedTheme.colors.primary} hover:opacity-90 transition-opacity text-white`}
          onClick={onNext}
        >
          Continue to Payment
        </Button>
      </Card>
    </div>
  );
};