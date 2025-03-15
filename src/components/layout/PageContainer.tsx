
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  withPadding?: boolean;
}

export const PageContainer = ({ 
  children, 
  className = "",
  withPadding = true
}: PageContainerProps) => {
  return (
    <div className={cn(
      "min-h-screen w-full max-w-screen-xl mx-auto relative bg-gray-50",
      withPadding && "px-4 py-6 md:px-6",
      className
    )}>
      {children}
    </div>
  );
};
