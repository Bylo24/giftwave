
import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "primary" | "secondary" | "success" | "error";
  interactive?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
}

export const ContentCard = ({ 
  children, 
  className = "", 
  variant = "default",
  interactive = false,
  style,
  onClick
}: ContentCardProps) => {
  const variantClasses = {
    default: "bg-white border-gray-100",
    glass: "bg-white/90 backdrop-blur-lg border-white/20",
    primary: "bg-gradient-to-br from-blue-50 to-blue-100/80 border-blue-200/30",
    secondary: "bg-gradient-to-br from-gray-50 to-gray-100/80 border-gray-200/30",
    success: "bg-gradient-to-br from-green-50 to-green-100/80 border-green-200/30",
    error: "bg-gradient-to-br from-red-50 to-red-100/80 border-red-200/30"
  };

  return (
    <div 
      className={cn(
        "p-5 border rounded-2xl shadow-sm transition-all duration-200",
        variantClasses[variant],
        interactive && "hover:shadow-md active:scale-[0.99] cursor-pointer",
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
