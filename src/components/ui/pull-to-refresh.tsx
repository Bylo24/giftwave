
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const PullToRefresh = () => {
  const [startY, setStartY] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const location = useLocation();

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        setStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY > 0) {
        const pullDistance = e.touches[0].clientY - startY;
        if (pullDistance > 0 && pullDistance < 200) {
          setPulling(true);
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pulling && !loading) {
        setLoading(true);
        // Invalidate all queries to refresh data
        await queryClient.invalidateQueries();
        setTimeout(() => {
          setLoading(false);
          setPulling(false);
          setStartY(0);
        }, 1000);
      } else {
        setPulling(false);
        setStartY(0);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startY, pulling, loading, queryClient]);

  if (!pulling && !loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300"
         style={{ height: pulling ? '100px' : '60px' }}>
      <div className={`transition-transform duration-300 ${loading ? 'animate-spin' : ''}`}>
        <ArrowDown className="h-6 w-6 text-primary" />
      </div>
    </div>
  );
};
