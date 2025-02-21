
import Confetti from 'react-confetti';

interface ConfettiOverlayProps {
  show: boolean;
  opacity: number;
}

export const ConfettiOverlay = ({ show, opacity }: ConfettiOverlayProps) => {
  if (!show) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%',
      opacity: opacity,
      transition: 'opacity 0.5s ease-out',
      pointerEvents: 'none'
    }}>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={150}
        gravity={0.5}
        initialVelocityY={15}
        colors={['#FF69B4', '#9370DB', '#4B0082', '#FF1493', '#8A2BE2']}
      />
    </div>
  );
};
