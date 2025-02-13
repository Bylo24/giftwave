
import { BottomNav } from "@/components/ui/bottom-nav";
import { MemoriesGrid } from "@/components/memories/MemoriesGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

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

      // Then fetch gifts with sender profile information
      const { data: giftsData, error: giftsError } = await supabase
        .from('gifts')
        .select(`
          *,
          sender:profiles(full_name)
        `)
        .or(`sender_id.eq.${user?.id}${profile?.phone_number ? `,recipient_phone.eq.${profile.phone_number}` : ''}`);

      if (giftsError) {
        console.error("Error fetching gifts:", giftsError);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50/80 to-indigo-50/80 pb-16 flex items-center justify-center">
        <Card className="p-6 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl bg-white/70">
          <p className="text-gray-600">Loading gifts...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 to-indigo-50/80 pb-24">
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 backdrop-blur-lg bg-white/80 -mx-4 px-4 py-4 border-b border-white/20">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            My Gifts
          </h1>
        </div>
        <Card className="p-6 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl bg-white/70">
          <MemoriesGrid gifts={gifts || []} />
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default MyGifts;
