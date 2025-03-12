
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Gift, 
  Heart, 
  Calendar, 
  Bell, 
  Tag, 
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { updateGiftPreferences } from "@/utils/updateProfile";

interface GiftPreferencesProps {
  userId: string;
  profile: any;
}

export const GiftPreferences = ({ userId, profile }: GiftPreferencesProps) => {
  const defaultPreferences = {
    autoSaveDrafts: true,
    notifyOnReminders: true,
    showReceivedGifts: true,
    favoriteThemes: [],
  };

  const [preferences, setPreferences] = useState({
    ...defaultPreferences,
    ...(profile?.gift_preferences || {})
  });
  
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleChange = async (key: string, value: boolean) => {
    try {
      setIsUpdating(true);
      
      // Update local state
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));
      
      // Update preferences in the database
      const updatedPreferences = {
        ...preferences,
        [key]: value
      };
      
      await updateGiftPreferences(userId, updatedPreferences);
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update preferences");
      // Revert local state on error
      setPreferences(prev => ({
        ...prev,
        [key]: !value
      }));
    } finally {
      setIsUpdating(false);
    }
  };

  const themeOptions = [
    "Birthday", "Anniversary", "Congratulations", 
    "Thank You", "Holiday", "Graduation", "Wedding"
  ];

  return (
    <Card className="divide-y divide-border glass-card overflow-hidden">
      <div className="p-4 flex items-center justify-between hover-lift hover:bg-purple-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full transition-colors">
            <Gift className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="font-medium text-foreground font-montserrat">Gifting Automation</p>
            <p className="text-sm text-muted-foreground">Manage automatic features</p>
          </div>
        </div>
        <Switch 
          checked={preferences.autoSaveDrafts}
          onCheckedChange={(checked) => handleToggleChange('autoSaveDrafts', checked)}
          disabled={isUpdating}
          className="data-[state=checked]:bg-purple-600"
        />
      </div>

      <div className="p-4 flex items-center justify-between hover-lift hover:bg-pink-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-full transition-colors">
            <Bell className="h-5 w-5 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <p className="font-medium text-foreground font-montserrat">Gift Reminders</p>
            <p className="text-sm text-muted-foreground">Important date notifications</p>
          </div>
        </div>
        <Switch 
          checked={preferences.notifyOnReminders}
          onCheckedChange={(checked) => handleToggleChange('notifyOnReminders', checked)}
          disabled={isUpdating}
          className="data-[state=checked]:bg-pink-600"
        />
      </div>

      <div className="p-4 flex items-center justify-between hover-lift hover:bg-blue-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full transition-colors">
            <Heart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-foreground font-montserrat">Show Received Gifts</p>
            <p className="text-sm text-muted-foreground">Display gifts in your profile</p>
          </div>
        </div>
        <Switch 
          checked={preferences.showReceivedGifts}
          onCheckedChange={(checked) => handleToggleChange('showReceivedGifts', checked)}
          disabled={isUpdating}
          className="data-[state=checked]:bg-blue-600"
        />
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <div className="p-4 flex items-center justify-between cursor-pointer hover-lift hover:bg-green-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full transition-colors">
                <Tag className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-foreground font-montserrat">Favorite Themes</p>
                <p className="text-sm text-muted-foreground">Select preferred gift themes</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </DialogTrigger>
        <DialogContent className="glass-effect">
          <DialogHeader>
            <DialogTitle className="text-xl font-playfair text-gradient">Choose Your Favorite Themes</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {themeOptions.map((theme) => (
              <Button
                key={theme}
                variant="outline"
                className={`justify-start hover-lift ${
                  preferences.favoriteThemes.includes(theme)
                    ? "bg-primary/10 border-primary"
                    : ""
                }`}
                onClick={() => {
                  const updatedThemes = preferences.favoriteThemes.includes(theme)
                    ? preferences.favoriteThemes.filter((t: string) => t !== theme)
                    : [...preferences.favoriteThemes, theme];
                  
                  const updatedPreferences = { 
                    ...preferences, 
                    favoriteThemes: updatedThemes 
                  };
                  
                  setPreferences(updatedPreferences);
                  
                  // Update in database
                  updateGiftPreferences(userId, updatedPreferences)
                    .catch(error => {
                      toast.error("Failed to update themes");
                      console.error(error);
                    });
                }}
              >
                <Heart 
                  className={`mr-2 h-4 w-4 transition-colors ${
                    preferences.favoriteThemes.includes(theme)
                      ? "text-primary fill-primary"
                      : "text-muted-foreground"
                  }`}
                />
                <span className="font-montserrat">{theme}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div className="p-4 flex items-center justify-between hover-lift hover:bg-orange-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full transition-colors">
            <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="font-medium text-foreground font-montserrat">Default Messages</p>
            <p className="text-sm text-muted-foreground">Manage message templates</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Card>
  );
};
