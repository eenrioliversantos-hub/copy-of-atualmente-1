import React from 'react';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';

interface MonitoringDashboardProps {
    onBack: () => void;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-screen bg-background text-text-primary p-4">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
          Voltar ao Hub
        </Button>
        <h1 className="text-xl font-semibold">Monitoramento</h1>
      </div>
      <div className="flex-1 bg-sidebar rounded-lg border border-card-border flex items-center justify-center">
        <div className="text-center">
          <Icon name="barChart3" className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <h2 className="text-lg font-semibold">Dashboard de Monitoramento</h2>
          <p className="text-text-secondary">Em construção.</p>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
