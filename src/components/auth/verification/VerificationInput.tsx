import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface VerificationInputProps {
  code: string;
  onCodeChange: (value: string) => void;
  isLoading: boolean;
}

export const VerificationInput = ({ code, onCodeChange, isLoading }: VerificationInputProps) => {
  return (
    <InputOTP
      value={code}
      onChange={onCodeChange}
      maxLength={6}
      disabled={isLoading}
      className="gap-2"
    >
      <InputOTPGroup>
        {Array.from({ length: 6 }).map((_, i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};