import React, { useMemo, useState, useEffect } from 'react';
import { DevelopmentPlan, DevTask, Sprint as SprintType, Project } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import PlanSidebar from '../../modeling/generation/PlanSidebar';
import PlanContent from '../../modeling/generation/PlanContent';
import { useDPO } from '../../../contexts/DPOContext';

interface DevelopmentPlanTabProps {
    developmentPlan?: DevelopmentPlan;
    wizardData?: any;
    project: Project;
    onNavigateToModeling: () => void;
}

const DevelopmentPlanTab: React.FC<DevelopmentPlanTabProps> = ({ developmentPlan: initialPlan, wizardData, project, onNavigateToModeling }) => {
    const { getProjectPlan, updateTaskStatus } = useDPO();
    
    // Use the plan from context, which is the single source of truth
    const plan = getProjectPlan(project.id);
    
    const [activeSprintId, setActiveSprintId] = useState<string | null>(null);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

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

    const handleTaskStatusChange = (taskId: string, subTaskId: string, newStatus: 'todo' | 'done') => {
        updateTaskStatus(project.id, taskId, subTaskId, newStatus);
    };
    
    const handleExecuteTask = (toolTarget: any, taskId: string) => {
        window.location.hash = `#/tool/${project.id}/${taskId}`;
    };

    if (!plan) {
        return (
            <Card>
                <CardContent className="text-center py-16">
                    <Icon name="file-text" className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Plano de Desenvolvimento Não Gerado</h3>
                    <p className="text-text-secondary mb-4">O plano de desenvolvimento detalhado ainda não foi gerado para este projeto.</p>
                    <Button onClick={onNavigateToModeling}>
                        <Icon name="schema" className="h-4 w-4 mr-2" />
                        Ir para o Hub de Modelagem
                    </Button>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <div className="flex h-[calc(100vh-250px)] bg-background text-text-primary overflow-hidden border border-card-border rounded-lg">
            <PlanSidebar
                sprints={allSprints}
                activeSprintId={activeSprintId}
                setActiveSprintId={setActiveSprintId}
                activeTaskId={activeTaskId}
                setActiveTaskId={setActiveTaskId}
                planTitle={plan.title}
                onBack={() => { /* No back button needed here */ }}
            />
            <div className="flex-1 flex flex-col">
                <main className="flex-1 overflow-y-auto p-6 bg-gray-900/50">
                    <PlanContent 
                        plan={plan}
                        wizardData={wizardData || {}}
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

export default DevelopmentPlanTab;