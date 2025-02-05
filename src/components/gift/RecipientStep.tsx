import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RecipientStepProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onNext: () => void;
}

export const RecipientStep = ({ phoneNumber, setPhoneNumber, onNext }: RecipientStepProps) => {
  return (
    <Card className="p-6 space-y-4 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-primary/10 rounded-full animate-bounce">
          <Phone className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Who's the Lucky Person?
        </h2>
      </div>
      <p className="text-gray-600">Enter their phone number to send them a special surprise!</p>
      <Input
        type="tel"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="text-lg border-2 border-primary/20 focus:border-primary/40 transition-colors"
      />
      <Button 
        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity animate-fade-in"
        onClick={onNext}
        disabled={!phoneNumber}
      >
        Continue to Message
      </Button>
    </Card>
  );
};