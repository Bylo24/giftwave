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
import { Bell, Shield, Moon, Globe, Gift } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

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
      <div className="min-h-screen bg-gray-50/50 pb-16">
        <div className="p-4 space-y-4 max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg"></div>
            <div className="h-32 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 backdrop-blur-lg bg-white/80 -mx-4 px-4 py-4 border-b border-gray-200/20">
          <h1 className="text-xl font-semibold text-[#2C2E2F]">Profile Settings</h1>
        </div>
        
        <Card className="p-6 bg-white/80 backdrop-blur-lg border border-gray-200/20 shadow-lg">
          <ProfileHeader 
            user={user}
            profile={profile}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
          <ProfileInfo user={user} profile={profile} />
        </Card>

        <Card className="divide-y divide-gray-200/20 bg-white/80 backdrop-blur-lg border border-gray-200/20 shadow-lg overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-full">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-500">Get notified about new gifts</p>
              </div>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications} 
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-full">
                <Moon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-500">Toggle dark theme</p>
              </div>
            </div>
            <Switch 
              checked={darkMode} 
              onCheckedChange={setDarkMode}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-full">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Language</p>
                <p className="text-sm text-gray-500">English (US)</p>
              </div>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-full">
                <Gift className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Gift Preferences</p>
                <p className="text-sm text-gray-500">Customize your gifting experience</p>
              </div>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-full">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Privacy & Security</p>
                <p className="text-sm text-gray-500">Manage your account security</p>
              </div>
            </div>
          </div>
        </Card>

        <ProfileLinks />

        <div className="space-y-4">
          <Button 
            variant="outline"
            className="w-full bg-white/80 backdrop-blur-lg border-gray-200/20 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-lg"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>

          <p className="text-center text-sm text-gray-500">
            Version 1.0.0
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
