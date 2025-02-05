import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface GiftVerificationFormProps {
  className?: string;
}

export const GiftVerificationForm = ({ className }: GiftVerificationFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showVerification, setShowVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

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
  );
};