
import { createContext, useContext, useState } from 'react';
import { ThemeOption, PatternType } from '@/types/gift';
import { themeOptions } from '@/constants/giftOptions';

interface ThemeContextType {
  selectedThemeOption: ThemeOption;
  handlePatternChange: (type: PatternType) => void;
  setSelectedThemeOption: (theme: ThemeOption) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedThemeOption, setSelectedThemeOption] = useState<ThemeOption>(themeOptions[0]);

  const handlePatternChange = (type: PatternType) => {
    setSelectedThemeOption(prev => ({
      ...prev,
      pattern: {
        ...prev.pattern,
        type
      }
    }));
  };

  return (
    <ThemeContext.Provider value={{
      selectedThemeOption,
      handlePatternChange,
      setSelectedThemeOption
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
