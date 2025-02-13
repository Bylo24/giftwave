
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Contact {
  id: string;
  contact_name: string;
  contact_phone: string;
  status: 'pending' | 'registered' | 'not_registered';
}

const Contacts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestContactsPermission = async () => {
    try {
      // Request permission to access contacts
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
            .single();

          const { error } = await supabase
            .from('contacts')
            .insert({
              user_id: user?.id,
              contact_name: contact.name?.[0] || 'Unknown',
              contact_phone: phoneNumber,
              status: existingUser ? 'registered' : 'not_registered'
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

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('contact_name', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
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

  const filteredContacts = contacts.filter(contact =>
    contact.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.contact_phone.includes(searchQuery)
  );

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
                <div>
                  <h3 className="font-medium">{contact.contact_name}</h3>
                  <p className="text-sm text-gray-500">{contact.contact_phone}</p>
                </div>
                {contact.status === 'not_registered' && (
                  <Button
                    onClick={() => handleInvite(contact)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Invite
                  </Button>
                )}
                {contact.status === 'registered' && (
                  <Button
                    onClick={() => navigate(`/gift?recipient=${contact.contact_phone}`)}
                    variant="default"
                    size="sm"
                  >
                    Send Gift
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Contacts;
