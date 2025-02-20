
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
    <>
      <button
        onClick={onPrevious}
        disabled={isFlipping}
        className="absolute -left-16 top-1/2 -translate-y-1/2 z-10 p-3 backdrop-blur-lg bg-white/50 rounded-xl border border-white/20 shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
        aria-label="Previous page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={onNext}
        disabled={isFlipping}
        className="absolute -right-16 top-1/2 -translate-y-1/2 z-10 p-3 backdrop-blur-lg bg-white/50 rounded-xl border border-white/20 shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
        aria-label="Next page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </>
  );
};
