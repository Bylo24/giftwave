import { useState, useEffect } from "react";

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
    <button 
      type="button"
      onClick={handleResend}
      className={`text-sm ${canResend ? 'text-primary hover:text-primary/90' : 'text-gray-400'}`}
      disabled={!canResend || isLoading}
    >
      {canResend ? (
        "Resend code"
      ) : (
        `Resend code in ${resendTimer}s`
      )}
    </button>
  );
};