
import { Button } from "@/components/ui/button";
import { Gift, Video, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GiftPreviewNavigationProps {
  giftId: string;
  token: string;
  incompleteSteps: {
    frontCard: boolean;
    message: boolean;
    memories: boolean;
    amount: boolean;
  };
}

export const GiftPreviewNavigation = ({ token, incompleteSteps }: GiftPreviewNavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center gap-4 mb-6">
      <Button
        variant={incompleteSteps.frontCard ? "destructive" : "outline"}
        onClick={() => navigate(`/frontcard?token=${token}`)}
        className="flex items-center gap-2"
      >
        <Gift className="h-4 w-4" />
        Front Card
        {incompleteSteps.frontCard && " (Required)"}
      </Button>
      <Button
        variant={incompleteSteps.message ? "destructive" : "outline"}
        onClick={() => navigate(`/insideleftcard?token=${token}`)}
        className="flex items-center gap-2"
      >
        <Video className="h-4 w-4" />
        Message
        {incompleteSteps.message && " (Required)"}
      </Button>
      <Button
        variant={incompleteSteps.memories ? "destructive" : "outline"}
        onClick={() => navigate(`/insiderightcard?token=${token}`)}
        className="flex items-center gap-2"
      >
        <Image className="h-4 w-4" />
        Memories
        {incompleteSteps.memories && " (Required)"}
      </Button>
    </div>
  );
};
