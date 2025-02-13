
import React from 'react';
import { Ban, Circle, Grid, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PatternType } from '@/types/gift';

interface PatternSelectorProps {
  currentPattern: PatternType;
  onPatternChange: (pattern: PatternType) => void;
}

export const PatternSelector: React.FC<PatternSelectorProps> = ({
  currentPattern,
  onPatternChange,
}) => {
  return (
    <div className="flex justify-center gap-2 mb-4 px-4">
      <Button
        variant={currentPattern === 'none' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onPatternChange('none')}
        className="w-10 h-10"
      >
        <Ban className="h-4 w-4" />
      </Button>
      <Button
        variant={currentPattern === 'dots' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onPatternChange('dots')}
        className="w-10 h-10"
      >
        <Circle className="h-4 w-4" />
      </Button>
      <Button
        variant={currentPattern === 'grid' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onPatternChange('grid')}
        className="w-10 h-10"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={currentPattern === 'waves' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onPatternChange('waves')}
        className="w-10 h-10"
      >
        <Waves className="h-4 w-4" />
      </Button>
    </div>
  );
};
