
interface LoginHeaderProps {
  isSignUp: boolean;
}

export const LoginHeader = ({ isSignUp }: LoginHeaderProps) => {
  return (
    <div className="flex flex-col items-center space-y-6 mb-8">
      <img 
        src="/lovable-uploads/c34b64be-de23-45c2-9684-b5755b69dd4c.png"
        alt="GiftWave Logo"
        className="h-14 w-auto"
      />
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome to GiftWave
        </h1>
        <p className="text-sm text-gray-500">
          {isSignUp ? "Create an account" : "Sign in to your account"}
        </p>
      </div>
    </div>
  );
};
