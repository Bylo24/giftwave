import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Mail, Phone, User, Gift, Calendar, DollarSign, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/ui/bottom-nav";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] pb-16">
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-[#2C2E2F]">Profile Settings</h1>
        </div>
        
        <Card className="p-6 bg-white shadow-sm border-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-[#E5E5E5]">
                <AvatarImage src={profileImage || ""} />
                <AvatarFallback className="bg-[#F5F5F5] text-[#666]">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="profile-upload" 
                className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
              >
                <Camera className="w-4 h-4 text-[#666]" />
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div>
              <h2 className="font-medium text-[#2C2E2F]">John Doe</h2>
              <p className="text-sm text-gray-500">Update your photo and personal details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#666]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  value="john.doe@example.com"
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
                  value="+1 234 567 8900"
                  readOnly
                  className="pl-10 bg-[#F9F9F9] border-gray-200"
                />
              </div>
            </div>
          </div>
        </Card>

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

        <Button 
          variant="outline"
          className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          onClick={() => navigate("/")}
        >
          Sign Out
        </Button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;