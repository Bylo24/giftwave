
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#FDE1D3] via-[#FEC6A1] to-[#FFDEE2] pb-24 ${className}`}>
      {children}
    </div>
  );
};
