
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useGiftDesign = (designId: string | null) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createGiftDesign = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be logged in to create a gift design");
      }

      const { data, error } = await supabase
        .from('gift_designs')
        .insert([{
          user_id: user.id,
          selected_amount: 0,
          memories: [],
          message_video_url: null,
          status: 'draft',
          front_card_pattern: null,
          front_card_stickers: [],
          theme: null
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating gift design:", error);
        toast.error("Failed to create gift preview");
        throw error;
      }

      navigate(`/frontcard?id=${data.id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-design'] });
      toast.success("Started new gift design");
    },
  });

  const { data: giftDesign, isLoading } = useQuery({
    queryKey: ['gift-design', designId],
    queryFn: async () => {
      console.log("Fetching gift design, id:", designId);
      let query = supabase
        .from('gift_designs')
        .select('*');

      if (designId) {
        query = query.eq('id', designId);
      } else if (user) {
        query = query
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error("Error fetching gift design:", error);
        toast.error("Failed to load gift preview");
        throw error;
      }

      if (!data) {
        console.log("No gift design found");
        return null;
      }

      console.log("Found gift design:", data);
      return data;
    },
    enabled: Boolean(user),
  });

  return {
    giftDesign,
    isLoading,
    createGiftDesign
  };
};
