
import { ThemeOption } from "@/types/gift";

export const themeOptions: ThemeOption[] = [
  {
    text: "HAPPY BIRTHDAY",
    emoji: "🎂",
    bgColor: "bg-[#FFF6E9]",
    screenBgColor: "#FEC6A1",
    textColors: ["text-[#FF6B6B]", "text-[#4ECDC4]", "text-[#FFD93D]", "text-[#FF6B6B]", "text-[#4ECDC4]"],
    pattern: {
      type: 'dots',
      color: 'rgba(255, 107, 107, 0.1)'
    }
  },
  {
    text: "CONGRATULATIONS",
    emoji: "🎉",
    bgColor: "bg-[#F0FFF4]",
    screenBgColor: "#F2FCE2",
    textColors: ["text-[#38A169]", "text-[#2B6CB0]", "text-[#805AD5]", "text-[#38A169]", "text-[#2B6CB0]"],
    pattern: {
      type: 'grid',
      color: 'rgba(56, 161, 105, 0.1)'
    }
  },
  {
    text: "MERRY CHRISTMAS",
    emoji: "🎄",
    bgColor: "bg-[#F5F2E8]",
    screenBgColor: "#FFDEE2",
    textColors: ["text-[#2E5A2C]", "text-[#1B4B6B]", "text-[#EA384C]", "text-[#FF9EBA]", "text-[#C4D6A0]"],
    pattern: {
      type: 'waves',
      color: 'rgba(46, 90, 44, 0.1)'
    }
  },
  {
    text: "THANK YOU",
    emoji: "💝",
    bgColor: "bg-[#FFF5F5]",
    screenBgColor: "#E5DEFF",
    textColors: ["text-[#E53E3E]", "text-[#DD6B20]", "text-[#D53F8C]", "text-[#E53E3E]", "text-[#DD6B20]"],
    pattern: {
      type: 'dots',
      color: 'rgba(229, 62, 62, 0.1)'
    }
  },
  {
    text: "GOOD LUCK",
    emoji: "🍀",
    bgColor: "bg-[#ECFDF5]",
    screenBgColor: "#D3E4FD",
    textColors: ["text-[#047857]", "text-[#059669]", "text-[#10B981]", "text-[#047857]", "text-[#059669]"],
    pattern: {
      type: 'grid',
      color: 'rgba(4, 120, 87, 0.1)'
    }
  }
];

export const stickerOptions = [
  { emoji: "⭐", name: "Star" },
  { emoji: "💫", name: "Sparkle" },
  { emoji: "✨", name: "Glitter" },
  { emoji: "🌟", name: "Glow" },
  { emoji: "💝", name: "Heart" },
];
