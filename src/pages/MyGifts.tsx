import { BottomNav } from "@/components/ui/bottom-nav";
import { MemoriesGrid } from "@/components/memories/MemoriesGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const MyGifts = () => {
  const { user } = useAuth();

  const { data: gifts, isLoading } = useQuery({
    queryKey: ['gifts', user?.id],
    queryFn: async () => {
      console.log("Fetching gifts for user:", user?.id);
      
      // First, get the user's phone number
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', user?.id)
        .single();

      console.log("User profile:", profile);

      // Then fetch both sent and received gifts
      const { data: giftsData, error: giftsError } = await supabase
        .from('gifts')
        .select(`
          *,
          sender:profiles!gifts_sender_id_fkey(full_name)
        `)
        .or(`sender_id.eq.${user?.id}${profile?.phone_number ? `,recipient_phone.eq.${profile.phone_number}` : ''}`);

      if (giftsError) {
        toast.error("Failed to load gifts");
        throw giftsError;
      }

      console.log("Fetched gifts:", giftsData);
      return giftsData || [];
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E5DEFF] pb-16 flex items-center justify-center">
        <p>Loading gifts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5DEFF] pb-16">
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <MemoriesGrid gifts={gifts || []} />
      </div>
      <BottomNav />
    </div>
  );
};

export default MyGifts;