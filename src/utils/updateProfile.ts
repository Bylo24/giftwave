
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const updateUserProfile = async (userId: string, phoneNumber: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ 
      phone_number: phoneNumber,
      phone_verified: true // Since we're manually setting this
    })
    .eq('id', userId);

  if (error) {
    toast.error("Failed to update profile");
    throw error;
  }

  toast.success("Phone number updated successfully");
  return true;
};

export const updateGiftPreferences = async (userId: string, preferences: any) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        gift_preferences: preferences
      })
      .eq('id', userId);

    if (error) {
      toast.error("Failed to update gift preferences");
      throw error;
    }

    toast.success("Gift preferences updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating gift preferences:", error);
    throw error;
  }
};
