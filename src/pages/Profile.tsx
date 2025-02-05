import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Mail, Phone, User, Gift, Calendar, DollarSign } from "lucide-react";
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

  // Mock data for gifts
  const recentGifts = [
    {
      id: 1,
      type: "Birthday Gift",
      amount: 50,
      date: "2024-02-15",
      from: "Sarah Johnson",
      message: "Happy birthday! Hope you have a wonderful day! 🎉",
    },
    {
      id: 2,
      type: "Anniversary Gift",
      amount: 100,
      date: "2024-02-10",
      from: "Michael Smith",
      message: "Congratulations on your special day! 🎊",
    },
  ];

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

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#1A1F2C] flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#9b87f5]" />
              My Gifts
            </h2>
            
            {recentGifts.map((gift) => (
              <Card key={gift.id} className="p-4 hover:shadow-lg transition-all duration-300 border-[#9b87f5]/20">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-[#1A1F2C]">{gift.type}</h3>
                    <p className="text-sm text-gray-600">From: {gift.from}</p>
                    <p className="text-sm italic text-gray-500">"{gift.message}"</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>{gift.amount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(gift.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <Button 
              className="w-full bg-gradient-to-r from-[#9b87f5] to-purple-500 hover:opacity-90 text-white"
              onClick={() => navigate("/my-gifts")}
            >
              View All Gifts
            </Button>
          </div>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;