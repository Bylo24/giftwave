
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "circle" | "text" | "card" | "button";
  animation?: "pulse" | "shimmer" | "none";
}

export const Skeleton = ({
  className,
  variant = "default",
  animation = "pulse"
}: SkeletonProps) => {
  const variantClasses = {
    default: "w-full h-4 rounded",
    circle: "rounded-full",
    text: "h-4 rounded w-3/4",
    card: "rounded-xl h-32",
    button: "rounded-full h-10"
  };

  const animationClasses = {
    pulse: "animate-pulse",
    shimmer: "shimmer",
    none: ""
  };

  return (
    <div
      className={cn(
        "bg-gray-200 dark:bg-gray-700",
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
    />
  );
};

export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("space-y-3", className)}>
    <Skeleton variant="card" />
    <div className="space-y-2">
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  </div>
);

export const SkeletonAvatar = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  return <Skeleton variant="circle" className={sizeClasses[size]} />;
};

export const SkeletonButton = () => (
  <Skeleton variant="button" className="w-full" />
);

export const SkeletonList = ({ items = 3 }: { items?: number }) => (
  <div className="space-y-3">
    {Array(items).fill(0).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <SkeletonAvatar size="sm" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-1/3" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
    ))}
  </div>
);
