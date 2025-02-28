
import React from 'react';
import { PatternType } from '@/types/gift';

interface PatternSelectorProps {
  currentPattern: PatternType;
  onPatternChange: (pattern: PatternType) => void;
}

export const PatternSelector: React.FC<PatternSelectorProps> = ({
  currentPattern,
  onPatternChange,
}) => {
  // Empty component - pattern selection functionality removed
  return null;
};
