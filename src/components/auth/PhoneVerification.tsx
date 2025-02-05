import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PhoneVerification = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/verify-code");
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
        <h1 className="text-2xl font-semibold">Enter your phone number</h1>
        <p className="text-sm text-gray-500">
          We'll text you a code so we can confirm that it's you.
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
                {/* Add more country codes as needed */}
              </SelectContent>
            </Select>
            <Input
              type="tel"
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-gray-500">
            By tapping Send Code, you confirm that you are authorized to use the
            phone number entered and agree to receive SMS texts verifying your
            identity and as otherwise permitted by Swift Pay's User Agreement and
            Privacy Policy. Carrier fees may apply.
          </p>
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          Send code
        </Button>
      </form>
    </div>
  );
};