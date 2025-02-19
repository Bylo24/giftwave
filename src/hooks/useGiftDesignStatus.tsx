
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { GiftDesign, GiftStatus } from './useGiftDesign';

interface StatusManagementHook {
  startEditing: () => Promise<void>;
  finalizeGiftDesign: () => Promise<void>;
  setPreviewMode: () => Promise<void>;
}

export const useGiftDesignStatus = (
  giftDesign: GiftDesign | null | undefined,
  user: User | null,
  token: string | null,
  sessionId: string
): StatusManagementHook => {
  const queryClient = useQueryClient();

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

  return {
    startEditing,
    finalizeGiftDesign,
    setPreviewMode
  };
};
