
import { ThemeOption } from "@/types/gift";

interface CardContentProps {
  text: string;
  emoji: string;
  textColors: string[];
}

export const CardContent = ({ text, emoji, textColors }: CardContentProps) => {
  return (
    <div className="relative z-10 h-full flex flex-col items-center justify-center space-y-8 pointer-events-none">
      <div className="text-center">
        {text.split('').map((letter, index) => (
          <span 
            key={index} 
            className={`text-3xl sm:text-5xl md:text-8xl font-serif ${textColors[index % textColors.length]}`}
          >
            {letter}
          </span>
        ))}
      </div>
      
      <div className="text-4xl sm:text-5xl md:text-6xl animate-bounce">
        {emoji}
      </div>
    </div>
  );
};
