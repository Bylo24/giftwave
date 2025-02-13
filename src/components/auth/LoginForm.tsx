
import { useState } from "react";
import { EmailAuthForm } from "./EmailAuthForm";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { AuthToggle } from "./AuthToggle";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center animate-fade-in bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-md">
      <div className="w-full max-w-md mx-auto p-8 space-y-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex flex-col items-center space-y-6 mb-8">
            <img 
              src="/lovable-uploads/d0eaee07-4183-4bee-82ec-c2b979790c51.png"
              alt="GiftWave Logo"
              className="h-16 w-auto drop-shadow-lg"
            />
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Welcome to GiftWave
              </h1>
              <p className="text-sm text-gray-600">
                {isSignUp ? "Create an account" : "Sign in to your account"}
              </p>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
};
