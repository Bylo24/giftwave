import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { GiftRevealAnimation } from "@/components/gift/GiftRevealAnimation";

const CollectGift = () => {
  const { giftId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showVerification, setShowVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // Mock gift data - in a real app, this would be fetched based on giftId
  const mockGift = {
    theme: "birthday" as const,
    amount: "50",
    messageVideo: new File([], "mock-video.mp4"),
    memories: [
      {
        id: "1",
        imageUrl: "/placeholder.svg",
        caption: "Remember this day?",
        date: new Date()
      },
      {
        id: "2",
        imageUrl: "/placeholder.svg",
        caption: "Such a great moment!",
        date: new Date()
      },
    ],
  };

  const handleAnimationComplete = () => {
    setIsAnimationComplete(true);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send a verification code to the phone number
    toast({
      title: "Verification code sent",
      description: "Please check your phone for the code",
    });
    setShowVerification(true);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would verify the code and transfer the money
    toast({
      title: "Gift collected!",
      description: "The money has been added to your wallet",
    });
    navigate("/wallet");
  };

  if (!isAnimationComplete) {
    return (
      <div className="min-h-screen bg-background">
        <GiftRevealAnimation
          messageVideo={mockGift.messageVideo}
          amount={mockGift.amount}
          memories={mockGift.memories}
          onComplete={handleAnimationComplete}
          memory={{
            caption: "",
            date: new Date()
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Collect Your Gift!</h1>
          <p className="text-muted-foreground">
            Enter your phone number to verify and collect your gift
          </p>
        </div>

        {!showVerification ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send Verification Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Verify and Collect Gift
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CollectGift;