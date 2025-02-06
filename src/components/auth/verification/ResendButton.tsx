import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ResendButtonProps {
  onResend: () => Promise<void>;
  isLoading: boolean;
}

export const ResendButton = ({ onResend, isLoading }: ResendButtonProps) => {
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer, canResend]);

  const handleResend = async () => {
    if (!canResend || isLoading) return;
    
    try {
      await onResend();
      setCanResend(false);
      setResendTimer(60);
    } catch (error) {
      console.error('Error in ResendButton:', error);
    }
  };

  return (
    <Button 
      variant="link" 
      onClick={handleResend}
      disabled={!canResend || isLoading}
      className="px-0 h-auto font-normal"
    >
      {canResend ? (
        "Resend code"
      ) : (
        `Resend code in ${resendTimer}s`
      )}
    </Button>
  );
};