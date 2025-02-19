
export type PatternType = 'dots' | 'grid' | 'waves' | 'none';

export interface ThemeOption {
  text: string;
  emoji: string;
  bgColor: string;
  screenBgColor: string;
  textColors: string[];
  pattern: {
    type: PatternType;
    color: string;
  };
}

// Update Sticker interface to be JSON-compatible
export interface Sticker {
  [key: string]: string | number; // Make type indexable
  id: string;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
}

export interface Memory {
  id: string;
  imageUrl?: string;
  caption: string;
  date: Date;
}

export interface GiftMemory {
  caption: string;
  date: Date;
}
