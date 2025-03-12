
import { cn } from "@/lib/utils";

interface ContentCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "primary" | "secondary" | "success" | "error" | "glass";
  interactive?: boolean;
  onClick?: () => void;
}

export const ContentCard = ({ 
  children, 
  className = "", 
  variant = "default",
  interactive = false,
  onClick
}: ContentCardProps) => {
  const variantClasses = {
    default: "bg-white/70 border-white/20",
    elevated: "bg-white/80 border-white/30 shadow-2xl hover:shadow-xl",
    primary: "bg-gradient-to-br from-blue-50/90 to-purple-50/90 border-blue-200/30",
    secondary: "bg-gradient-to-br from-amber-50/90 to-orange-50/90 border-amber-200/30",
    success: "bg-gradient-to-br from-green-50/90 to-emerald-50/90 border-green-200/30",
    error: "bg-gradient-to-br from-red-50/90 to-pink-50/90 border-red-200/30",
    glass: "bg-white/30 backdrop-blur-xl border-white/40 shadow-xl"
  };

  return (
    <div 
      className={cn(
        "p-6 backdrop-blur-lg border shadow-xl rounded-3xl transition-all duration-300 ease-in-out card-shine",
        variantClasses[variant],
        interactive && "hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
        className
      )}
      onClick={interactive ? onClick : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
};
