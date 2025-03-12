
import { colorPalettes } from "@/constants/colorPalettes";

interface ColorPaletteSelectorProps {
  selectedPaletteIndex: number;
  onPaletteChange: (index: number) => void;
}

export const ColorPaletteSelector = ({
  selectedPaletteIndex,
  onPaletteChange
}: ColorPaletteSelectorProps) => {
  return (
    <div className="mb-8 w-[85vw] max-w-[360px]">
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-gradient mb-3 font-montserrat">
          Color Theme
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {colorPalettes.map((palette, index) => (
            <button
              key={palette.name}
              onClick={() => onPaletteChange(index)}
              className={`group flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${
                selectedPaletteIndex === index 
                  ? 'bg-purple-50 shadow-sm scale-[0.98]' 
                  : 'hover:bg-gray-50/50 hover:scale-[1.02]'
              }`}
            >
              <div 
                className={`w-6 h-6 rounded-lg border-2 transition-shadow duration-300 ${
                  selectedPaletteIndex === index 
                    ? 'border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.35)]' 
                    : 'border-gray-200 group-hover:border-purple-200'
                }`}
                style={{ backgroundColor: palette.screenBg }}
              />
              <span className={`text-xs font-montserrat transition-colors duration-300 ${
                selectedPaletteIndex === index 
                  ? 'text-purple-700' 
                  : 'text-gray-600 group-hover:text-gray-800'
              }`}>
                {palette.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
