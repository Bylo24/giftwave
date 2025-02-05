import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PhoneInputProps {
  phoneNumber: string;
  countryCode: string;
  isLoading: boolean;
  onPhoneChange: (value: string) => void;
  onCountryCodeChange: (value: string) => void;
}

export const PhoneInput = ({
  phoneNumber,
  countryCode,
  isLoading,
  onPhoneChange,
  onCountryCodeChange,
}: PhoneInputProps) => {
  return (
    <div className="flex gap-2">
      <Select value={countryCode} onValueChange={onCountryCodeChange}>
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
        onChange={(e) => onPhoneChange(e.target.value)}
        className="flex-1"
        disabled={isLoading}
      />
    </div>
  );
};