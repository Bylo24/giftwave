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
  templates: Array<{
    id: string;
    name: string;
    imageUrl: string;
  }>;
  stickers: Array<{
    id: string;
    emoji: string;
    name: string;
  }>;
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
    animations: ['animate-bounce', 'animate-pulse'],
    templates: [
      {
        id: 'birthday-1',
        name: 'Balloons & Confetti',
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05'
      },
      {
        id: 'birthday-2',
        name: 'Party Time',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
      }
    ],
    stickers: [
      { id: 'sticker-1', emoji: '🎈', name: 'Balloon' },
      { id: 'sticker-2', emoji: '🎂', name: 'Cake' },
      { id: 'sticker-3', emoji: '🎁', name: 'Gift' },
      { id: 'sticker-4', emoji: '🎉', name: 'Party' }
    ]
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
    animations: ['animate-fade-in', 'animate-scale-in'],
    templates: [
      {
        id: 'wedding-1',
        name: 'Elegant Roses',
        imageUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07'
      }
    ],
    stickers: [
      { id: 'sticker-5', emoji: '💍', name: 'Ring' },
      { id: 'sticker-6', emoji: '🕊️', name: 'Dove' },
      { id: 'sticker-7', emoji: '💐', name: 'Bouquet' }
    ]
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
    animations: ['animate-bounce', 'animate-pulse'],
    templates: [
      {
        id: 'holiday-1',
        name: 'Snowflakes',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
      }
    ],
    stickers: [
      { id: 'sticker-8', emoji: '❄️', name: 'Snowflake' },
      { id: 'sticker-9', emoji: '🎁', name: 'Gift' },
      { id: 'sticker-10', emoji: '🎉', name: 'Party' }
    ]
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
    animations: ['animate-fade-in', 'animate-scale-in'],
    templates: [
      {
        id: 'celebration-1',
        name: 'Confetti',
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05'
      }
    ],
    stickers: [
      { id: 'sticker-11', emoji: '🎊', name: 'Party' },
      { id: 'sticker-12', emoji: '🎉', name: 'Gift' },
      { id: 'sticker-13', emoji: '🎈', name: 'Balloon' }
    ]
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
    animations: ['animate-bounce', 'animate-pulse'],
    templates: [
      {
        id: 'achievement-1',
        name: 'Gold Medal',
        imageUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07'
      }
    ],
    stickers: [
      { id: 'sticker-14', emoji: '🏆', name: 'Gold Medal' },
      { id: 'sticker-15', emoji: '🎉', name: 'Party' },
      { id: 'sticker-16', emoji: '🎈', name: 'Balloon' }
    ]
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
    animations: ['animate-fade-in'],
    templates: [
      {
        id: 'custom-1',
        name: 'Custom Template',
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05'
      }
    ],
    stickers: [
      { id: 'sticker-17', emoji: '🎨', name: 'Custom Sticker' },
      { id: 'sticker-18', emoji: '🎉', name: 'Party' },
      { id: 'sticker-19', emoji: '🎈', name: 'Balloon' }
    ]
  }
};

export interface StickerPosition {
  id: string;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
}
