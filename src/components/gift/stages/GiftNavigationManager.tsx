
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type GiftStep = 'recipient' | 'message' | 'amount' | 'memory' | 'reveal' | 'preview' | 'payment';
export type GiftPage = 'front' | 'blank' | 'inside-left';

interface UseGiftNavigationReturn {
  currentPage: GiftPage;
  currentStep: GiftStep;
  previousSteps: GiftStep[];
  goToPreviousStep: () => void;
  goToNextStep: () => Promise<void>;
}

export const useGiftNavigation = (): UseGiftNavigationReturn => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<GiftPage>('front');
  const [currentStep, setCurrentStep] = useState<GiftStep>('recipient');
  const [previousSteps, setPreviousSteps] = useState<GiftStep[]>([]);

  const goToPreviousStep = () => {
    if (currentPage === 'inside-left') {
      setCurrentPage('blank');
    } else if (currentPage === 'blank') {
      setCurrentPage('front');
    } else if (previousSteps.length > 0) {
      const prevStep = previousSteps[previousSteps.length - 1];
      setCurrentStep(prevStep);
      setPreviousSteps(prev => prev.slice(0, -1));
    } else {
      navigate('/');
    }
  };

  const goToNextStep = async () => {
    if (currentStep === 'memory') {
      setPreviousSteps(prev => [...prev, currentStep]);
      setCurrentStep('reveal');
      return Promise.resolve();
    }

    if (currentPage === 'front') {
      setCurrentPage('blank');
    } else if (currentPage === 'blank') {
      navigate('/insideleftscreen');
    } else {
      setPreviousSteps(prev => [...prev, currentStep]);
      setCurrentStep('memory');
    }
    return Promise.resolve();
  };

  return {
    currentPage,
    currentStep,
    previousSteps,
    goToPreviousStep,
    goToNextStep
  };
};
