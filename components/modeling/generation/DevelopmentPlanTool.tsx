import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { DevelopmentPlan, DevTask, Sprint as SprintType, Project, ProjectArtifacts, ToolTarget } from '../../../types';
import PlanSidebar from './PlanSidebar';
import PlanContent from './PlanContent';
import PlanHeader from './PlanHeader';

interface DevelopmentPlanToolProps {
    plan: DevelopmentPlan;
    wizardData: any;
    onBack: () => void;
    setCurrentView: (view: string, context?: any) => void;
    project: Project;
    onArtifactsUpdate: (projectId: string, updates: Partial<ProjectArtifacts>) => void;
    onStartConstruction: (taskId?: string) => void;
}

const DevelopmentPlanTool: React.FC<DevelopmentPlanToolProps> = ({ plan: initialPlan, wizardData, onBack, setCurrentView, project, onArtifactsUpdate, onStartConstruction }) => {
    const [plan, setPlan] = useState<DevelopmentPlan>(initialPlan);
    const [activeSprintId, setActiveSprintId] = useState<string | null>(null);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

    useEffect(() => {
        setPlan(initialPlan);
    }, [initialPlan]);

    const allSprints = useMemo(() => {
        if (!plan) return [];
        const sprints = plan.sprints.map((s, index) => ({
            id: s.id,
            title: s.title,
            tasks: [...s.backendTasks, ...s.frontendTasks],
            version: `Sprint ${index + 1}`,
            duration: '2-3 weeks',
            estimate: '80h',
            deliverables: ['Funcionalidades implementadas', 'Testes escritos', 'Deploy em staging']
        }));
        
        const pseudoSprints: any[] = [];
        if (plan.setupAndDevOps.length > 0) {
            pseudoSprints.push({ 
                id: 'devops', 
                title: 'Sprint 0: Configuração e DevOps', 
                tasks: plan.setupAndDevOps,
                version: 'v0.1.0-alpha',
                duration: '1 semana',
                estimate: '40h',
                deliverables: ['Repositório configurado', 'Ambiente de dev', 'Estrutura de pastas']
            });
        }
        
        const postDeploySprint = {
            id: 'postdeploy',
            title: 'Pós-Deploy e Manutenção',
            tasks: plan.postDeploy,
            version: 'v1.1.0',
            duration: 'Contínuo',
            estimate: 'N/A',
            deliverables: ['Monitoramento ativo', 'Rotinas de backup']
        };

        const checklistSprint = {
            id: 'checklist',
            title: 'Checklist de Desenvolvimento',
            tasks: plan.checklist,
            version: 'Final',
            duration: 'N/A',
            estimate: 'N/A',
            deliverables: ['Todas as funcionalidades implementadas']
        };

        return [...pseudoSprints, ...sprints, postDeploySprint, checklistSprint];
    }, [plan]);

    useEffect(() => {
        if (allSprints.length > 0 && !activeSprintId) {
            const firstSprint = allSprints[0];
            setActiveSprintId(firstSprint.id);
            if (firstSprint.tasks.length > 0) {
                setActiveTaskId(firstSprint.tasks[0].id);
            }
        }
    }, [allSprints, activeSprintId]);
    
    const activeSprint = useMemo(() => {
       if (!activeSprintId || !allSprints) return null;
       return allSprints.find(s => s.id === activeSprintId) || null;
    }, [activeSprintId, allSprints]);

    const activeTask = useMemo(() => {
       if (!activeSprint || !activeTaskId) return null;
       return activeSprint.tasks.find((t: DevTask) => t.id === activeTaskId) || null;
    }, [activeSprint, activeTaskId]);

    const handleTaskStatusChange = useCallback((taskId: string, subTaskId: string, newStatus: 'todo' | 'done') => {
        const newPlan = JSON.parse(JSON.stringify(plan)) as DevelopmentPlan; // Deep copy
        let taskFound = false;

        const findAndUpdate = (tasks: DevTask[]) => {
            for (const task of tasks) {
                if (task.id === taskId) {
                    const subTask = task.subTasks.find(st => st.id === subTaskId);
                    if (subTask) {
                        subTask.status = newStatus;
                        const allSubTasksDone = task.subTasks.every(st => st.status === 'done');
                        task.status = allSubTasksDone ? 'done' : 'todo';
                        taskFound = true;
                        return;
                    }
                }
            }
        };
        
        const allTaskLists = [
            newPlan.setupAndDevOps,
            ...newPlan.sprints.flatMap(s => [s.backendTasks, s.frontendTasks]),
            newPlan.postDeploy,
            newPlan.checklist
        ];

        for (const taskList of allTaskLists) {
            findAndUpdate(taskList);
            if (taskFound) break;
        }

        if (taskFound) {
            setPlan(newPlan);
            onArtifactsUpdate(project.id, { developmentPlan: newPlan });
        }
        
    }, [plan, project.id, onArtifactsUpdate]);
    
    const handleExecuteTask = (toolTarget: ToolTarget, taskId: string) => {
        onStartConstruction(taskId);
    };

    if (!plan) return <div>Carregando plano...</div>;

    return (
        <div className="flex h-screen bg-background text-text-primary overflow-hidden">
            <PlanSidebar
                sprints={allSprints}
                activeSprintId={activeSprintId}
                setActiveSprintId={setActiveSprintId}
                activeTaskId={activeTaskId}
                setActiveTaskId={setActiveTaskId}
                planTitle={plan.title}
                onBack={onBack}
            />
            <div className="flex-1 flex flex-col">
                <PlanHeader 
                    plan={plan}
                    allSprints={allSprints}
                    onStartConstruction={() => onStartConstruction()}
                />
                <main className="flex-1 overflow-y-auto p-6 bg-gray-900/50">
                    <PlanContent 
                        plan={plan}
                        wizardData={wizardData}
                        allSprints={allSprints}
                        activeSprint={activeSprint}
                        activeTask={activeTask}
                        onSubTaskChange={handleTaskStatusChange}
                        onExecuteTask={handleExecuteTask}
                        setActiveTaskId={setActiveTaskId}
                    />
                </main>
            </div>
        </div>
    );
};

export default DevelopmentPlanTool;