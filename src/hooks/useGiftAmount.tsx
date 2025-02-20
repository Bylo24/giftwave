
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const useGiftAmount = (amount: string, onNext: () => Promise<void>) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const draftToken = localStorage.getItem('gift_draft_token');

  const updateGiftDesign = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be logged in to create a gift design");
      }

      if (!draftToken) {
        toast.error("No draft token found. Please start over.");
        navigate('/frontcard');
        return null;
      }

      const { data: giftDesign, error: fetchError } = await supabase
        .from('gift_designs')
        .select('*')
        .eq('token', draftToken)
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching gift design:", fetchError);
        throw new Error("Could not find your gift design");
      }

      if (!giftDesign) {
        throw new Error("Gift design not found");
      }

      const { data, error } = await supabase
        .from('gift_designs')
        .update({
          selected_amount: parseFloat(amount)
        })
        .eq('token', draftToken)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating gift design:", error);
        throw error;
      }

      return data;
    },
    onSuccess: async (data) => {
      if (data?.token) {
        queryClient.invalidateQueries({ queryKey: ['gift-design'] });
        
        try {
          await onNext();
          // Change this line to navigate to select-recipient instead of previewanimation
          navigate(`/select-recipient?token=${data.token}`);
          toast.success("Amount saved successfully");
        } catch (error) {
          console.error("Error transitioning to recipient selection:", error);
          toast.error("Failed to proceed to recipient selection");
        }
      }
    },
    onError: (error) => {
      console.error("Failed to update gift design:", error);
      toast.error("Failed to save amount. Please try again.");
    }
  });

  return {
    updateGiftDesign,
    handleSubmit: async () => {
      if (!amount || parseFloat(amount) <= 0) {
        toast.error("Please select or enter an amount");
        return;
      }

      try {
        await updateGiftDesign.mutateAsync();
      } catch (error) {
        console.error("Failed to update gift design:", error);
      }
    }
  };
};
