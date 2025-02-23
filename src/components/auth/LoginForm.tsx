
import { useState, useEffect } from "react";
import { EmailAuthForm } from "./EmailAuthForm";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { AuthToggle } from "./AuthToggle";
import { LoginContainer } from "./LoginContainer";
import { LoginHeader } from "./LoginHeader";
import { supabase } from "@/integrations/supabase/client";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // If we have a gift token, ensure we're signed out before showing the form
  const ensureSignedOut = async () => {
    const giftToken = sessionStorage.getItem('giftToken');
    if (giftToken) {
      // Sign out current user if any to allow new sign in
      await supabase.auth.signOut();
    }
  };

  // Call this when component mounts
  useEffect(() => {
    ensureSignedOut();
  }, []);

  return (
    <LoginContainer>
      <LoginHeader isSignUp={isSignUp} />
      
      <EmailAuthForm
        isSignUp={isSignUp}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white/70 backdrop-blur-sm px-2 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex justify-center">
          <GoogleAuthButton isLoading={isLoading} />
        </div>

        <AuthToggle
          isSignUp={isSignUp}
          setIsSignUp={setIsSignUp}
          isLoading={isLoading}
        />
      </div>
    </LoginContainer>
  );
};
