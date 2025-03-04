
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
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          gift_preferences: updatedPreferences
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Show success toast
      toast.success("Preferences updated");
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
    <Card className="divide-y divide-border">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
            <Gift className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Gifting Automation</p>
            <p className="text-sm text-muted-foreground">Manage automatic features</p>
          </div>
        </div>
        <Switch 
          checked={preferences.autoSaveDrafts}
          onCheckedChange={(checked) => handleToggleChange('autoSaveDrafts', checked)}
          disabled={isUpdating}
        />
      </div>

      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-full">
            <Bell className="h-5 w-5 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Gift Reminders</p>
            <p className="text-sm text-muted-foreground">Important date notifications</p>
          </div>
        </div>
        <Switch 
          checked={preferences.notifyOnReminders}
          onCheckedChange={(checked) => handleToggleChange('notifyOnReminders', checked)}
          disabled={isUpdating}
        />
      </div>

      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Heart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Show Received Gifts</p>
            <p className="text-sm text-muted-foreground">Display gifts in your profile</p>
          </div>
        </div>
        <Switch 
          checked={preferences.showReceivedGifts}
          onCheckedChange={(checked) => handleToggleChange('showReceivedGifts', checked)}
          disabled={isUpdating}
        />
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <Tag className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">Favorite Themes</p>
                <p className="text-sm text-muted-foreground">Select preferred gift themes</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Your Favorite Themes</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {themeOptions.map((theme) => (
              <Button
                key={theme}
                variant="outline"
                className={`justify-start ${
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
                  supabase
                    .from('profiles')
                    .update({ gift_preferences: updatedPreferences })
                    .eq('id', userId)
                    .then(({ error }) => {
                      if (error) {
                        toast.error("Failed to update themes");
                        console.error(error);
                      }
                    });
                }}
              >
                <Heart 
                  className={`mr-2 h-4 w-4 ${
                    preferences.favoriteThemes.includes(theme)
                      ? "text-primary fill-primary"
                      : "text-muted-foreground"
                  }`}
                />
                {theme}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
            <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Default Messages</p>
            <p className="text-sm text-muted-foreground">Manage message templates</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Card>
  );
};
