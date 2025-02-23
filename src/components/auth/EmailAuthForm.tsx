
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const validateForm = () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const giftToken = sessionStorage.getItem('giftToken');
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/verify`,
          },
        });
        if (error) throw error;
        
        if (giftToken) {
          // After signup with gift token, redirect to collect-signup
          navigate('/collect-signup');
        } else {
          toast.success("Account created successfully! You can now sign in.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message === "Invalid login credentials") {
            throw new Error("Invalid email or password. Please try again.");
          }
          throw error;
        }

        if (giftToken) {
          // After login with gift token, redirect to collect-signup
          navigate('/collect-signup');
        } else {
          toast.success("Successfully logged in!");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error("Auth error:", error);
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
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        required
        minLength={6}
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
