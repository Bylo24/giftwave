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