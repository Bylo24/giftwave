
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface GiftVerificationFormProps {
  className?: string;
  giftToken: string;
}

export const GiftVerificationForm = ({ className, giftToken }: GiftVerificationFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showVerification, setShowVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-recipient', {
        body: { giftToken, phoneNumber }
      });

      if (error) throw error;

      toast({
        title: "Verification code sent",
        description: "Please check your phone for the code",
      });
      setShowVerification(true);
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Complete the gift collection
      const { data: collectionData, error: collectionError } = await supabase.functions.invoke('complete-collection', {
        body: { giftToken, verificationCode }
      });

      if (collectionError) throw collectionError;

      // Update user's wallet balance
      if (user) {
        // First get the gift amount
        const { data: gift, error: giftError } = await supabase
          .from('gifts')
          .select('amount')
          .eq('token', giftToken)
          .single();

        if (giftError) throw giftError;

        if (gift) {
          // Get current profile balance
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('wallet_balance')
            .eq('id', user.id)
            .single();

          if (profileError) throw profileError;

          // Calculate new balance
          const currentBalance = profile?.wallet_balance || 0;
          const newBalance = currentBalance + gift.amount;

          // Update the balance
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ wallet_balance: newBalance })
            .eq('id', user.id);

          if (updateError) throw updateError;
        }
      }

      toast({
        title: "Success!",
        description: "The money has been added to your wallet",
      });
      navigate("/wallet");
    } catch (error) {
      console.error('Collection error:', error);
      toast({
        title: "Error",
        description: "Failed to verify code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md space-y-6 animate-fade-in ${className}`}>
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
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Verification Code"}
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
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify and Collect Gift"}
          </Button>
        </form>
      )}
    </div>
  );
};
