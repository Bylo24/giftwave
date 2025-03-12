
import { Card } from "@/components/ui/card";
import { Gift, DollarSign, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfileLinks = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="divide-y glass-card shadow-sm border-white/20 overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover-lift hover:bg-blue-50/50"
        onClick={() => navigate("/my-gifts")}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100/70 rounded-full">
            <Gift className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-medium text-[#2C2E2F] font-montserrat">My Gifts</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover-lift hover:bg-green-50/50"
        onClick={() => navigate("/wallet")}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100/70 rounded-full">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <span className="font-medium text-[#2C2E2F] font-montserrat">Payment Methods</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Card>
  );
};
