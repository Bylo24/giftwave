import { Card } from "@/components/ui/card";
import { Gift, DollarSign, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfileLinks = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="divide-y bg-white shadow-sm border-0">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => navigate("/my-gifts")}
      >
        <div className="flex items-center gap-3">
          <Gift className="w-5 h-5 text-[#666]" />
          <span className="font-medium text-[#2C2E2F]">My Gifts</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => navigate("/wallet")}
      >
        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-[#666]" />
          <span className="font-medium text-[#2C2E2F]">Payment Methods</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Card>
  );
};