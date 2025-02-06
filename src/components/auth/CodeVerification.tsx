import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { VerificationForm } from "./verification/VerificationForm";

export const CodeVerification = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    const storedPhone = sessionStorage.getItem('verifying_phone');
    if (!storedPhone) {
      navigate('/verify');
      return;
    }
    setPhoneNumber(storedPhone);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !phoneNumber) return;

    setIsLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: code,
        type: 'sms'
      });

      if (verifyError) throw verifyError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          phone_verified: true,
          phone_number: phoneNumber 
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

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
    if (!phoneNumber) return;
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber
      });

      if (error) throw error;
      
      toast.success("New verification code sent!");
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

      <VerificationForm
        code={code}
        onCodeChange={setCode}
        onSubmit={handleSubmit}
        onResend={handleResendCode}
        isLoading={isLoading}
      />
    </div>
  );
};