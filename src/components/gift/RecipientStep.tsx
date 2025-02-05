import { Phone } from "lucide-react";
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
  onNext: () => void;
}

export const RecipientStep = ({ phoneNumber, setPhoneNumber, onNext }: RecipientStepProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^\d]/g, '');
    setPhoneNumber(value);
  };

  const countryCodes = [
    { value: "+1", label: "United States/Canada (+1)" },
    { value: "+7", label: "Russia (+7)" },
    { value: "+20", label: "Egypt (+20)" },
    { value: "+27", label: "South Africa (+27)" },
    { value: "+30", label: "Greece (+30)" },
    { value: "+31", label: "Netherlands (+31)" },
    { value: "+32", label: "Belgium (+32)" },
    { value: "+33", label: "France (+33)" },
    { value: "+34", label: "Spain (+34)" },
    { value: "+36", label: "Hungary (+36)" },
    { value: "+39", label: "Italy (+39)" },
    { value: "+40", label: "Romania (+40)" },
    { value: "+41", label: "Switzerland (+41)" },
    { value: "+43", label: "Austria (+43)" },
    { value: "+44", label: "United Kingdom (+44)" },
    { value: "+45", label: "Denmark (+45)" },
    { value: "+46", label: "Sweden (+46)" },
    { value: "+47", label: "Norway (+47)" },
    { value: "+48", label: "Poland (+48)" },
    { value: "+49", label: "Germany (+49)" },
    { value: "+51", label: "Peru (+51)" },
    { value: "+52", label: "Mexico (+52)" },
    { value: "+54", label: "Argentina (+54)" },
    { value: "+55", label: "Brazil (+55)" },
    { value: "+56", label: "Chile (+56)" },
    { value: "+57", label: "Colombia (+57)" },
    { value: "+58", label: "Venezuela (+58)" },
    { value: "+60", label: "Malaysia (+60)" },
    { value: "+61", label: "Australia (+61)" },
    { value: "+62", label: "Indonesia (+62)" },
    { value: "+63", label: "Philippines (+63)" },
    { value: "+64", label: "New Zealand (+64)" },
    { value: "+65", label: "Singapore (+65)" },
    { value: "+66", label: "Thailand (+66)" },
    { value: "+81", label: "Japan (+81)" },
    { value: "+82", label: "South Korea (+82)" },
    { value: "+84", label: "Vietnam (+84)" },
    { value: "+86", label: "China (+86)" },
    { value: "+90", label: "Turkey (+90)" },
    { value: "+91", label: "India (+91)" },
    { value: "+92", label: "Pakistan (+92)" },
    { value: "+93", label: "Afghanistan (+93)" },
    { value: "+94", label: "Sri Lanka (+94)" },
    { value: "+95", label: "Myanmar (+95)" },
    { value: "+98", label: "Iran (+98)" },
    { value: "+212", label: "Morocco (+212)" },
    { value: "+213", label: "Algeria (+213)" },
    { value: "+216", label: "Tunisia (+216)" },
    { value: "+218", label: "Libya (+218)" },
    { value: "+220", label: "Gambia (+220)" },
    { value: "+221", label: "Senegal (+221)" },
    { value: "+233", label: "Ghana (+233)" },
    { value: "+234", label: "Nigeria (+234)" },
    { value: "+254", label: "Kenya (+254)" },
    { value: "+255", label: "Tanzania (+255)" },
    { value: "+256", label: "Uganda (+256)" },
    { value: "+260", label: "Zambia (+260)" },
    { value: "+263", label: "Zimbabwe (+263)" },
    { value: "+351", label: "Portugal (+351)" },
    { value: "+352", label: "Luxembourg (+352)" },
    { value: "+354", label: "Iceland (+354)" },
    { value: "+355", label: "Albania (+355)" },
    { value: "+358", label: "Finland (+358)" },
    { value: "+359", label: "Bulgaria (+359)" },
    { value: "+370", label: "Lithuania (+370)" },
    { value: "+371", label: "Latvia (+371)" },
    { value: "+372", label: "Estonia (+372)" },
    { value: "+380", label: "Ukraine (+380)" },
    { value: "+381", label: "Serbia (+381)" },
    { value: "+385", label: "Croatia (+385)" },
    { value: "+386", label: "Slovenia (+386)" },
    { value: "+420", label: "Czech Republic (+420)" },
    { value: "+421", label: "Slovakia (+421)" },
    { value: "+886", label: "Taiwan (+886)" },
    { value: "+961", label: "Lebanon (+961)" },
    { value: "+962", label: "Jordan (+962)" },
    { value: "+963", label: "Syria (+963)" },
    { value: "+964", label: "Iraq (+964)" },
    { value: "+965", label: "Kuwait (+965)" },
    { value: "+966", label: "Saudi Arabia (+966)" },
    { value: "+971", label: "UAE (+971)" },
    { value: "+972", label: "Israel (+972)" },
    { value: "+974", label: "Qatar (+974)" },
    { value: "+977", label: "Nepal (+977)" },
    { value: "+994", label: "Azerbaijan (+994)" },
    { value: "+995", label: "Georgia (+995)" },
    { value: "+998", label: "Uzbekistan (+998)" },
  ].sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by country name

  return (
    <Card className="p-6 space-y-4 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-primary/10 rounded-full animate-bounce">
          <Phone className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Who's the Lucky Person?
        </h2>
      </div>
      <p className="text-gray-600">Enter their phone number to send them a special surprise!</p>
      
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
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className="text-lg border-2 border-primary/20 focus:border-primary/40 transition-colors flex-1"
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>

      <Button 
        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity animate-fade-in"
        onClick={onNext}
        disabled={!phoneNumber || phoneNumber.length < 10}
      >
        Continue to Message
      </Button>
    </Card>
  );
};