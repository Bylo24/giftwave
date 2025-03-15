
import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-in" | "slide-up" | "scale" | "none";
  delay?: number;
  style?: CSSProperties;
}

export const AnimatedContainer = ({
  children,
  className = "",
  animation = "fade-in",
  delay = 0,
  style = {}
}: AnimatedContainerProps) => {
  const animationClasses = {
    "fade-in": "animate-fade-in",
    "slide-up": "animate-slide-in",
    "scale": "animate-scale-in",
    "none": ""
  };

  return (
    <div
      className={cn(
        animationClasses[animation],
        className
      )}
      style={{
        ...style,
        animationDelay: delay > 0 ? `${delay}ms` : undefined
      }}
    >
      {children}
    </div>
  );
};
