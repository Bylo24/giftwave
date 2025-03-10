
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentMethod {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export const SavedCards = () => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { session, user } = useAuth();

  const { data: cards, isLoading, error } = useQuery({
    queryKey: ['payment-methods', user?.id],
    queryFn: async () => {
      if (!session?.access_token) {
        throw new Error('No auth session');
      }
      const { data, error } = await supabase.functions.invoke('list-payment-methods', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
      return data.paymentMethods as PaymentMethod[];
    },
    enabled: !!session?.access_token && !!user,
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching payment methods:', error);
        toast.error('Failed to load payment methods');
      }
    }
  });

  const deleteCard = useMutation({
    mutationFn: async (paymentMethodId: string) => {
      if (!session?.access_token) {
        throw new Error('No auth session');
      }
      const { error } = await supabase.functions.invoke('delete-payment-method', {
        body: { paymentMethodId },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods', user?.id] });
      toast.success('Card removed successfully');
    },
    onError: (error) => {
      console.error('Error deleting card:', error);
      toast.error('Failed to remove card');
    },
    onSettled: () => {
      setIsDeleting(null);
    },
  });

  const handleDeleteCard = async (paymentMethodId: string) => {
    setIsDeleting(paymentMethodId);
    deleteCard.mutate(paymentMethodId);
  };

  if (!session?.access_token) {
    return (
      <Card className="p-4">
        <p className="text-center text-gray-500">Please log in to view payment methods</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-center text-gray-500">Failed to load payment methods</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <p className="text-center text-gray-500">Loading saved cards...</p>
      </Card>
    );
  }

  if (!cards?.length) {
    return (
      <Card className="p-4">
        <p className="text-center text-gray-500">No saved cards</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <Card key={card.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium capitalize">
                {card.card.brand} •••• {card.card.last4}
              </p>
              <p className="text-sm text-gray-500">
                Expires {card.card.exp_month.toString().padStart(2, '0')}/{card.card.exp_year}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteCard(card.id)}
              disabled={isDeleting === card.id}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
