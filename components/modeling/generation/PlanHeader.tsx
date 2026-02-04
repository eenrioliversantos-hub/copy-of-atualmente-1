import React, { useMemo } from 'react';
import { DevelopmentPlan, DevTask } from '../../../types';
import StatCard from './StatCard';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';

interface PlanHeaderProps {
    plan: DevelopmentPlan;
    allSprints: { id: string; title: string; tasks: DevTask[] }[];
    onStartConstruction: () => void;
}

const PlanHeader: React.FC<PlanHeaderProps> = ({ plan, allSprints, onStartConstruction }) => {
    
    const stats = useMemo(() => {
        const allTasks = allSprints.flatMap(s => s.tasks);
        const allSubTasks = allTasks.flatMap(t => t.subTasks);
        
        const totalSubTasks = allSubTasks.length;
        const completedSubTasks = allSubTasks.filter(st => st.status === 'done').length;
        const progress = totalSubTasks > 0 ? Math.round((completedSubTasks / totalSubTasks) * 100) : 0;

        return {
            totalSprints: plan.sprints.length,
            totalTasks: totalSubTasks,
            completedTasks: completedSubTasks,
            progress,
        };
    }, [plan, allSprints]);

    return (
        <header className="bg-sidebar border-b border-card-border px-6 py-4 flex-shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon="listChecks" title="Total Tarefas" value={stats.totalTasks} />
                    <StatCard icon="checkSquare" title="Concluídas" value={stats.completedTasks} />
                    <StatCard icon="clock" title="Horas (Restantes)" value="428h" />
                    <StatCard icon="folder" title="Sprints" value={stats.totalSprints} />
                </div>
                <div className="col-span-1 grid grid-rows-2 gap-2">
                     <div className="bg-card border border-card-border rounded-lg p-2 flex flex-col justify-center">
                        <p className="text-xs text-text-secondary">Progresso Geral</p>
                        <p className="text-xl font-bold text-text-primary mb-1">{stats.progress}%</p>
                         <div className="w-full bg-slate-600 rounded-full h-1.5">
                            <div className="bg-accent h-1.5 rounded-full" style={{ width: `${stats.progress}%` }}></div>
                        </div>
                    </div>
                     <Button onClick={onStartConstruction} className="h-full">
                        <Icon name="play" className="h-4 w-4 mr-2" />
                        Iniciar Construção
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default PlanHeader;