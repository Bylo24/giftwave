
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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (!giftToken) throw new Error("Gift token not found");

      // First show success message
      toast.success("Account created successfully!");
      
      // Get the gift details
      const { data: gift, error: giftError } = await supabase
        .from('gifts')
        .select('amount, status')
        .eq('token', giftToken)
        .single();

      if (giftError) throw giftError;

      if (gift.status !== 'pending') {
        throw new Error("This gift has already been collected");
      }

      // Update the gift status and collector
      const { error: updateError } = await supabase
        .from('gifts')
        .update({
          status: 'collected',
          collector_id: authData.user?.id,
          collected_at: new Date().toISOString(),
          collection_status: 'completed'
        })
        .eq('token', giftToken);

      if (updateError) throw updateError;

      // Update the recipient's wallet balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user?.id,
          wallet_balance: gift.amount
        });

      if (balanceError) throw balanceError;

      // Clear the gift token from session storage
      sessionStorage.removeItem('giftToken');
      
      // Then navigate to download app page
      navigate('/download-app');
      
    } catch (error: any) {
      console.error('Error during signup:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
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
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
        </p>
      </Card>
    </div>
  );
};

export default CollectSignup;
