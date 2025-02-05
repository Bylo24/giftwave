import { PartyPopper } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { giftThemes, ThemeType } from "@/utils/giftThemes";

interface ThemeStepProps {
  selectedTheme: ThemeType;
  setSelectedTheme: (theme: ThemeType) => void;
  onNext: () => void;
}

export const ThemeStep = ({ selectedTheme, setSelectedTheme, onNext }: ThemeStepProps) => {
  return (
    <Card className="p-6 space-y-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-purple-500/10 rounded-full animate-bounce">
          <PartyPopper className="h-6 w-6 text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Choose a Theme
        </h2>
      </div>
      
      <p className="text-gray-600">Select a theme that matches the occasion!</p>
      
      <div className="grid grid-cols-2 gap-4">
        {Object.values(giftThemes).map((theme) => (
          <Card
            key={theme.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedTheme === theme.id
                ? 'ring-2 ring-purple-500 shadow-lg scale-105'
                : 'hover:shadow-md hover:scale-105'
            }`}
            onClick={() => setSelectedTheme(theme.id)}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-3xl">{theme.icon}</span>
              <h3 className="font-medium">{theme.name}</h3>
            </div>
          </Card>
        ))}
      </div>

      <Button 
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
        onClick={onNext}
      >
        Continue with Theme
      </Button>
    </Card>
  );
};