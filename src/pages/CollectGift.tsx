import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { GiftRevealAnimation } from "@/components/gift/GiftRevealAnimation";
import { demoGifts } from "@/utils/demoGifts";

const CollectGift = () => {
  const { giftId } = useParams();
  const [searchParams] = useSearchParams();
  const isReplay = searchParams.get('replay') === 'true';
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showVerification, setShowVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const gift = giftId ? demoGifts[giftId] : null;

  if (!gift) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Gift Not Found</h1>
          <p className="text-muted-foreground">This gift doesn't exist or has already been collected.</p>
        </div>
      </div>
    );
  }

  const handleAnimationComplete = () => {
    if (isReplay) {
      navigate('/my-gifts');
    } else {
      setIsAnimationComplete(true);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Verification code sent",
      description: "Please check your phone for the code",
    });
    setShowVerification(true);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Gift collected!",
      description: "The money has been added to your wallet",
    });
    navigate("/wallet");
  };

  if (!isAnimationComplete || isReplay) {
    return (
      <div className="min-h-screen bg-background">
        <GiftRevealAnimation
          messageVideo={gift.messageVideo}
          amount={gift.amount}
          memories={gift.memories}
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