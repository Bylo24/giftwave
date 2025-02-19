
import { Home as HomeIcon, Gift, Wallet, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showGiftDialog, setShowGiftDialog] = useState(false);

  const handleNewGift = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_designs')
        .insert([{ status: 'draft' }])
        .select()
        .single();

      if (error) throw error;

      localStorage.setItem('gift_draft_token', data.token);
      toast.success('Started new gift');
      navigate('/frontcard');
    } catch (err) {
      console.error('Error creating new gift:', err);
      toast.error('Failed to start new gift');
    }
  };

  const handleContinueDraft = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_designs')
        .select('token')
        .eq('status', 'draft')
        .order('last_edited_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!data) {
        toast.info('No draft found. Starting new gift...');
        handleNewGift();
        return;
      }

      if (error) throw error;

      localStorage.setItem('gift_draft_token', data.token);
      toast.success('Continuing from last draft');
      navigate('/frontcard');
    } catch (err) {
      console.error('Error fetching draft:', err);
      toast.error('Failed to continue draft');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <Dialog open={showGiftDialog} onOpenChange={setShowGiftDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Gift</DialogTitle>
            <DialogDescription>
              Would you like to continue your last draft or start a new gift?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Button
              onClick={() => {
                setShowGiftDialog(false);
                handleContinueDraft();
              }}
              className="w-full"
            >
              Continue Last Draft
            </Button>
            <Button
              onClick={() => {
                setShowGiftDialog(false);
                handleNewGift();
              }}
              variant="outline"
              className="w-full"
            >
              Start New Gift
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe-area">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between relative">
            <button
              onClick={() => navigate("/home")}
              className="p-2 flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <HomeIcon className={`h-6 w-6 ${isActive('/home') ? 'text-blue-600' : ''}`} />
              <span className={`text-xs ${isActive('/home') ? 'text-blue-600' : ''}`}>Home</span>
            </button>

            <button
              onClick={() => navigate("/my-gifts")}
              className="p-2 flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <Gift className={`h-6 w-6 ${isActive('/my-gifts') ? 'text-blue-600' : ''}`} />
              <span className={`text-xs ${isActive('/my-gifts') ? 'text-blue-600' : ''}`}>My Gifts</span>
            </button>

            <div className="group">
              <button
                onClick={() => setShowGiftDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg group-hover:shadow-indigo-200/50 transition-all duration-200 -mt-2"
              >
                <Gift className="h-6 w-6 text-white" />
              </button>
            </div>

            <button
              onClick={() => navigate("/wallet")}
              className="p-2 flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <Wallet className={`h-6 w-6 ${isActive('/wallet') ? 'text-blue-600' : ''}`} />
              <span className={`text-xs ${isActive('/wallet') ? 'text-blue-600' : ''}`}>Wallet</span>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="p-2 flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <User className={`h-6 w-6 ${isActive('/profile') ? 'text-blue-600' : ''}`} />
              <span className={`text-xs ${isActive('/profile') ? 'text-blue-600' : ''}`}>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
