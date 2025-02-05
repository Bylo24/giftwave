export type ThemeType = 'birthday' | 'wedding' | 'holiday' | 'celebration' | 'achievement' | 'custom';

export interface GiftTheme {
  id: ThemeType;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  icon: string;
  animations: string[];
}

export const giftThemes: Record<ThemeType, GiftTheme> = {
  birthday: {
    id: 'birthday',
    name: 'Birthday Celebration',
    colors: {
      primary: 'from-purple-500 to-pink-500',
      secondary: 'from-pink-50 to-purple-50',
      accent: 'text-purple-500'
    },
    icon: '🎂',
    animations: ['animate-bounce', 'animate-pulse']
  },
  wedding: {
    id: 'wedding',
    name: 'Wedding Bells',
    colors: {
      primary: 'from-rose-400 to-pink-300',
      secondary: 'from-rose-50 to-pink-50',
      accent: 'text-rose-400'
    },
    icon: '💒',
    animations: ['animate-fade-in', 'animate-scale-in']
  },
  holiday: {
    id: 'holiday',
    name: 'Holiday Cheer',
    colors: {
      primary: 'from-red-500 to-green-500',
      secondary: 'from-red-50 to-green-50',
      accent: 'text-red-500'
    },
    icon: '🎄',
    animations: ['animate-bounce', 'animate-pulse']
  },
  celebration: {
    id: 'celebration',
    name: 'General Celebration',
    colors: {
      primary: 'from-blue-500 to-purple-500',
      secondary: 'from-blue-50 to-purple-50',
      accent: 'text-blue-500'
    },
    icon: '🎉',
    animations: ['animate-fade-in', 'animate-scale-in']
  },
  achievement: {
    id: 'achievement',
    name: 'Achievement',
    colors: {
      primary: 'from-yellow-500 to-orange-500',
      secondary: 'from-yellow-50 to-orange-50',
      accent: 'text-yellow-500'
    },
    icon: '🏆',
    animations: ['animate-bounce', 'animate-pulse']
  },
  custom: {
    id: 'custom',
    name: 'Custom Theme',
    colors: {
      primary: 'from-gray-500 to-slate-500',
      secondary: 'from-gray-50 to-slate-50',
      accent: 'text-gray-500'
    },
    icon: '🎨',
    animations: ['animate-fade-in']
  }
};