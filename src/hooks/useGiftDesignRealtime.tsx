
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { GiftDesign, GiftStatus } from './useGiftDesign';

type GiftDesignRow = Database['public']['Tables']['gift_designs']['Row'];

export const useGiftDesignRealtime = (token: string | null, sessionId: string) => {
  const [realtimeGiftDesign, setRealtimeGiftDesign] = useState<GiftDesign | null>(null);

  useEffect(() => {
    if (!token) return;

    const channel = supabase
      .channel('gift-design-changes')
      .on<GiftDesignRow>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gift_designs',
          filter: `token=eq.${token}`
        },
        (payload: RealtimePostgresChangesPayload<GiftDesignRow>) => {
          console.log('Realtime update received:', payload);
          if (!payload.new) return;
          
          const newData = payload.new as GiftDesignRow;
          
          // Parse JSON fields and handle nullables for realtime updates
          const frontCardStickers = newData.front_card_stickers ? 
            (typeof newData.front_card_stickers === 'string' ? 
              JSON.parse(newData.front_card_stickers) : newData.front_card_stickers) : null;

          const memories = newData.memories ? 
            (typeof newData.memories === 'string' ? 
              JSON.parse(newData.memories) : newData.memories) : [];
          
          // Don't apply updates if they're from a different editing session
          if (newData.editing_session_id && 
              newData.editing_session_id !== sessionId && 
              newData.status === 'editing') {
            return;
          }
          
          // Construct the GiftDesign object for realtime updates
          const updatedGiftDesign: GiftDesign = {
            id: newData.id,
            front_card_pattern: newData.front_card_pattern,
            front_card_stickers: Array.isArray(frontCardStickers) ? frontCardStickers : null,
            selected_amount: newData.selected_amount,
            memories: Array.isArray(memories) ? memories : [],
            message_video_url: newData.message_video_url,
            theme: newData.theme,
            token: newData.token || '',
            status: (newData.status || 'draft') as GiftStatus,
            editing_session_id: newData.editing_session_id || null,
            editing_user_id: newData.editing_user_id || null,
            last_edited_at: newData.last_edited_at || newData.created_at,
            user_id: newData.user_id,
            created_at: newData.created_at,
            screen_bg_color: newData.screen_bg_color || '#FEC6A1'
          };
          
          setRealtimeGiftDesign(updatedGiftDesign);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [token, sessionId]);

  return realtimeGiftDesign;
};
