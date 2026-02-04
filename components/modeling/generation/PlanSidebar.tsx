import React from 'react';
import { Sprint, DevTask } from '../../../types';
import Icon from '../../shared/Icon';
import { Button } from '../../ui/Button';

interface PlanSidebarProps {
    sprints: { id: string; title: string; tasks: DevTask[] }[];
    activeSprintId: string | null;
    setActiveSprintId: (id: string) => void;
    activeTaskId: string | null;
    setActiveTaskId: (id: string) => void;
    planTitle: string;
    onBack: () => void;
}

const PlanSidebar: React.FC<PlanSidebarProps> = ({
    sprints,
    activeSprintId,
    setActiveSprintId,
    activeTaskId,
    setActiveTaskId,
    planTitle,
    onBack
}) => {
    
    const handleSprintClick = (sprintId: string) => {
        setActiveSprintId(sprintId);
        const sprint = sprints.find(s => s.id === sprintId);
        if (sprint && sprint.tasks.length > 0) {
            setActiveTaskId(sprint.tasks[0].id);
        } else {
            setActiveTaskId(null);
        }
    };

    return (
        <aside className="w-80 bg-sidebar flex flex-col border-r border-card-border flex-shrink-0">
            <header className="p-4 border-b border-card-border">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-lg font-bold truncate">Oficina Fácil</h1>
                    <Button variant="ghost" size="sm" onClick={onBack}>
                        <Icon name="externalLink" className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-sm text-text-secondary">Plano de Desenvolvimento</p>
            </header>
            <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                {sprints.map(sprint => {
                    const totalTasks = sprint.tasks.reduce((acc, task) => acc + task.subTasks.length, 0);
                    const completedTasks = sprint.tasks.reduce((acc, task) => acc + task.subTasks.filter(st => st.status === 'done').length, 0);
                    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                    const isActive = activeSprintId === sprint.id;

                    return (
                        <div key={sprint.id}>
                            <button
                                onClick={() => handleSprintClick(sprint.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${isActive ? 'bg-accent/20 text-accent' : 'hover:bg-slate-700'}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-sm">{sprint.title}</span>
                                    <span className="text-xs">{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-slate-600 rounded-full h-1.5">
                                    <div className="bg-accent h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            </button>
                            {isActive && (
                                <ul className="pl-4 mt-1 space-y-0.5">
                                    {sprint.tasks.map(task => {
                                        const isTaskActive = activeTaskId === task.id;
                                        const isTaskDone = task.status === 'done';
                                        return (
                                            <li key={task.id}>
                                                <button 
                                                    onClick={() => setActiveTaskId(task.id)}
                                                    className={`w-full text-left text-xs p-2 rounded transition-colors flex items-center gap-2 ${isTaskActive ? 'bg-slate-700 text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                                                >
                                                    <Icon name={isTaskDone ? 'checkSquare' : 'list'} className={`h-3 w-3 ${isTaskDone ? 'text-green-400' : ''}`} />
                                                    <span className="truncate">{task.title}</span>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default PlanSidebar;
