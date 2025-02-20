
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
}

export const PageContainer = ({ children, className = "", bgColor }: PageContainerProps) => {
  return (
    <div 
      className={`min-h-screen ${className}`}
      style={{ 
        background: bgColor || 'linear-gradient(to bottom right, #FDE1D3, #FEC6A1, #FFDEE2)'
      }}
    >
      {children}
    </div>
  );
};
