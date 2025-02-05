import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Camera } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProfileHeaderProps {
  user: any;
  profile: any;
  profileImage: string | null;
  setProfileImage: (url: string) => void;
}

export const ProfileHeader = ({ user, profile, profileImage, setProfileImage }: ProfileHeaderProps) => {
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/avatar.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', user.id);

        if (updateError) throw updateError;

        setProfileImage(publicUrl);
        toast.success('Profile picture updated!');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to update profile picture');
      }
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative">
        <Avatar className="w-20 h-20 border-2 border-[#E5E5E5]">
          <AvatarImage src={profileImage || ""} />
          <AvatarFallback className="bg-[#F5F5F5] text-[#666]">
            {user?.email?.[0]?.toUpperCase() || <User className="w-8 h-8" />}
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
        <h2 className="font-medium text-[#2C2E2F]">{profile?.full_name || user?.email}</h2>
        <p className="text-sm text-gray-500">Update your photo and personal details</p>
      </div>
    </div>
  );
};