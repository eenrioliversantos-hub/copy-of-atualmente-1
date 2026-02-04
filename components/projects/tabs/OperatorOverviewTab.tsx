import React from 'react';
import { Project } from '../../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import Icon from '../../shared/Icon';
import { Button } from '../../ui/Button';
import { Progress } from '../../ui/Progress';
import Avatar from '../../shared/Avatar';

interface OperatorOverviewTabProps {
    project: Project;
    setActiveTab: (tabId: string) => void;
    setCurrentView: (view: string, context?: any) => void;
}

const HealthIndicator: React.FC<{ title: string; status: 'healthy' | 'warning' | 'critical'; description: string }> = ({ title, status, description }) => {
    const colors = {
        healthy: 'bg-green-500',
        warning: 'bg-yellow-500',
        critical: 'bg-red-500',
    };
    return (
        <div>
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors[status]}`}></div>
                <p className="font-semibold">{title}</p>
            </div>
            <p className="text-sm text-text-secondary ml-5">{description}</p>
        </div>
    );
};

const mockActivity = [
    { type: 'commit', user: 'Ana Santos', details: 'feat: implementa autenticação JWT', time: '2h atrás' },
    { type: 'task', user: 'Pedro Costa', details: 'concluiu a tarefa "Configurar CI/CD"', time: '5h atrás' },
    { type: 'comment', user: 'Maria Oliveira', details: 'comentou na tarefa "Design do Dashboard"', time: '8h atrás' },
];

const OperatorOverviewTab: React.FC<OperatorOverviewTabProps> = ({ project, setActiveTab, setCurrentView }) => {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in-50">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Saúde do Projeto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">Progresso Geral</span>
                                <span className="text-sm font-bold">0%</span>
                            </div>
                            <Progress value={0} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <HealthIndicator status="healthy" title="Saúde do Orçamento" description="7% do orçamento utilizado" />
                            <HealthIndicator status="warning" title="Risco do Cronograma" description="Levemente adiantado" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {mockActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <Avatar src="" fallback={activity.user.substring(0, 1)} size="md" />
                                <div>
                                    <p className="text-sm"><span className="font-semibold">{activity.user}</span> {activity.details}</p>
                                    <p className="text-xs text-text-secondary">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Ações Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setActiveTab('pipeline')}>
                            <Icon name="workflow" className="h-4 w-4" /> Ir para o Pipeline
                        </Button>
                         <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setActiveTab('dev-plan')}>
                            <Icon name="file-text" className="h-4 w-4" /> Plano de Desenvolvimento
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setCurrentView('construction_hub', { projectId: project.id })}>
                            <Icon name="cpu" className="h-4 w-4" /> Hub de Construção
                        </Button>
                        <Button className="w-full justify-start gap-2" onClick={() => alert('Enviando para validação...')}>
                            <Icon name="share" className="h-4 w-4" /> Enviar Fase para Validação
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Informações Técnicas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-text-secondary mb-2">Stack Tecnológica</p>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map(tech => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                            </div>
                        </div>
                         <div>
                            <p className="text-sm font-medium text-text-secondary mb-2">Links Rápidos</p>
                            <div className="space-y-2">
                                <a href="#" className="flex items-center gap-2 text-sm text-accent hover:underline">
                                    <Icon name="gitBranch" className="h-4 w-4" /> Repositório Git
                                </a>
                                <a href="#" className="flex items-center gap-2 text-sm text-accent hover:underline">
                                    <Icon name="server" className="h-4 w-4" /> Ambiente de Staging
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OperatorOverviewTab;