import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/utils/updateProfile";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UpdatePhone = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const setPhoneNumber = async () => {
      if (user) {
        try {
          await updateUserProfile(user.id, "+64273569422");
          navigate("/profile");
        } catch (error) {
          console.error("Error updating phone number:", error);
        }
      }
    };

    setPhoneNumber();
  }, [user, navigate]);

  return null;
};