import React from 'react';
import { Card, CardContent } from '../../ui/Card';
import Icon from '../../shared/Icon';

interface StepPlaceholderProps {
  stepTitle: string;
}

const StepPlaceholder: React.FC<StepPlaceholderProps> = ({ stepTitle }) => {
  return (
    <div className="text-center py-16">
      <Icon name="settings" className="h-12 w-12 text-text-secondary mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-text-primary mb-2">{stepTitle}</h3>
      <p className="text-text-secondary">This step is under construction.</p>
    </div>
  );
};

export default StepPlaceholder;