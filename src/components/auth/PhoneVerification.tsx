import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const PhoneVerification = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPhone, setCurrentPhone] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentPhone = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching phone:', error);
      } else if (data?.phone_number) {
        setCurrentPhone(data.phone_number);
      }
    };

    fetchCurrentPhone();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to verify your phone number");
      return;
    }

    setIsLoading(true);
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    try {
      // First, update the phone number in the profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          phone_number: fullPhoneNumber,
          phone_verified: false // Reset verification status
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Store the phone number in session storage for verification
      sessionStorage.setItem('verifying_phone', fullPhoneNumber);
      
      // Navigate to code verification page
      navigate("/verify-code");
      toast.success("Verification code sent to your phone");
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || "Failed to send verification code");
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
        <h1 className="text-2xl font-semibold">
          {currentPhone ? "Change phone number" : "Add phone number"}
        </h1>
        {currentPhone && (
          <p className="text-sm text-gray-500">
            Current phone: {currentPhone}
          </p>
        )}
        <p className="text-sm text-gray-500">
          We'll text you a code to verify this number.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+1">+1 (US)</SelectItem>
                <SelectItem value="+44">+44 (UK)</SelectItem>
                <SelectItem value="+91">+91 (IN)</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="tel"
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-gray-500">
            By tapping Send Code, you confirm that you are authorized to use the
            phone number entered and agree to receive SMS texts verifying your
            identity. Carrier fees may apply.
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send code"}
        </Button>
      </form>
    </div>
  );
};