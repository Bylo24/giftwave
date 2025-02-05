import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const CodeVerification = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const storedPhone = sessionStorage.getItem('verifying_phone');
    if (!storedPhone) {
      navigate('/verify');
      return;
    }
    setPhoneNumber(storedPhone);
  }, [navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !phoneNumber) return;

    setIsLoading(true);
    try {
      // In a real implementation, you would verify the code here
      // For now, we'll simulate verification
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          phone_verified: true,
          phone_number: phoneNumber 
        })
        .eq('id', user.id);

      if (error) throw error;

      // Clear the stored phone number
      sessionStorage.removeItem('verifying_phone');
      
      toast.success("Phone number verified successfully!");
      navigate('/profile');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || "Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || !phoneNumber) return;
    
    try {
      // Here you would implement the actual code resending logic
      // For now, we'll simulate it with a delay
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("New verification code sent!");
      setCanResend(false);
      setResendTimer(60);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
      </button>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Enter the code</h1>
        <p className="text-sm text-gray-500">
          We sent it to:
          <br />
          {phoneNumber}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            type="text"
            maxLength={4}
            placeholder="Enter 4-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full text-center text-2xl tracking-widest"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between">
            <button 
              type="button"
              onClick={handleResendCode}
              className={`text-sm ${canResend ? 'text-primary hover:text-primary/90' : 'text-gray-400'}`}
              disabled={!canResend || isLoading}
            >
              {canResend ? (
                "Resend code"
              ) : (
                `Resend code in ${resendTimer}s`
              )}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/verify')}
              className="text-sm text-primary hover:text-primary/90"
            >
              Change phone number
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isLoading || code.length !== 4}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </div>
  );
};