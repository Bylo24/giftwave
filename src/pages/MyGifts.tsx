import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Gift } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const MyGifts = () => {
  const { user } = useAuth();

  const { data: gifts, isLoading } = useQuery({
    queryKey: ['gifts', user?.id],
    queryFn: async () => {
      // First, fetch the gifts
      const { data: giftsData, error: giftsError } = await supabase
        .from('gifts')
        .select('*')
        .or(`sender_id.eq.${user?.id}${user?.phone ? `,recipient_phone.eq.${user.phone}` : ''}`);

      if (giftsError) {
        toast.error("Failed to load gifts");
        throw giftsError;
      }

      // For each gift, fetch the sender's profile if it's not the current user
      const giftsWithProfiles = await Promise.all(
        (giftsData || []).map(async (gift) => {
          if (gift.sender_id === user?.id) {
            return { ...gift, sender_name: 'You' };
          }

          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', gift.sender_id)
            .single();

          return {
            ...gift,
            sender_name: profileData?.full_name || 'Anonymous'
          };
        })
      );

      console.log("Fetched gifts:", giftsWithProfiles); // Debug log
      return giftsWithProfiles || [];
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
        <h1 className="text-2xl font-bold text-[#1A1F2C] text-center">My Gifts</h1>
        
        {(!gifts || gifts.length === 0) ? (
          <Card className="p-8 text-center space-y-4 border-[#9b87f5]">
            <Gift className="w-16 h-16 mx-auto text-[#9b87f5]" />
            <p className="text-lg text-[#6E59A5]">
              Sorry, you don't have any gifts yet :( :(
            </p>
            <p className="text-sm text-[#7E69AB]">
              When someone sends you a gift, it will appear here!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {gifts.map((gift) => (
              <Card key={gift.id} className="p-4 border-[#9b87f5]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {gift.sender_id === user?.id ? 'Sent to: ' + gift.recipient_phone : 'From: ' + gift.sender_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Amount: ${gift.amount}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(gift.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Gift className="w-6 h-6 text-[#9b87f5]" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default MyGifts;