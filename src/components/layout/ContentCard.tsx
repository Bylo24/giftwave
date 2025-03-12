
interface ContentCardProps {
  children: React.ReactNode;
  className?: string;
}

export const ContentCard = ({ children, className = "" }: ContentCardProps) => {
  return (
    <div className={`p-6 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl bg-white/70 card-shine font-sans ${className}`}>
      {children}
    </div>
  );
};
