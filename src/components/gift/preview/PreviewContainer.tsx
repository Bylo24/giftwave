
interface PreviewContainerProps {
  currentPage: number;
  children: React.ReactNode;
  onClick: () => void;
}

export const PreviewContainer = ({ currentPage, children, onClick }: PreviewContainerProps) => {
  return (
    <div 
      onClick={onClick}
      className="cursor-pointer mx-6"
      style={{ perspective: "1000px" }}
    >
      <div 
        className="w-full aspect-[3/4] relative transition-transform duration-500"
        style={{ 
          transform: `rotateY(${currentPage * -90}deg)`,
          transformStyle: "preserve-3d"
        }}
      >
        {children}
      </div>
    </div>
  );
};
