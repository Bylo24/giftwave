import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/verify");
  };

  return (
    <div className="min-h-screen flex items-end justify-center pb-16 animate-fade-in">
      <div className="w-full max-w-md mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">SwiftPay</h1>
          <p className="text-sm text-gray-500">Your Wallet's Best Friend</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate("/signup")}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Create account
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="w-full"
          >
            Log in
          </Button>
        </div>
      </div>
    </div>
  );
};