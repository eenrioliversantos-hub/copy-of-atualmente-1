import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Icon from '../shared/Icon';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { ProductionPhase } from '../../types';

interface PhaseOverviewDashboardProps {
  phases: ProductionPhase[];
  setActiveView: (viewId: string) => void;
}

const PhaseOverviewDashboard: React.FC<PhaseOverviewDashboardProps> = ({ phases, setActiveView }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Esteira de Produção</h2>
        <p className="text-text-secondary mt-1">Visão geral de todas as fases de desenvolvimento do projeto.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {phases.map((phase, index) => {
          const mockProgress = (index * 15 + 5) % 100; // Mock progress for visual representation
          return (
            <Card key={phase.id} className="flex flex-col hover:border-accent/70 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                    <Icon name={phase.icon} className="h-6 w-6 text-accent" />
                    <CardTitle className="text-lg">{phase.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <p className="text-sm text-text-secondary mb-4 flex-grow">{phase.description}</p>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-text-secondary">
                        <span>Progresso</span>
                        <span>{mockProgress}%</span>
                    </div>
                    <Progress value={mockProgress} />
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => setActiveView(phase.id)}
                >
                    Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
};

export default PhaseOverviewDashboard;
