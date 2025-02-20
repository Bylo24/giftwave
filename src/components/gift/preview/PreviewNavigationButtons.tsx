
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PreviewNavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isFlipping: boolean;
}

export const PreviewNavigationButtons = ({
  onPrevious,
  onNext,
  isFlipping
}: PreviewNavigationButtonsProps) => {
  return (
    <div className="flex justify-between mb-4 px-6 absolute -bottom-20 left-0 right-0 w-full">
      <button
        onClick={onPrevious}
        disabled={isFlipping}
        className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>

      <button
        onClick={onNext}
        disabled={isFlipping}
        className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );
};
