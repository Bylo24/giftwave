
import { useState } from "react";
import { EmailAuthForm } from "./EmailAuthForm";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { AuthToggle } from "./AuthToggle";
import { LoginContainer } from "./LoginContainer";
import { LoginHeader } from "./LoginHeader";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Default to sign in since this is login form

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
