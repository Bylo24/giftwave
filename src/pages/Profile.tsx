import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Mail, Phone, User, Users } from "lucide-react";
import { BottomNav } from "@/components/ui/bottom-nav";
import { toast } from "sonner";

const Profile = () => {
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
    <div className="min-h-screen bg-[#E5DEFF] pb-16">
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1A1F2C] text-center">My Profile</h1>
        
        <div className="relative w-32 h-32 mx-auto">
          <Avatar className="w-full h-full border-4 border-[#9b87f5]">
            <AvatarImage src={profileImage || ""} />
            <AvatarFallback className="bg-[#D6BCFA] text-[#6E59A5] text-2xl">
              <User className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>
          <label 
            htmlFor="profile-upload" 
            className="absolute bottom-0 right-0 p-2 bg-[#9b87f5] rounded-full cursor-pointer hover:bg-[#8B5CF6] transition-colors"
          >
            <Camera className="w-5 h-5 text-white" />
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        <Card className="p-6 space-y-4 border-[#9b87f5]">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6E59A5]">Full Name</label>
              <Input 
                value="John Doe"
                readOnly
                className="bg-[#E5DEFF] border-[#9b87f5]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6E59A5]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E69AB]" />
                <Input 
                  value="john.doe@example.com"
                  readOnly
                  className="pl-10 bg-[#E5DEFF] border-[#9b87f5]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6E59A5]">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E69AB]" />
                <Input 
                  value="+1 234 567 8900"
                  readOnly
                  className="pl-10 bg-[#E5DEFF] border-[#9b87f5]"
                />
              </div>
            </div>
          </div>

          <Button 
            className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
            onClick={() => console.log("Edit profile")}
          >
            Edit Profile
          </Button>

          <Button 
            className="w-full bg-gradient-to-r from-[#D946EF] to-[#9b87f5] hover:opacity-90 text-white"
            onClick={() => console.log("View friends")}
          >
            <Users className="w-5 h-5 mr-2" />
            My Friends
          </Button>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;