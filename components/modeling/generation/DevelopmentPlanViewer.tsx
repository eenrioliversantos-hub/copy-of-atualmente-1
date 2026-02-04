import React from 'react';
import { DevelopmentPlan, DevTask, Sprint as SprintType } from '../../../types';
import Icon from '../../shared/Icon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

interface DevelopmentPlanViewerProps {
    plan: DevelopmentPlan;
    onStartConstruction: () => void;
}

const TaskCard: React.FC<{ task: DevTask, type: 'backend' | 'frontend' }> = ({ task, type }) => (
    <div className="p-3 bg-sidebar rounded-md border border-card-border">
        <p className="font-medium text-sm flex items-center gap-2">
            <Icon name={type === 'backend' ? 'server' : 'layout'} className="h-4 w-4 text-accent" />
            {task.title}
        </p>
        <ul className="list-disc list-inside text-xs text-text-secondary mt-2 pl-2 space-y-1">
            {task.subTasks.map(st => (
                <li key={st.id}>{st.text}</li>
            ))}
        </ul>
    </div>
);

const DevelopmentPlanViewer: React.FC<DevelopmentPlanViewerProps> = ({ plan, onStartConstruction }) => {
    return (
        <div className="space-y-8">
            <header className="text-center">
                 <h1 className="text-3xl font-bold">Plano de Desenvolvimento: {plan.title}</h1>
                 <p className="text-text-secondary mt-2">Um guia passo-a-passo gerado para a construção do seu sistema.</p>
                 <div className="mt-6">
                    <Button onClick={onStartConstruction} size="lg">
                        <Icon name="wrench" className="h-5 w-5 mr-2" />
                        Acessar Ferramenta de Desenvolvimento
                    </Button>
                </div>
            </header>

            <Card>
                <CardHeader><CardTitle>Sprint 0: Configuração Geral e DevOps</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    {plan.setupAndDevOps.map(task => <TaskCard key={task.id} task={task} type="backend" />)}
                </CardContent>
            </Card>

            {plan.sprints.map((sprint, index) => (
                 <Card key={sprint.id}>
                    <CardHeader>
                        <CardTitle>Sprint {index + 1}: {sprint.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2"><Icon name="server" className="h-5 w-5" />Tarefas de Backend</h3>
                             {sprint.backendTasks.map(task => <TaskCard key={task.id} task={task} type="backend" />)}
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2"><Icon name="layout" className="h-5 w-5" />Tarefas de Frontend</h3>
                            {sprint.frontendTasks.map(task => <TaskCard key={task.id} task={task} type="frontend" />)}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default DevelopmentPlanViewer;