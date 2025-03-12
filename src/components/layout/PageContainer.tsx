
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 font-sans w-full max-w-screen-xl mx-auto relative ${className}`}>
      {children}
    </div>
  );
};
