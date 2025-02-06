import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ResendButton } from "./ResendButton";

interface VerificationFormProps {
  code: string;
  onCodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading: boolean;
}

export const VerificationForm = ({
  code,
  onCodeChange,
  onSubmit,
  onResend,
  isLoading
}: VerificationFormProps) => {
  const navigate = useNavigate();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-full text-center text-2xl tracking-widest"
          disabled={isLoading}
        />
        <div className="flex items-center justify-between">
          <ResendButton onResend={onResend} isLoading={isLoading} />
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
        disabled={isLoading || code.length !== 6}
      >
        {isLoading ? "Verifying..." : "Verify"}
      </Button>
    </form>
  );
};