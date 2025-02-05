import { ArrowLeft } from "lucide-react";

interface VerificationHeaderProps {
  currentPhone: string | null;
  onBack: () => void;
}

export const VerificationHeader = ({ currentPhone, onBack }: VerificationHeaderProps) => {
  return (
    <>
      <button
        onClick={onBack}
        className="flex items-center text-gray-600"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
      </button>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">
          {currentPhone ? "Change phone number" : "Add phone number"}
        </h1>
        {currentPhone && (
          <p className="text-sm text-gray-500">
            Current phone: {currentPhone}
          </p>
        )}
        <p className="text-sm text-gray-500">
          We'll text you a code to verify this number.
        </p>
      </div>
    </>
  );
};