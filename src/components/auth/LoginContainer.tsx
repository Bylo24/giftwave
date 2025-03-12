
interface LoginContainerProps {
  children: React.ReactNode;
}

export const LoginContainer = ({ children }: LoginContainerProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center animate-fade-in animated-gradient-bg">
      <div className="w-full max-w-md mx-auto p-8 space-y-8">
        <div className="glass-card rounded-3xl p-8 shadow-xl border-white/20 fade-in card-shine">
          {children}
        </div>
      </div>
    </div>
  );
};
