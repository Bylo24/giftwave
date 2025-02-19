
import { Home as HomeIcon, Gift, User } from "lucide-react";
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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe-area">
      <div className="px-8 py-2">
        <div className="flex items-center justify-between relative">
          <button
            onClick={() => navigate("/")}
            className="p-2 flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </button>

          <div className="group">
            <button
              onClick={handleNewGift}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg group-hover:shadow-indigo-200/50 transition-all duration-200 -mt-2"
            >
              <Gift className="h-6 w-6 text-white" />
            </button>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="p-2 flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <User className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
