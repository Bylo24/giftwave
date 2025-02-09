
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileLinks } from "@/components/profile/ProfileLinks";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile');
        } else {
          console.log('Fetched profile:', data); // Debug log
          if (data) {
            setProfile(data);
            if (data.avatar_url) {
              setProfileImage(data.avatar_url);
            }
          } else {
            // If no profile exists, create one
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([{ id: user.id }]);
            
            if (insertError) {
              console.error('Error creating profile:', insertError);
              toast.error('Failed to create profile');
            } else {
              // Fetch the newly created profile
              const { data: newProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();
                
              if (newProfile) {
                setProfile(newProfile);
              }
            }
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] pb-16">
        <div className="p-4 space-y-4 max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-white rounded"></div>
            <div className="h-32 bg-white rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1] pb-16">
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-[#2C2E2F]">Profile Settings</h1>
        </div>
        
        <Card className="p-6 bg-white shadow-sm border-0">
          <ProfileHeader 
            user={user}
            profile={profile}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
          <ProfileInfo user={user} profile={profile} />
        </Card>

        <ProfileLinks />

        <Button 
          variant="outline"
          className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
