import { supabase } from "@/integrations/supabase/client";

export const fetchUserPhone = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('phone_number')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching phone:', error);
    return null;
  }
  
  return data?.phone_number || null;
};

export const updateUserPhone = async (userId: string, phoneNumber: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ 
      phone_number: phoneNumber,
      phone_verified: false
    })
    .eq('id', userId);

  if (error) throw error;
  return true;
};