import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const PromoCode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      toast.success("Promo code applied successfully!");
      navigate("/");
    } else {
      toast.error("Please enter a valid promo code");
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="space-y-4">
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">
            Enter Promo Code
          </h1>
          <p className="text-sm text-gray-500">
            Enter your code below to redeem your offer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter promo code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="uppercase"
          />
          <Button className="w-full" type="submit">
            Apply Code
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PromoCode;