
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}

export const PageContainer = ({ 
  children, 
  className = "",
  padded = true
}: PageContainerProps) => {
  return (
    <div 
      className={cn(
        "min-h-screen overflow-x-hidden transition-colors duration-300 font-sans w-full max-w-screen-xl mx-auto relative",
        padded && "px-4 md:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
};
