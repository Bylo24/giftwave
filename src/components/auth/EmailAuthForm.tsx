import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface EmailAuthFormProps {
  isSignUp: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const EmailAuthForm = ({ isSignUp, isLoading, setIsLoading }: EmailAuthFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/verify`,
          },
        });
        if (error) throw error;
        toast.success("Check your email for the confirmation link!");
        navigate("/verify");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Successfully logged in!");
        navigate("/home");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailAuth} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          "Loading..."
        ) : isSignUp ? (
          "Sign up with email"
        ) : (
          "Sign in with email"
        )}
      </Button>
    </form>
  );
};