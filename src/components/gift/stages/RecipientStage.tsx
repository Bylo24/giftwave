
import React from 'react';
import { PageContainer } from "@/components/layout/PageContainer";
import { motion } from "framer-motion";
import { RecipientStep } from "@/components/gift/RecipientStep";

interface RecipientStageProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onNext: () => Promise<void>;
  onBack: () => void;
}

export const RecipientStage: React.FC<RecipientStageProps> = ({
  phoneNumber,
  setPhoneNumber,
  onNext,
  onBack
}) => {
  return (
    <PageContainer>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <RecipientStep
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onNext={onNext}
            onBack={onBack}
          />
        </motion.div>
      </div>
    </PageContainer>
  );
};
