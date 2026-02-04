
import React from 'react';
import { ProductionPhase } from '../../types';
import { PRODUCTION_PHASES } from '../../data/productionPhases';
import Icon from '../shared/Icon';
import { Project } from '../../types';

interface AssemblyLineProps {
    project: Project;
    currentPhaseId?: string;
    onPhaseClick: (phaseId: string) => void;
}

const AssemblyLine: React.FC<AssemblyLineProps> = ({ project, currentPhaseId, onPhaseClick }) => {
    
    // Helper para determinar o status visual da fase na esteira
    const getPhaseStatus = (phaseId: string, index: number) => {
        // Lógica simplificada de status baseada no progresso do projeto
        // Em uma implementação real, isso viria do estado detalhado do projeto
        
        // Mapeamento grosseiro de status do projeto para fases
        const statusMap: Record<string, number> = {
            'planning': 0,
            'awaiting_validation': 0,
            'in_progress': 2, // Assume que está no meio
            'awaiting_delivery_approval': 5,
            'completed': 6
        };
        
        const projectProgressIndex = statusMap[project.status] || 0;
        
        if (index < projectProgressIndex) return 'completed';
        if (index === projectProgressIndex) return 'active';
        return 'pending';
    };

    return (
        <div className="w-full overflow-x-auto py-6">
            <div className="min-w-[800px] flex items-center justify-between relative px-10">
                {/* Linha conectora de fundo */}
                <div className="absolute left-0 top-1/2 w-full h-1 bg-card-border -z-10 transform -translate-y-1/2"></div>
                
                {/* Barra de progresso ativa */}
                <div 
                    className="absolute left-0 top-1/2 h-1 bg-accent -z-10 transform -translate-y-1/2 transition-all duration-1000 ease-out"
                    style={{ width: `${(getPhaseStatus('dummy', 2) === 'completed' ? 50 : 10) }%` }} // Exemplo estático, idealmente dinâmico
                ></div>

                {PRODUCTION_PHASES.map((phase, index) => {
                    const status = getPhaseStatus(phase.id, index);
                    const isActive = phase.id === currentPhaseId;
                    
                    let circleClass = 'bg-sidebar border-card-border text-text-secondary';
                    let iconClass = 'text-text-secondary';
                    let textClass = 'text-text-secondary';

                    if (status === 'completed') {
                        circleClass = 'bg-green-500/10 border-green-500 text-green-500';
                        iconClass = 'text-green-500';
                        textClass = 'text-green-500';
                    } else if (status === 'active') {
                        circleClass = 'bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(56,189,248,0.5)] animate-pulse';
                        iconClass = 'text-accent';
                        textClass = 'text-accent font-bold';
                    }

                    if (isActive) {
                        circleClass += ' ring-4 ring-accent/20';
                    }

                    return (
                        <div key={phase.id} className="flex flex-col items-center group cursor-pointer" onClick={() => onPhaseClick(phase.id)}>
                            <div 
                                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300 ${circleClass} group-hover:scale-110`}
                            >
                                <Icon name={status === 'completed' ? 'check' : phase.icon} className={`h-6 w-6 ${iconClass}`} />
                            </div>
                            <div className="mt-3 text-center">
                                <p className={`text-xs uppercase tracking-wider font-semibold mb-1 transition-colors ${textClass}`}>
                                    Fase {index + 1}
                                </p>
                                <p className={`text-sm font-medium transition-colors ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                                    {phase.title.split(':')[1]?.trim() || phase.title}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AssemblyLine;
