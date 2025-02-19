
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GiftDesign {
  id: string;
  front_card_pattern: string | null;
  front_card_stickers: any[] | null;
  selected_amount: number | null;
  memories: any[] | null;
  message_video_url: string | null;
  theme: string | null;
  token: string;
  status: string;
}

export const useGiftDesign = (token: string | null) => {
  const [realtimeGiftDesign, setRealtimeGiftDesign] = useState<GiftDesign | null>(null);

  const { data: initialGiftDesign, isLoading, error } = useQuery({
    queryKey: ['gift-design', token],
    queryFn: async () => {
      if (!token) throw new Error('No token provided');
      
      const { data, error } = await supabase
        .from('gift_designs')
        .select('*')
        .eq('token', token)
        .single();

      if (error) {
        console.error('Error fetching gift design:', error);
        throw error;
      }

      return data as GiftDesign;
    },
    enabled: !!token
  });

  useEffect(() => {
    if (!token) return;

    const channel = supabase
      .channel('gift-design-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gift_designs',
          filter: `token=eq.${token}`
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          setRealtimeGiftDesign(payload.new as GiftDesign);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [token]);

  const giftDesign = realtimeGiftDesign || initialGiftDesign;

  return {
    giftDesign,
    isLoading,
    error
  };
};
