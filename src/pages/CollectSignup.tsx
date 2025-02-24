
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CollectSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const giftToken = sessionStorage.getItem('giftToken');

  useEffect(() => {
    if (!giftToken) {
      toast.error("No gift found to collect");
      navigate('/');
    }
  }, [giftToken, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLoginMode) {
        // Handle login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // After successful login, redirect to collect-signup (the page will handle the gift collection)
        navigate('/download-app');
      } else {
        // Handle signup
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/verify`,
          },
        });
        if (error) throw error;
        
        // After successful signup, redirect to download app
        navigate('/download-app');
      }
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        toast.error("An account with this email already exists. Please sign in instead.");
      } else {
        toast.error(error.message || "Authentication failed. Please try again.");
      }
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-6 space-y-8 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/c34b64be-de23-45c2-9684-b5755b69dd4c.png"
              alt="GiftWave"
              className="h-16 w-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isLoginMode ? "Welcome Back!" : "Collect Your Gift"}
          </h1>
          <p className="text-gray-600">
            {isLoginMode 
              ? "Sign in to receive your gift in your GiftWave wallet" 
              : "Create an account to receive your gift in your GiftWave wallet"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : isLoginMode ? "Sign in" : "Create Account & Collect Gift"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <Button
            variant="link"
            className="p-0 h-auto font-semibold"
            onClick={() => setIsLoginMode(!isLoginMode)}
            disabled={isLoading}
          >
            {isLoginMode ? "Sign up" : "Sign in"}
          </Button>
        </p>
      </Card>
    </div>
  );
};

export default CollectSignup;
