import React from 'react';
import { Card, CardContent } from '../../ui/Card';
import Icon from '../../shared/Icon';
import { Switch } from '../../ui/Switch';
import { Label } from '../../ui/Label';

interface FeaturePlaceholderProps {
  title: string;
  description: string;
  icon: string;
}

const FeaturePlaceholder: React.FC<FeaturePlaceholderProps> = ({ title, description, icon }) => {
  return (
    <Card className="bg-sidebar/50 border-dashed">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon name={icon} className="h-6 w-6 text-text-secondary" />
            <div>
              <Label htmlFor={`switch-${title}`} className="text-lg font-semibold text-text-primary cursor-pointer">{title}</Label>
              <p className="text-sm text-text-secondary mt-1">{description}</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
             <Switch id={`switch-${title}`} />
             <Label htmlFor={`switch-${title}`} className="text-xs cursor-pointer">Habilitar</Label>
          </div>
        </div>
        <div className="text-center text-text-secondary mt-8">
            <p>Esta funcionalidade é um placeholder.</p>
            <p className="text-xs">A lógica completa será gerada na fase de construção.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturePlaceholder;