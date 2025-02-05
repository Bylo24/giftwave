import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CodeVerification = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/setup");
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
      </button>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Enter the code</h1>
        <p className="text-sm text-gray-500">
          We sent it to:
          <br />
          +1 123 456 789
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            type="text"
            maxLength={4}
            placeholder="Enter 4-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full text-center text-2xl tracking-widest"
          />
          <button className="text-primary text-sm">Resend code</button>
        </div>
      </form>
    </div>
  );
};