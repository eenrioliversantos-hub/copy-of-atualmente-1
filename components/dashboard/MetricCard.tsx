import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Icon from '../shared/Icon';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-accent/10">
          <Icon name={icon} className="h-4 w-4 text-accent" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && <p className="text-xs text-text-secondary">{change}</p>}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
