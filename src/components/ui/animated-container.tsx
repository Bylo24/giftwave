
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

type AnimationType = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'pop';

interface AnimatedContainerProps {
  children: React.ReactNode;
  animation: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

export const AnimatedContainer = ({
  children,
  animation,
  delay = 0,
  duration = 500,
  className,
  once = true,
  threshold = 0.1
}: AnimatedContainerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const animationClasses = {
      'fade': 'opacity-0',
      'slide-up': 'opacity-0 translate-y-8',
      'slide-down': 'opacity-0 -translate-y-8',
      'slide-left': 'opacity-0 translate-x-8',
      'slide-right': 'opacity-0 -translate-x-8',
      'scale': 'opacity-0 scale-95',
      'pop': 'opacity-0 scale-95'
    };

    // Create the observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
              if (once) {
                setHasAnimated(true);
              }
            }, delay);
            
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once && hasAnimated) {
            setIsVisible(false);
          }
        });
      },
      { threshold }
    );

    // Get the ref
    const ref = document.getElementById('animated-container');
    if (ref) {
      observer.observe(ref);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [delay, once, hasAnimated, threshold]);

  const getAnimationStyles = () => {
    switch (animation) {
      case 'fade':
        return isVisible ? 'opacity-100' : 'opacity-0';
      case 'slide-up':
        return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';
      case 'slide-down':
        return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8';
      case 'slide-left':
        return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8';
      case 'slide-right':
        return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8';
      case 'scale':
        return isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95';
      case 'pop':
        return isVisible 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-95';
      default:
        return '';
    }
  };

  const baseStyles = `
    transition-all ease-out overflow-hidden
  `;

  const durationStyle = `duration-${duration}`;

  return (
    <div
      id="animated-container"
      className={cn(
        baseStyles,
        durationStyle,
        getAnimationStyles(),
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        ...(animation === 'pop' && isVisible ? { animationName: 'pop', animationDuration: '300ms' } : {})
      }}
    >
      {children}
    </div>
  );
};
