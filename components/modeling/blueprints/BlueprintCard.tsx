import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { SystemTemplate } from '../../../types';
import Icon from '../../shared/Icon';

interface BlueprintCardProps {
  blueprint: SystemTemplate;
  onClick: () => void;
}

const BlueprintCard: React.FC<BlueprintCardProps> = ({ blueprint, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer transition-all duration-300 hover:border-accent hover:shadow-lg hover:-translate-y-1"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-3 text-lg">
                <span className="text-2xl">{blueprint.icon}</span>
                {blueprint.name}
            </CardTitle>
            <Badge variant={blueprint.complexity === 'high' ? 'destructive' : blueprint.complexity === 'medium' ? 'secondary' : 'default'}>
                {blueprint.complexity}
            </Badge>
        </div>
        <CardDescription>{blueprint.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {(blueprint.tags || []).slice(0, 4).map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlueprintCard;