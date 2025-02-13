
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50/80 to-indigo-50/80 pb-24 ${className}`}>
      {children}
    </div>
  );
};
