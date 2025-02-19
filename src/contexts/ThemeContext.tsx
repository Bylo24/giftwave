
import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeOption, PatternType } from '@/types/gift';
import { themeOptions } from '@/constants/giftOptions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ThemeContextType {
  selectedThemeOption: ThemeOption;
  handlePatternChange: (type: PatternType) => void;
  setSelectedThemeOption: (theme: ThemeOption) => void;
  isLoading: boolean;
  error: Error | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedThemeOption, setSelectedThemeOption] = useState<ThemeOption>(themeOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadThemeFromGiftDesign = async (token: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('gift_designs')
        .select('theme, front_card_pattern')
        .eq('token', token)
        .single();

      if (error) throw error;

      if (data) {
        const savedTheme = themeOptions.find(t => t.text === data.theme) || themeOptions[0];
        if (data.front_card_pattern) {
          savedTheme.pattern.type = data.front_card_pattern as PatternType;
        }
        setSelectedThemeOption(savedTheme);
      }
    } catch (err) {
      console.error('Error loading theme:', err);
      setError(err instanceof Error ? err : new Error('Failed to load theme'));
      toast.error('Failed to load theme settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatternChange = async (type: PatternType) => {
    try {
      const token = localStorage.getItem('gift_draft_token');
      if (!token) {
        console.warn('No gift draft token found for saving pattern');
        return;
      }

      setSelectedThemeOption(prev => ({
        ...prev,
        pattern: {
          ...prev.pattern,
          type
        }
      }));

      const { error } = await supabase
        .from('gift_designs')
        .update({
          front_card_pattern: type,
          last_edited_at: new Date().toISOString()
        })
        .eq('token', token);

      if (error) throw error;
    } catch (err) {
      console.error('Error saving pattern:', err);
      toast.error('Failed to save pattern changes');
    }
  };

  const updateTheme = async (theme: ThemeOption) => {
    try {
      const token = localStorage.getItem('gift_draft_token');
      if (!token) {
        console.warn('No gift draft token found for saving theme');
        return;
      }

      setSelectedThemeOption(theme);

      const { error } = await supabase
        .from('gift_designs')
        .update({
          theme: theme.text,
          front_card_pattern: theme.pattern.type,
          last_edited_at: new Date().toISOString()
        })
        .eq('token', token);

      if (error) throw error;
    } catch (err) {
      console.error('Error saving theme:', err);
      toast.error('Failed to save theme changes');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('gift_draft_token');
    if (token) {
      loadThemeFromGiftDesign(token);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{
      selectedThemeOption,
      handlePatternChange,
      setSelectedThemeOption: updateTheme,
      isLoading,
      error
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
