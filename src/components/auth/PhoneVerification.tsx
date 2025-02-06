import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { PhoneInput } from "./PhoneInput";
import { VerificationHeader } from "./VerificationHeader";
import { fetchUserPhone, updateUserPhone } from "@/services/phoneService";
import { supabase } from "@/integrations/supabase/client";

export const PhoneVerification = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+64"); // Setting default to NZ
  const [isLoading, setIsLoading] = useState(false);
  const [currentPhone, setCurrentPhone] = useState<string | null>(null);

  useEffect(() => {
    const loadCurrentPhone = async () => {
      if (!user) return;
      const phone = await fetchUserPhone(user.id);
      setCurrentPhone(phone);
    };

    loadCurrentPhone();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to verify your phone number");
      return;
    }

    setIsLoading(true);
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    console.log('[PhoneVerification] Attempting to send OTP to:', fullPhoneNumber);

    try {
      // First update the phone number in the profiles table
      await updateUserPhone(user.id, fullPhoneNumber);
      console.log('[PhoneVerification] Updated user phone in profiles table');
      
      // Then send the OTP
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
      });

      console.log('[PhoneVerification] OTP Response:', { data, error });

      if (error) throw error;

      sessionStorage.setItem('verifying_phone', fullPhoneNumber);
      navigate("/verify-code");
      toast.success("Verification code sent to your phone");
    } catch (error: any) {
      console.error('[PhoneVerification] Error sending OTP:', error);
      toast.error(error.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      <VerificationHeader 
        currentPhone={currentPhone}
        onBack={() => navigate(-1)}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <PhoneInput
            phoneNumber={phoneNumber}
            countryCode={countryCode}
            isLoading={isLoading}
            onPhoneChange={setPhoneNumber}
            onCountryCodeChange={setCountryCode}
          />
          <p className="text-xs text-gray-500">
            By tapping Send Code, you confirm that you are authorized to use the
            phone number entered and agree to receive SMS texts verifying your
            identity. Carrier fees may apply.
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isLoading || !phoneNumber}
        >
          {isLoading ? "Sending..." : "Send code"}
        </Button>
      </form>
    </div>
  );
};