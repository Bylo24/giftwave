
interface LoginContainerProps {
  children: React.ReactNode;
}

export const LoginContainer = ({ children }: LoginContainerProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-auto p-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};
