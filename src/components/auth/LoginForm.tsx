import { useState } from "react";
import { EmailAuthForm } from "./EmailAuthForm";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { AuthToggle } from "./AuthToggle";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center animate-fade-in bg-background">
      <div className="w-full max-w-md mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Welcome to GiftWave</h1>
          <p className="text-sm text-gray-500">
            {isSignUp ? "Create an account" : "Sign in to your account"}
          </p>
        </div>

        <EmailAuthForm
          isSignUp={isSignUp}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleAuthButton isLoading={isLoading} />
        </div>

        <AuthToggle
          isSignUp={isSignUp}
          setIsSignUp={setIsSignUp}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};