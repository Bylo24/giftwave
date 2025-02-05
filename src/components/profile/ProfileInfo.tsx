import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileInfoProps {
  user: any;
  profile: any;
}

export const ProfileInfo = ({ user, profile }: ProfileInfoProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-[#666]">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            value={user?.email || ""}
            readOnly
            className="pl-10 bg-[#F9F9F9] border-gray-200"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[#666]">Phone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <div className="flex gap-2">
            <Input 
              value={profile?.phone_number || "Not set"}
              readOnly
              className="pl-10 bg-[#F9F9F9] border-gray-200 flex-1"
            />
            <Button 
              variant="outline"
              onClick={() => navigate("/verify")}
              className="whitespace-nowrap"
            >
              {profile?.phone_number ? "Change" : "Add"} Phone
            </Button>
          </div>
        </div>
        {profile?.phone_verified && (
          <p className="text-xs text-green-600 mt-1">✓ Verified</p>
        )}
        {profile?.phone_number && !profile?.phone_verified && (
          <p className="text-xs text-yellow-600 mt-1">Not verified</p>
        )}
      </div>
    </div>
  );
};