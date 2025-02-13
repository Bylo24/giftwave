
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

export interface Sticker {
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
