
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Users, Star, Gift, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "@/components/ui/avatar";

interface Contact {
  id: string;
  contact_name: string;
  contact_phone: string;
  status: 'pending' | 'registered' | 'not_registered';
  is_favorite: boolean;
  last_gift_sent: string | null;
}

type SortOption = 'favorites' | 'recent' | 'giftwave' | 'all';

const Contacts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('all');

  const requestContactsPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'contacts' as PermissionName });
      
      if (permission.state === 'granted') {
        setPermissionGranted(true);
        fetchContacts();
      } else if (permission.state === 'prompt') {
        // @ts-ignore - Contacts API is still experimental
        const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: true });
        if (contacts.length > 0) {
          setPermissionGranted(true);
          handleImportedContacts(contacts);
        }
      } else {
        toast.error("Permission to access contacts was denied");
      }
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
      toast.error("Unable to access contacts. Please add contacts manually.");
    }
  };

  const handleImportedContacts = async (importedContacts: any[]) => {
    try {
      for (const contact of importedContacts) {
        const phoneNumber = contact.tel?.[0]?.replace(/\D/g, '');
        if (phoneNumber) {
          const { data: existingUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('phone_number', phoneNumber)
            .maybeSingle();

          const { error } = await supabase
            .from('contacts')
            .insert({
              user_id: user?.id,
              contact_name: contact.name?.[0] || 'Unknown',
              contact_phone: phoneNumber,
              status: existingUser ? 'registered' : 'not_registered',
              is_favorite: false
            });

          if (error) throw error;
        }
      }
      fetchContacts();
      toast.success("Contacts imported successfully!");
    } catch (error) {
      console.error('Error importing contacts:', error);
      toast.error("Error importing contacts");
    }
  };

  const toggleFavorite = async (contactId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ is_favorite: !currentValue })
        .eq('id', contactId);

      if (error) throw error;
      
      setContacts(contacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, is_favorite: !currentValue }
          : contact
      ));

      toast.success(currentValue ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error("Could not update favorite status");
    }
  };

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('is_favorite', { ascending: false })
        .order('contact_name', { ascending: true });

      if (error) throw error;
      
      const typedContacts: Contact[] = data?.map(contact => ({
        id: contact.id,
        contact_name: contact.contact_name,
        contact_phone: contact.contact_phone,
        status: contact.status as 'pending' | 'registered' | 'not_registered',
        is_favorite: contact.is_favorite,
        last_gift_sent: contact.last_gift_sent
      })) || [];
      
      setContacts(typedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error("Error loading contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const getFilteredContacts = () => {
    let filtered = contacts.filter(contact =>
      contact.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.contact_phone.includes(searchQuery)
    );

    switch (sortBy) {
      case 'favorites':
        return filtered.filter(c => c.is_favorite);
      case 'recent':
        return filtered.filter(c => c.last_gift_sent).sort((a, b) => 
          new Date(b.last_gift_sent || 0).getTime() - new Date(a.last_gift_sent || 0).getTime()
        );
      case 'giftwave':
        return filtered.filter(c => c.status === 'registered');
      default:
        return filtered;
    }
  };

  const handleInvite = async (contact: Contact) => {
    // Here you would implement your invite logic
    toast.success(`Invitation sent to ${contact.contact_name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded-full w-full"></div>
          <div className="h-20 bg-gray-200 rounded-lg w-full"></div>
          <div className="h-20 bg-gray-200 rounded-lg w-full"></div>
        </div>
      </div>
    );
  }

  const filteredContacts = getFilteredContacts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Contacts</h1>
          <Button
            onClick={requestContactsPermission}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Import
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
            />
            <Input 
              className="pl-10 bg-gray-100 border-0 rounded-full"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            <Button
              variant={sortBy === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('all')}
            >
              All
            </Button>
            <Button
              variant={sortBy === 'favorites' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('favorites')}
            >
              Favorites
            </Button>
            <Button
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
            >
              Recent
            </Button>
            <Button
              variant={sortBy === 'giftwave' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('giftwave')}
            >
              GiftWave Users
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {filteredContacts.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No contacts found</p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <Card key={contact.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <div className="bg-blue-100 h-full w-full flex items-center justify-center text-blue-600 font-medium">
                      {contact.contact_name.charAt(0).toUpperCase()}
                    </div>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{contact.contact_name}</h3>
                      {contact.status === 'registered' && (
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                          GiftWave
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{contact.contact_phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(contact.id, contact.is_favorite)}
                    className={`p-2 rounded-full transition-colors ${
                      contact.is_favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <Star className="h-5 w-5" fill={contact.is_favorite ? "currentColor" : "none"} />
                  </button>
                  {contact.status === 'not_registered' ? (
                    <Button
                      onClick={() => handleInvite(contact)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Invite
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate(`/gift?recipient=${contact.contact_phone}`)}
                      variant="default"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Gift className="h-4 w-4" />
                      Send Gift
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Contacts;
