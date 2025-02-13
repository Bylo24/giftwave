
import { BottomNav } from "@/components/ui/bottom-nav";
import { MemoriesGrid } from "@/components/memories/MemoriesGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContentCard } from "@/components/layout/ContentCard";

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

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-screen">
          <ContentCard>
            <p className="text-gray-600">Loading gifts...</p>
          </ContentCard>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <PageHeader title="My Gifts" />
        <ContentCard>
          <MemoriesGrid gifts={gifts || []} />
        </ContentCard>
      </div>
      <BottomNav />
    </PageContainer>
  );
};

export default MyGifts;
