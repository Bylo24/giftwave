
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';
import { useGiftDesignRealtime } from './useGiftDesignRealtime';
import { useGiftDesignStatus } from './useGiftDesignStatus';

type GiftDesignRow = Database['public']['Tables']['gift_designs']['Row'];

export type GiftStatus = 'draft' | 'editing' | 'preview' | 'finalized' | 'sent';

export interface GiftDesign {
  id: string;
  front_card_pattern: string | null;
  front_card_stickers: any[] | null;
  selected_amount: number | null;
  memories: any[] | null;
  message_video_url: string | null;
  theme: string | null;
  token: string;
  status: GiftStatus;
  editing_session_id: string | null;
  editing_user_id: string | null;
  last_edited_at: string;
  user_id: string | null;
  created_at: string;
  screen_bg_color: string;
  card_bg_color: string;
}

export const useGiftDesign = (token: string | null) => {
  const { user } = useAuth();
  const [sessionId] = useState(() => crypto.randomUUID());

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

      if (!data) throw new Error('No gift design found');

      // Parse JSON fields and handle nullables
      const frontCardStickers = data.front_card_stickers ? 
        (typeof data.front_card_stickers === 'string' ? 
          JSON.parse(data.front_card_stickers) : data.front_card_stickers) : null;

      const memories = data.memories ? 
        (typeof data.memories === 'string' ? 
          JSON.parse(data.memories) : data.memories) : [];

      // Construct the GiftDesign object
      const giftDesign: GiftDesign = {
        id: data.id,
        front_card_pattern: data.front_card_pattern,
        front_card_stickers: Array.isArray(frontCardStickers) ? frontCardStickers : null,
        selected_amount: data.selected_amount,
        memories: Array.isArray(memories) ? memories : [],
        message_video_url: data.message_video_url,
        theme: data.theme,
        token: data.token || '',
        status: (data.status || 'draft') as GiftStatus,
        editing_session_id: data.editing_session_id || null,
        editing_user_id: data.editing_user_id || null,
        last_edited_at: data.last_edited_at || data.created_at,
        user_id: data.user_id,
        created_at: data.created_at,
        screen_bg_color: data.screen_bg_color || '#FEC6A1',
        card_bg_color: data.card_bg_color || '#ffffff'
      };

      return giftDesign;
    },
    enabled: !!token
  });

  // Get realtime updates
  const realtimeGiftDesign = useGiftDesignRealtime(token, sessionId);

  // Get status management functions
  const {
    startEditing,
    finalizeGiftDesign,
    setPreviewMode
  } = useGiftDesignStatus(realtimeGiftDesign || initialGiftDesign, user, token, sessionId);

  // Use realtime data if available, otherwise use initial data
  const giftDesign = realtimeGiftDesign || initialGiftDesign;

  // Update isEditable to include preview status since we're still in the gift creation flow
  const isEditable = giftDesign?.status === 'draft' || 
                    giftDesign?.status === 'editing' || 
                    giftDesign?.status === 'preview';

  return {
    giftDesign,
    isLoading,
    error,
    startEditing,
    finalizeGiftDesign,
    setPreviewMode,
    isEditable,
    isPreviewMode: giftDesign?.status === 'preview',
    isFinalized: giftDesign?.status === 'finalized' || giftDesign?.status === 'sent'
  };
};
