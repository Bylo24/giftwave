
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ThemeOption } from '@/types/gift';

interface ThemeSelectorProps {
  themes: ThemeOption[];
  selectedTheme: ThemeOption;
  onThemeChange: (theme: ThemeOption) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  selectedTheme,
  onThemeChange,
}) => {
  return (
    <div className="relative">
      <select
        value={selectedTheme.text}
        onChange={(e) => {
          const newTheme = themes.find(t => t.text === e.target.value);
          if (newTheme) onThemeChange(newTheme);
        }}
        className="appearance-none pl-4 pr-10 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium border-0 shadow-lg focus:ring-2 focus:ring-white/50 focus:outline-none cursor-pointer"
      >
        {themes.map((theme) => (
          <option key={theme.text} value={theme.text} className="py-2">
            {theme.text}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
    </div>
  );
};
