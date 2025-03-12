
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 font-sans ${className}`}>
      {children}
    </div>
  );
};
