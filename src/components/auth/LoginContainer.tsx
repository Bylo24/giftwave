
interface LoginContainerProps {
  children: React.ReactNode;
}

export const LoginContainer = ({ children }: LoginContainerProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center animate-fade-in bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-md">
      <div className="w-full max-w-md mx-auto p-8 space-y-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
          {children}
        </div>
      </div>
    </div>
  );
};
