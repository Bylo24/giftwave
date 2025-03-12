
interface ContentCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "primary" | "secondary";
}

export const ContentCard = ({ 
  children, 
  className = "", 
  variant = "default" 
}: ContentCardProps) => {
  const variantClasses = {
    default: "bg-white/70 border-white/20",
    elevated: "bg-white/80 border-white/30 shadow-2xl hover:shadow-xl",
    primary: "bg-gradient-to-br from-blue-50/90 to-purple-50/90 border-blue-200/30",
    secondary: "bg-gradient-to-br from-amber-50/90 to-orange-50/90 border-amber-200/30"
  };

  return (
    <div 
      className={`
        p-6 backdrop-blur-lg border shadow-xl rounded-3xl 
        transition-all duration-300 ease-in-out
        hover:bg-white/80 card-shine font-sans
        ${variantClasses[variant]} ${className}
      `}
    >
      {children}
    </div>
  );
};
