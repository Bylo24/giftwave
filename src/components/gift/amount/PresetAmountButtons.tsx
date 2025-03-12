
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PresetAmountButtonsProps {
  selectedAmount: string;
  onAmountSelect: (amount: string) => void;
  presetAmounts: number[];
}

export const PresetAmountButtons = ({
  selectedAmount,
  onAmountSelect,
  presetAmounts
}: PresetAmountButtonsProps) => {
  return (
    <div className="mt-6 grid grid-cols-3 gap-3">
      {presetAmounts.map((preset) => (
        <Button
          key={preset}
          variant="outline"
          onClick={() => onAmountSelect(preset.toString())}
          className={cn(
            "h-12 border-2 font-medium transition-all hover-lift",
            selectedAmount === preset.toString()
              ? "bg-blue-50 border-blue-500 text-blue-600"
              : "glass-effect hover:border-blue-200 hover:bg-blue-50/50"
          )}
        >
          ${preset}
        </Button>
      ))}
    </div>
  );
};
