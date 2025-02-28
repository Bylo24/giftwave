
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ThemeOption } from '@/types/gift';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="relative z-20">
      <Select 
        value={selectedTheme.text} 
        onValueChange={(value) => {
          const newTheme = themes.find(t => t.text === value);
          if (newTheme) onThemeChange(newTheme);
        }}
      >
        <SelectTrigger className="w-[180px] bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium border-0 shadow-lg">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {themes.map((theme) => (
            <SelectItem 
              key={theme.text} 
              value={theme.text}
              className="flex items-center py-2"
            >
              <span className="mr-2">{theme.emoji}</span>
              <span>{theme.text}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
