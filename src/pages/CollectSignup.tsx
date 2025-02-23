
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
  const giftToken = sessionStorage.getItem('giftToken');

  useEffect(() => {
    if (!giftToken) {
      toast.error("No gift found to collect");
      navigate('/');
    }
  }, [giftToken, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First check if the gift is valid and uncollected
      const { data: gift, error: giftError } = await supabase
        .from('gifts')
        .select('amount, status')
        .eq('token', giftToken)
        .single();

      if (giftError) {
        toast.error("Invalid or expired gift");
        return;
      }

      if (gift.status !== 'pending') {
        toast.error("This gift has already been collected");
        return;
      }

      if (gift.amount <= 0) {
        toast.error("Invalid gift amount");
        return;
      }

      // Try to sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('already exists')) {
          toast.error("An account with this email already exists. Please sign in instead.");
          return;
        }
        throw authError;
      }

      if (!authData.user) throw new Error("Signup failed");

      // Get the current wallet balance if it exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', authData.user.id)
        .single();

      const currentBalance = profile?.wallet_balance || 0;
      const newBalance = currentBalance + gift.amount;

      // Begin the gift collection process
      const { error: updateGiftError } = await supabase
        .from('gifts')
        .update({
          status: 'collected',
          collector_id: authData.user.id,
          collected_at: new Date().toISOString(),
          collection_status: 'completed'
        })
        .eq('token', giftToken)
        .eq('status', 'pending'); // Extra check to prevent race conditions

      if (updateGiftError) throw updateGiftError;

      // Update the wallet balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          wallet_balance: newBalance
        });

      if (balanceError) throw balanceError;

      // Show success message and clean up
      toast.success("Gift collected successfully!");
      sessionStorage.removeItem('giftToken');
      
      // Navigate to download app page
      navigate('/download-app');
      
    } catch (error: any) {
      console.error('Error during signup:', error);
      toast.error(error.message || "Failed to collect gift. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    // Store current route in session storage to redirect back after login
    sessionStorage.setItem('redirectAfterLogin', '/collect-signup');
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-6 space-y-8 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            <img 
              src="/giftwave-icon.svg" 
              alt="GiftWave" 
              className="h-8 w-8"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Collect Your Gift</h1>
          <p className="text-gray-600">Create an account to receive your gift in your GiftWave wallet</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
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
            {isLoading ? "Creating Account..." : "Create Account & Collect Gift"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-semibold"
            onClick={handleLogin}
            disabled={isLoading}
          >
            Sign in
          </Button>
        </p>
      </Card>
    </div>
  );
};

export default CollectSignup;
