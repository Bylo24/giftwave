import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ResendButton } from "./ResendButton";
import { VerificationInput } from "./VerificationInput";

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
        <VerificationInput
          code={code}
          onCodeChange={onCodeChange}
          isLoading={isLoading}
        />
        <div className="flex items-center justify-between">
          <ResendButton onResend={onResend} isLoading={isLoading} />
          <Button 
            type="button"
            variant="link"
            onClick={() => navigate('/verify')}
            className="px-0 h-auto font-normal"
          >
            Change phone number
          </Button>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading || code.length !== 6}
      >
        {isLoading ? "Verifying..." : "Verify"}
      </Button>
    </form>
  );
};