import React, { useState } from 'react';
import Icon from '../shared/Icon';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';

interface Phase {
  id: string;
  title: string;
  icon: string;
}

interface ModuleWrapperProps {
  title: string;
  icon: string;
  phases: Phase[];
  ModuleComponent: React.FC<any>;
  onBack: () => void;
}

const ModuleWrapper: React.FC<ModuleWrapperProps> = ({ title, icon, phases, ModuleComponent, onBack }) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [moduleData, setModuleData] = useState<Record<string, any>>({});

  const currentPhase = phases[currentPhaseIndex];
  const progress = (completedPhases.length / phases.length) * 100;

  const handlePhaseComplete = (phaseId: string, data: any) => {
    if (!completedPhases.includes(phaseId)) {
      setCompletedPhases([...completedPhases, phaseId]);
    }
    setModuleData(prev => ({ ...prev, [phaseId]: data }));
    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhaseIndex(currentPhaseIndex + 1);
    } else {
      // Handle completion - maybe show a summary or navigate away
      alert(`Módulo "${title}" concluído!`);
      console.log("Module completed:", { ...moduleData, [phaseId]: data });
      onBack();
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-primary">
      <aside className="w-80 bg-sidebar flex flex-col p-4 border-r border-card-border flex-shrink-0">
        <div className="px-2 mb-6">
          <div className="flex items-center gap-3">
            <Icon name={icon} className="h-6 w-6 text-accent" />
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          {phases.map((phase, index) => {
            const isActive = index === currentPhaseIndex;
            const isCompleted = completedPhases.includes(phase.id);
            return (
              <button
                key={phase.id}
                onClick={() => setCurrentPhaseIndex(index)}
                disabled={!completedPhases.includes(phases[index - 1]?.id) && index > currentPhaseIndex && !isCompleted}
                className={`flex items-center w-full text-left p-3 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isActive
                    ? 'bg-accent text-white'
                    : isCompleted
                    ? 'text-text-primary hover:bg-slate-700'
                    : 'text-text-secondary hover:bg-slate-700'
                }`}
              >
                {isCompleted ? (
                  <Icon name="checkCircle" className="h-5 w-5 mr-3 text-green-400" />
                ) : (
                  <Icon name={phase.icon} className="h-5 w-5 mr-3" />
                )}
                <span>{phase.title}</span>
              </button>
            );
          })}
        </nav>
        <div className="mt-auto pt-4">
          <p className="text-sm text-text-secondary mb-2">Progresso: {Math.round(progress)}%</p>
          <Progress value={progress} />
          <Button variant="outline" size="sm" onClick={onBack} className="w-full mt-4">
            <Icon name="chevronLeft" className="h-4 w-4 mr-2" /> Voltar
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-2">{currentPhase.title}</h1>
        <ModuleComponent
          currentPhase={currentPhase}
          onPhaseComplete={handlePhaseComplete}
          moduleData={moduleData}
        />
      </main>
    </div>
  );
};

export default ModuleWrapper;