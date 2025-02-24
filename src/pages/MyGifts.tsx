
import { BottomNav } from "@/components/ui/bottom-nav";
import { MemoriesGrid } from "@/components/memories/MemoriesGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContentCard } from "@/components/layout/ContentCard";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { Gift } from "lucide-react";

const MyGifts = () => {
  const { user } = useAuth();

  const { data: gifts, isLoading } = useQuery({
    queryKey: ['gifts', user?.id],
    queryFn: async () => {
      console.log("Fetching gifts for user:", user?.id);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', user?.id)
        .single();

      console.log("User profile:", profile);

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

  const totalAmount = gifts?.reduce((sum, gift) => sum + (gift.amount || 0), 0) || 0;

  if (isLoading) {
    return (
      <PageContainer>
        <div className="min-h-screen bg-gradient-to-br from-[#221F26] to-[#2A2533]">
          <div className="animate-pulse space-y-4 p-4">
            <div className="h-12 bg-gray-700/20 rounded-lg w-3/4" />
            <div className="h-24 bg-gray-700/20 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-700/20 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PullToRefresh />
      <div className="min-h-screen bg-gradient-to-br from-[#221F26] to-[#2A2533] text-white">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-[#221F26]/80 backdrop-blur-lg shadow-xl">
          <div className="px-4 py-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  My Gifts
                </h1>
                <p className="text-gray-400 text-sm">
                  Total received: ${totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Gift className="h-6 w-6 text-[#0EA5E9]" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 max-w-2xl mx-auto pb-24">
          <MemoriesGrid gifts={gifts || []} />
        </div>
      </div>
      <BottomNav />
    </PageContainer>
  );
};

export default MyGifts;
