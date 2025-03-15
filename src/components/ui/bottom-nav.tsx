
import { Home as HomeIcon, Gift, Wallet, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNewGift = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_designs')
        .insert([{}])
        .select()
        .single();

      if (error) throw error;

      // Store the new token and navigate
      localStorage.setItem('gift_draft_token', data.token);
      toast.success('Started new gift');
      navigate('/frontcard');
    } catch (err) {
      console.error('Error creating new gift:', err);
      toast.error('Failed to start new gift');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe-area z-20">
      <div className="px-2 py-2 max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between relative">
          <button
            onClick={() => navigate("/home")}
            className="p-2 flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <HomeIcon className={`h-5 w-5 ${isActive('/home') ? 'text-blue-500' : ''}`} />
            <span className={`text-xs ${isActive('/home') ? 'text-blue-500 font-medium' : ''}`}>Home</span>
          </button>

          <button
            onClick={() => navigate("/my-gifts")}
            className="p-2 flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Gift className={`h-5 w-5 ${isActive('/my-gifts') ? 'text-blue-500' : ''}`} />
            <span className={`text-xs ${isActive('/my-gifts') ? 'text-blue-500 font-medium' : ''}`}>My Gifts</span>
          </button>

          <div className="group">
            <button
              onClick={handleNewGift}
              className="bg-blue-500 hover:bg-blue-600 rounded-full p-3.5 shadow-sm transition-colors"
            >
              <Gift className="h-5 w-5 text-white" />
            </button>
          </div>

          <button
            onClick={() => navigate("/wallet")}
            className="p-2 flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Wallet className={`h-5 w-5 ${isActive('/wallet') ? 'text-blue-500' : ''}`} />
            <span className={`text-xs ${isActive('/wallet') ? 'text-blue-500 font-medium' : ''}`}>Wallet</span>
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="p-2 flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <User className={`h-5 w-5 ${isActive('/profile') ? 'text-blue-500' : ''}`} />
            <span className={`text-xs ${isActive('/profile') ? 'text-blue-500 font-medium' : ''}`}>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
