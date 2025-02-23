
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handlePendingGiftCollection = async (userId: string) => {
    const giftToken = sessionStorage.getItem('giftToken');
    if (!giftToken) return;

    try {
      // Check if gift is valid and uncollected
      const { data: gift, error: giftError } = await supabase
        .from('gifts')
        .select('amount, status')
        .eq('token', giftToken)
        .single();

      if (giftError || !gift || gift.status !== 'pending') {
        sessionStorage.removeItem('giftToken');
        return;
      }

      // Get current wallet balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', userId)
        .single();

      const currentBalance = profile?.wallet_balance || 0;
      const newBalance = currentBalance + gift.amount;

      // Update gift status
      const { error: updateGiftError } = await supabase
        .from('gifts')
        .update({
          status: 'collected',
          collector_id: userId,
          collected_at: new Date().toISOString(),
          collection_status: 'completed'
        })
        .eq('token', giftToken)
        .eq('status', 'pending');

      if (updateGiftError) throw updateGiftError;

      // Update wallet balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          wallet_balance: newBalance
        });

      if (balanceError) throw balanceError;

      toast.success("Gift collected successfully!");
      sessionStorage.removeItem('giftToken');
      navigate('/download-app');
    } catch (error: any) {
      console.error('Error collecting gift:', error);
      toast.error("Failed to collect gift. Please try again.");
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        handlePendingGiftCollection(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await handlePendingGiftCollection(session.user.id);
        // If user is logged in and on login page, redirect to home
        if (window.location.pathname === "/login") {
          const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/home';
          sessionStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        }
      } else {
        // If user is logged out and not on login page, redirect to login
        if (window.location.pathname !== "/login") {
          navigate("/login");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
