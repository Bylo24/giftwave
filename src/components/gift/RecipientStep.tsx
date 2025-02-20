
import { Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecipientStepProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  recipientName: string;
  setRecipientName: (value: string) => void;
  onNext: () => void;
}

export const RecipientStep = ({ 
  phoneNumber, 
  setPhoneNumber, 
  recipientName,
  setRecipientName,
  onNext 
}: RecipientStepProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^\d]/g, '');
    setPhoneNumber(value);
  };

  const countryCodes = [
    { value: "+1", label: "U.S/CA (+1)" },
    { value: "+7", label: "RU (+7)" },
    { value: "+20", label: "EG (+20)" },
    { value: "+27", label: "ZA (+27)" },
    { value: "+30", label: "GR (+30)" },
    { value: "+31", label: "NL (+31)" },
    { value: "+32", label: "BE (+32)" },
    { value: "+33", label: "FR (+33)" },
    { value: "+34", label: "ES (+34)" },
    { value: "+36", label: "HU (+36)" },
    { value: "+39", label: "IT (+39)" },
    { value: "+40", label: "RO (+40)" },
    { value: "+41", label: "CH (+41)" },
    { value: "+43", label: "AT (+43)" },
    { value: "+44", label: "UK (+44)" },
    { value: "+45", label: "DK (+45)" },
    { value: "+46", label: "SE (+46)" },
    { value: "+47", label: "NO (+47)" },
    { value: "+48", label: "PL (+48)" },
    { value: "+49", label: "DE (+49)" },
    { value: "+51", label: "PE (+51)" },
    { value: "+52", label: "MX (+52)" },
    { value: "+54", label: "AR (+54)" },
    { value: "+55", label: "BR (+55)" },
    { value: "+56", label: "CL (+56)" },
    { value: "+57", label: "CO (+57)" },
    { value: "+58", label: "VE (+58)" },
    { value: "+60", label: "MY (+60)" },
    { value: "+61", label: "AU (+61)" },
    { value: "+62", label: "ID (+62)" },
    { value: "+63", label: "PH (+63)" },
    { value: "+64", label: "NZ (+64)" },
    { value: "+65", label: "SG (+65)" },
    { value: "+66", label: "TH (+66)" },
    { value: "+81", label: "JP (+81)" },
    { value: "+82", label: "KR (+82)" },
    { value: "+84", label: "VN (+84)" },
    { value: "+86", label: "CN (+86)" },
    { value: "+90", label: "TR (+90)" },
    { value: "+91", label: "IN (+91)" },
    { value: "+92", label: "PK (+92)" },
    { value: "+93", label: "AF (+93)" },
    { value: "+94", label: "LK (+94)" },
    { value: "+95", label: "MM (+95)" },
    { value: "+98", label: "IR (+98)" },
    { value: "+212", label: "MA (+212)" },
    { value: "+213", label: "DZ (+213)" },
    { value: "+216", label: "TN (+216)" },
    { value: "+218", label: "LY (+218)" },
    { value: "+220", label: "GM (+220)" },
    { value: "+221", label: "SN (+221)" },
    { value: "+233", label: "GH (+233)" },
    { value: "+234", label: "NG (+234)" },
    { value: "+254", label: "KE (+254)" },
    { value: "+255", label: "TZ (+255)" },
    { value: "+256", label: "UG (+256)" },
    { value: "+260", label: "ZM (+260)" },
    { value: "+263", label: "ZW (+263)" },
    { value: "+351", label: "PT (+351)" },
    { value: "+352", label: "LU (+352)" },
    { value: "+354", label: "IS (+354)" },
    { value: "+355", label: "AL (+355)" },
    { value: "+358", label: "FI (+358)" },
    { value: "+359", label: "BG (+359)" },
    { value: "+370", label: "LT (+370)" },
    { value: "+371", label: "LV (+371)" },
    { value: "+372", label: "EE (+372)" },
    { value: "+380", label: "UA (+380)" },
    { value: "+381", label: "RS (+381)" },
    { value: "+385", label: "HR (+385)" },
    { value: "+386", label: "SI (+386)" },
    { value: "+420", label: "CZ (+420)" },
    { value: "+421", label: "SK (+421)" },
    { value: "+886", label: "TW (+886)" },
    { value: "+961", label: "LB (+961)" },
    { value: "+962", label: "JO (+962)" },
    { value: "+963", label: "SY (+963)" },
    { value: "+964", label: "IQ (+964)" },
    { value: "+965", label: "KW (+965)" },
    { value: "+966", label: "SA (+966)" },
    { value: "+971", label: "AE (+971)" },
    { value: "+972", label: "IL (+972)" },
    { value: "+974", label: "QA (+974)" },
    { value: "+977", label: "NP (+977)" },
    { value: "+994", label: "AZ (+994)" },
    { value: "+995", label: "GE (+995)" },
    { value: "+998", label: "UZ (+998)" },
  ].sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by country code

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <User className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Who's the Lucky Person?
        </h2>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Their Name</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter their name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="text-lg border-2 border-primary/20 focus:border-primary/40 transition-colors pl-4"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Their Phone Number</label>
          <div className="flex gap-2">
            <Select defaultValue="+1">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {countryCodes.map((code) => (
                  <SelectItem key={code.value} value={code.value}>
                    {code.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="tel"
              placeholder="Phone"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="text-lg border-2 border-primary/20 focus:border-primary/40 transition-colors flex-1"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>
        </div>
      </div>

      <Button 
        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
        onClick={onNext}
        disabled={!phoneNumber || phoneNumber.length < 10 || !recipientName.trim()}
      >
        Continue to Message
      </Button>

      <p className="text-sm text-gray-500 text-center">
        We'll send them a special notification when their gift is ready!
      </p>
    </Card>
  );
};
