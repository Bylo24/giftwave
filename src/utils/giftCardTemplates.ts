
import { supabase } from "@/integrations/supabase/client";

export interface GiftCardTemplate {
  id: string;
  theme: string;
  name: string;
  image_url: string;
}

export interface Frame {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
}

export const fetchTemplatesByTheme = async (theme: string) => {
  const { data, error } = await supabase
    .from('gift_card_templates')
    .select('*')
    .eq('theme', theme);

  if (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }

  return data as GiftCardTemplate[];
};

export const fetchFrames = async (): Promise<Frame[]> => {
  const { data, error } = await supabase
    .from('frames')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching frames:', error);
    throw error;
  }

  return data;
};

export const uploadGiftAsset = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('gift-assets')
    .upload(path, file);

  if (error) {
    console.error('Error uploading file:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('gift-assets')
    .getPublicUrl(path);

  return publicUrl;
};
