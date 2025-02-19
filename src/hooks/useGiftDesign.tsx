
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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
}

export const useGiftDesign = (token: string | null) => {
  const [realtimeGiftDesign, setRealtimeGiftDesign] = useState<GiftDesign | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Generate a unique session ID for this editing session
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

      // Explicitly construct the GiftDesign object with all required properties
      const giftDesign: GiftDesign = {
        id: data.id,
        front_card_pattern: data.front_card_pattern,
        front_card_stickers: data.front_card_stickers,
        selected_amount: data.selected_amount,
        memories: data.memories,
        message_video_url: data.message_video_url,
        theme: data.theme,
        token: data.token,
        status: (data.status || 'draft') as GiftStatus,
        editing_session_id: data.editing_session_id || null,
        editing_user_id: data.editing_user_id || null,
        last_edited_at: data.last_edited_at || data.created_at,
        user_id: data.user_id,
        created_at: data.created_at
      };

      return giftDesign;
    },
    enabled: !!token
  });

  // Mutation to update gift status
  const updateGiftStatus = useMutation({
    mutationFn: async ({ id, status, sessionId }: { id: string; status: GiftStatus; sessionId: string }) => {
      const { data, error } = await supabase
        .from('gift_designs')
        .update({ 
          status,
          editing_session_id: status === 'editing' ? sessionId : null,
          editing_user_id: status === 'editing' ? user?.id : null,
          last_edited_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['gift-design', token], data);
    },
    onError: (error) => {
      console.error('Error updating gift status:', error);
      toast.error('Failed to update gift status');
    }
  });

  // Start editing session
  const startEditing = async () => {
    if (!giftDesign || !user) return;

    if (giftDesign.status !== 'draft' && giftDesign.status !== 'editing') {
      toast.error('This gift design cannot be edited');
      return;
    }

    if (giftDesign.editing_user_id && giftDesign.editing_user_id !== user.id) {
      const lastEdit = new Date(giftDesign.last_edited_at);
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      if (lastEdit > thirtyMinutesAgo) {
        toast.error('This gift is currently being edited by another user');
        return;
      }
    }

    try {
      await updateGiftStatus.mutateAsync({
        id: giftDesign.id,
        status: 'editing',
        sessionId
      });
      toast.success('Started editing session');
    } catch (error) {
      console.error('Error starting edit session:', error);
      toast.error('Failed to start editing session');
    }
  };

  // Finalize gift design
  const finalizeGiftDesign = async () => {
    if (!giftDesign || !user) return;

    if (giftDesign.status !== 'preview') {
      toast.error('Gift must be in preview state before finalizing');
      return;
    }

    try {
      await updateGiftStatus.mutateAsync({
        id: giftDesign.id,
        status: 'finalized',
        sessionId
      });
      toast.success('Gift design finalized');
    } catch (error) {
      console.error('Error finalizing gift:', error);
      toast.error('Failed to finalize gift');
    }
  };

  // Set gift to preview mode
  const setPreviewMode = async () => {
    if (!giftDesign || !user) return;

    if (giftDesign.status !== 'editing') {
      toast.error('Gift must be in editing state before preview');
      return;
    }

    try {
      await updateGiftStatus.mutateAsync({
        id: giftDesign.id,
        status: 'preview',
        sessionId
      });
      toast.success('Gift ready for preview');
    } catch (error) {
      console.error('Error setting preview mode:', error);
      toast.error('Failed to set preview mode');
    }
  };

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
          const newData = payload.new;
          
          // Don't apply updates if they're from a different editing session
          if (newData.editing_session_id && 
              newData.editing_session_id !== sessionId && 
              newData.status === 'editing') {
            return;
          }
          
          // Explicitly construct the GiftDesign object for realtime updates
          const updatedGiftDesign: GiftDesign = {
            id: newData.id,
            front_card_pattern: newData.front_card_pattern,
            front_card_stickers: newData.front_card_stickers,
            selected_amount: newData.selected_amount,
            memories: newData.memories,
            message_video_url: newData.message_video_url,
            theme: newData.theme,
            token: newData.token,
            status: (newData.status || 'draft') as GiftStatus,
            editing_session_id: newData.editing_session_id || null,
            editing_user_id: newData.editing_user_id || null,
            last_edited_at: newData.last_edited_at || newData.created_at,
            user_id: newData.user_id,
            created_at: newData.created_at
          };
          
          setRealtimeGiftDesign(updatedGiftDesign);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [token, sessionId]);

  const giftDesign = realtimeGiftDesign || initialGiftDesign;

  return {
    giftDesign,
    isLoading,
    error,
    startEditing,
    finalizeGiftDesign,
    setPreviewMode,
    isEditable: giftDesign?.status === 'draft' || giftDesign?.status === 'editing',
    isPreviewMode: giftDesign?.status === 'preview',
    isFinalized: giftDesign?.status === 'finalized' || giftDesign?.status === 'sent'
  };
};
