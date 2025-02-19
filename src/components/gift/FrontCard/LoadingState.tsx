
import { Button } from "@/components/ui/button";

interface LoadingStateProps {
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

export const LoadingState = ({ isLoading, error, onRetry }: LoadingStateProps) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500">Failed to load gift draft</p>
          <Button 
            onClick={onRetry}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
