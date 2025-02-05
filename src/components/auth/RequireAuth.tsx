import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { LoginForm } from "./LoginForm";

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4">
          <LoginForm />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};