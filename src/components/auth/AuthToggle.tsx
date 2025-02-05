import { Button } from "@/components/ui/button";

interface AuthToggleProps {
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
  isLoading: boolean;
}

export const AuthToggle = ({ isSignUp, setIsSignUp, isLoading }: AuthToggleProps) => {
  return (
    <div className="text-center text-sm">
      <span className="text-muted-foreground">
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
      </span>
      <Button
        variant="link"
        className="p-0 h-auto font-semibold"
        onClick={() => setIsSignUp(!isSignUp)}
        disabled={isLoading}
      >
        {isSignUp ? "Sign in" : "Sign up"}
      </Button>
    </div>
  );
};