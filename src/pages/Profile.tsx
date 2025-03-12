
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileLinks } from "@/components/profile/ProfileLinks";
import { GiftPreferences } from "@/components/profile/GiftPreferences";
import { Shield, Globe, Gift, ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState("English (US)");
  const [activeTab, setActiveTab] = useState("general"); // Add state for active tab

  const languages = [
    "English (US)",
    "Español",
    "Français",
    "Deutsch",
    "Italiano",
    "日本語",
    "한국어",
    "中文",
  ];

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    toast.success(`Language changed to ${newLanguage}`);
  };

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
      <div className="min-h-screen bg-background pb-16">
        <div className="p-4 space-y-4 max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-card backdrop-blur-lg rounded-2xl shadow-lg"></div>
            <div className="h-32 bg-card backdrop-blur-lg rounded-2xl shadow-lg"></div>
            <div className="h-12 bg-muted rounded"></div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient-bg transition-colors duration-200 pb-24">
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 glass-effect -mx-4 px-4 py-4 border-b border-white/20">
          <h1 className="text-xl font-semibold text-foreground font-playfair">Profile Settings</h1>
        </div>
        
        <Card className="p-6 glass-card border-white/20 shadow-xl rounded-3xl">
          <ProfileHeader 
            user={user}
            profile={profile}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
          <ProfileInfo user={user} profile={profile} />
        </Card>

        {/* Tab Navigation */}
        <div className="flex space-x-2 p-2 glass-effect rounded-full mb-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors font-montserrat ${
              activeTab === "general"
                ? "bg-white/80 shadow text-blue-700"
                : "text-gray-600 hover:bg-white/30"
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors font-montserrat ${
              activeTab === "preferences"
                ? "bg-white/80 shadow text-blue-700"
                : "text-gray-600 hover:bg-white/30"
            }`}
          >
            Gift Preferences
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors font-montserrat ${
              activeTab === "security"
                ? "bg-white/80 shadow text-blue-700"
                : "text-gray-600 hover:bg-white/30"
            }`}
          >
            Security
          </button>
        </div>

        {/* General Tab */}
        {activeTab === "general" && (
          <>
            <Card className="divide-y divide-border glass-card overflow-hidden">
              <div className="p-4 flex items-center justify-between hover-lift hover:bg-blue-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground font-montserrat">Language</p>
                    <p className="text-sm text-muted-foreground">Select your preferred language</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="glass-effect hover:bg-white/50 font-montserrat"
                    >
                      {language}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px] glass-effect">
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className="cursor-pointer font-montserrat hover:bg-blue-50/50"
                      >
                        {lang}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="p-4 flex items-center justify-between hover-lift hover:bg-red-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                    <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground font-montserrat">Privacy & Security</p>
                    <p className="text-sm text-muted-foreground">Manage your account security</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>

            <ProfileLinks />
          </>
        )}

        {/* Gift Preferences Tab */}
        {activeTab === "preferences" && user && (
          <GiftPreferences userId={user.id} profile={profile} />
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <Card className="divide-y divide-border glass-card overflow-hidden">
            <div className="p-4 flex items-center justify-between hover-lift hover:bg-red-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground font-montserrat">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Enhance your account security</p>
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-red-600" />
            </div>
          </Card>
        )}

        <div className="space-y-4">
          <Button 
            variant="outline"
            className="w-full glass-effect hover:bg-white/50 text-foreground font-montserrat shadow-lg"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>

          <p className="text-center text-sm text-muted-foreground font-montserrat">
            Version 1.0.0
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
