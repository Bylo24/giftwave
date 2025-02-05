import { Input } from "@/components/ui/input";
import { Mail, Phone } from "lucide-react";

interface ProfileInfoProps {
  user: any;
  profile: any;
}

export const ProfileInfo = ({ user, profile }: ProfileInfoProps) => {
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
          <Input 
            value={profile?.phone || "Not set"}
            readOnly
            className="pl-10 bg-[#F9F9F9] border-gray-200"
          />
        </div>
      </div>
    </div>
  );
};