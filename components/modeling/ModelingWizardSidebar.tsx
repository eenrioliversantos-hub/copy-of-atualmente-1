import React from 'react';
import Icon from '../shared/Icon';

interface Step {
  id: number;
  title: string;
  icon: string;
  category: string;
}

interface ModelingWizardSidebarProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  setCurrentStep: (step: number) => void;
}

const ModelingWizardSidebar: React.FC<ModelingWizardSidebarProps> = ({
  steps,
  currentStep,
  completedSteps,
  setCurrentStep,
}) => {
  const categories = [...new Set(steps.map(s => s.category))];

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <aside className="w-80 bg-sidebar flex flex-col p-4 border-r border-card-border flex-shrink-0">
      <div className="px-2 mb-6">
        <h2 className="text-xl font-semibold">Wizard Steps</h2>
        <p className="text-sm text-text-secondary">Follow the guide to model your system</p>
      </div>

      <nav className="flex-1 overflow-y-auto pr-2 -mr-2">
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="px-2 text-xs font-bold uppercase text-text-secondary tracking-wider mb-2">{category}</h3>
              <ul className="space-y-1">
                {steps.filter(s => s.category === category).map(step => {
                  const isCurrent = currentStep === step.id;
                  const isCompleted = completedSteps.includes(step.id);
                  return (
                    <li key={step.id}>
                      <button
                        onClick={() => setCurrentStep(step.id)}
                        className={`flex items-center w-full text-left p-2.5 rounded-md text-sm transition-colors ${
                          isCurrent
                            ? 'bg-accent text-white'
                            : 'text-text-secondary hover:bg-slate-700 hover:text-text-primary'
                        }`}
                      >
                        {isCompleted && !isCurrent ? (
                           <Icon name="checkCircle" className="h-5 w-5 mr-3 text-green-400" />
                        ) : (
                           <Icon name={step.icon} className="h-5 w-5 mr-3" />
                        )}
                        <span>{step.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="mt-auto pt-4">
        <p className="text-sm text-text-secondary mb-2">Progress: {Math.round(progress)}%</p>
        <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-accent h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
        </div>
      </div>
    </aside>
  );
};

export default ModelingWizardSidebar;