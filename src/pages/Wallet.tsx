
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Wallet as WalletIcon, Plus, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { AddCard } from "@/components/wallet/AddCard";
import { SavedCards } from "@/components/wallet/SavedCards";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Wallet = () => {
  const { session, user } = useAuth();
  const [firstName, setFirstName] = useState<string>('there');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data?.full_name) {
          // Get the first word from full_name
          const firstWord = data.full_name.split(' ')[0];
          setFirstName(firstWord);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    const ensureStripeCustomer = async () => {
      if (!session?.access_token) {
        console.error('No auth session available');
        return;
      }

      try {
        const { error } = await supabase.functions.invoke(
          'ensure-stripe-customer',
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          }
        );
        if (error) throw error;
      } catch (error) {
        console.error('Error ensuring Stripe customer:', error);
        toast.error('Failed to initialize payment system');
      }
    };

    if (user && session?.access_token) {
      ensureStripeCustomer();
    }
  }, [user, session]);

  if (!session?.access_token) {
    return (
      <div className="min-h-screen bg-white pb-16">
        <div className="p-4 pt-16">
          <Card className="p-4">
            <p className="text-center text-gray-500">Please log in to access your wallet</p>
          </Card>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <div className="p-4 pt-16 space-y-6 max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-xl font-medium text-gray-800">
            Hey <Link to="/profile" className="text-primary hover:underline">{firstName}</Link>,
          </h1>
          <p className="text-gray-600">here's your balance</p>
        </div>

        <Card className="p-6 bg-gradient-to-br from-indigo-500 to-blue-600 text-white backdrop-blur-lg border border-white/10 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <WalletIcon className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Your Balance</h2>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">$0.00</p>
            <p className="text-sm opacity-80">Available balance</p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="p-4 text-center cursor-pointer hover:bg-white/80 transition-colors backdrop-blur-lg border border-gray-200/20 shadow-lg"
            onClick={() => {/* Add funds handler */}}
          >
            <Plus className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="font-medium">Add Funds</p>
          </Card>

          <Card 
            className="p-4 text-center cursor-pointer hover:bg-white/80 transition-colors backdrop-blur-lg border border-gray-200/20 shadow-lg"
            onClick={() => {/* Deposit handler */}}
          >
            <Download className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="font-medium">Deposit</p>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment Methods</h3>
          <Card className="backdrop-blur-lg border border-gray-200/20 shadow-lg">
            <SavedCards />
          </Card>
          <AddCard />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <Card className="p-4 backdrop-blur-lg border border-gray-200/20 shadow-lg">
            <p className="text-center text-gray-500">No recent transactions</p>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Wallet;
