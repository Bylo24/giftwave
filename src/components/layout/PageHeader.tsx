
interface PageHeaderProps {
  title: string;
  gradient?: boolean;
}

export const PageHeader = ({ title, gradient = true }: PageHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 backdrop-blur-lg bg-white/80 -mx-4 px-4 py-4 border-b border-white/20">
      <h1 className={`text-xl font-semibold ${
        gradient ? "bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent" : "text-foreground"
      }`}>
        {title}
      </h1>
    </div>
  );
};
