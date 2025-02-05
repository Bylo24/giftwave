import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { GiftRevealAnimation } from "@/components/gift/GiftRevealAnimation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const { data: gift, isLoading } = useQuery({
    queryKey: ['gift', giftId],
    queryFn: async () => {
      console.log("Fetching gift:", giftId);
      const { data, error } = await supabase
        .from('gifts')
        .select(`
          *,
          sender:profiles(full_name)
        `)
        .eq('id', giftId)
        .single();

      if (error) {
        console.error("Error fetching gift:", error);
        throw error;
      }

      console.log("Fetched gift:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading gift...</p>
        </div>
      </div>
    );
  }

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

  // Show animation for both initial view and replay
  if (!isAnimationComplete || isReplay) {
    return (
      <div className="min-h-screen bg-background">
        <GiftRevealAnimation
          messageVideo={gift.message_video_url}
          amount={gift.amount.toString()}
          memories={[]} // We'll implement memories in a separate update
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