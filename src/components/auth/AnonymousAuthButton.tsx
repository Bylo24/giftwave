import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AnonymousAuthButtonProps {
  isLoading: boolean;
}

export const AnonymousAuthButton = ({ isLoading }: AnonymousAuthButtonProps) => {
  const navigate = useNavigate();

  const handleAnonymousAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) throw error;
      
      toast.success("Successfully logged in as guest!");
      navigate("/home");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleAnonymousAuth}
      disabled={isLoading}
      className="w-full"
    >
      Continue as guest
    </Button>
  );
};