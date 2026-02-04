import React from 'react';
import { Project, Invoice } from '../../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import Icon from '../../shared/Icon';
import { Button } from '../../ui/Button';
import { Progress } from '../../ui/Progress';
import Avatar from '../../shared/Avatar';

interface ClientOverviewTabProps {
    project: Project;
    invoices: Invoice[];
    setActiveTab: (tabId: string) => void;
}

const QuickStatusCard: React.FC<{ status: string; progress: number; nextMilestone?: string }> = ({ status, progress, nextMilestone }) => (
    <Card>
        <CardHeader>
            <CardTitle>Status Rápido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Progresso Geral</span>
                    <span className="text-sm font-bold">{progress}%</span>
                </div>
                <Progress value={progress} />
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Status Atual:</span>
                <span className="font-semibold">{status}</span>
            </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Próximo Marco:</span>
                <span className="font-semibold">{nextMilestone || 'Planejamento Final'}</span>
            </div>
        </CardContent>
    </Card>
);

const ActionAlert: React.FC<{ title: string; description: string; buttonLabel: string; onClick: () => void; }> = ({ title, description, buttonLabel, onClick }) => (
    <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Icon name="alertCircle" className="h-6 w-6 text-yellow-300 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold text-yellow-300">{title}</h3>
                    <p className="text-sm text-yellow-400/80">{description}</p>
                </div>
            </div>
            <Button size="sm" onClick={onClick} className="bg-yellow-500 hover:bg-yellow-600 text-background flex-shrink-0">
                {buttonLabel}
            </Button>
        </CardContent>
    </Card>
);

const ClientOverviewTab: React.FC<ClientOverviewTabProps> = ({ project, invoices, setActiveTab }) => {
    const projectTypes: { [key: string]: string } = {
        "webapp": "Aplicação Web",
        // ... add other types as needed
    };
    
    const projectStatusLabels: { [key: string]: string } = {
        'planning': "Planejamento",
        'awaiting_validation': "Aguardando sua Validação",
        'in_progress': "Em Desenvolvimento",
        'completed': "Concluído"
    };
    
    const pendingValidation = project.validations.find(v => v.status === 'pending');
    const hasPendingAssets = project.assets.some(a => a.status === 'pending');
    
    let actionNeeded = null;
    if (pendingValidation) {
        actionNeeded = {
            title: "Ação Necessária: Aprovação Pendente",
            description: `A fase "${pendingValidation.targetName}" aguarda sua revisão.`,
            buttonLabel: "Revisar Agora",
            onClick: () => setActiveTab('pipeline')
        };
    } else if (hasPendingAssets) {
        actionNeeded = {
            title: "Ação Necessária: Ativos Pendentes",
            description: "Precisamos de alguns itens para continuar.",
            buttonLabel: "Enviar Ativos",
            onClick: () => setActiveTab('assets')
        };
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in-50">
            <div className="lg:col-span-2 space-y-6">
                
                {actionNeeded && <ActionAlert {...actionNeeded} />}

                <QuickStatusCard 
                    status={projectStatusLabels[project.status] || project.status} 
                    progress={0} // Mocked progress
                    nextMilestone={project.milestones[0]?.name}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Informações do Projeto</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-text-secondary mb-1">Objetivo</p>
                            <p>{project.description}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary mb-1">Tecnologias</p>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map(tech => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Ações Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                         <Button variant="outline" className="w-full justify-start gap-2" onClick={() => alert('Navegando para mensagens...')}>
                            <Icon name="messageSquare" className="h-4 w-4" /> Enviar Mensagem
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setActiveTab('assets')}>
                            <Icon name="upload" className="h-4 w-4" /> Enviar/Ver Ativos
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setActiveTab('financials')}>
                            <Icon name="creditCard" className="h-4 w-4" /> Ver Faturas
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle>Sua Equipe no Projeto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Avatar src="" fallback="MO" alt="Maria Oliveira" />
                            <div>
                                <p className="font-semibold">Maria Oliveira</p>
                                <p className="text-sm text-text-secondary">Gerente de Projeto</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3">
                            <Avatar src="" fallback="CS" alt="Carlos Silva" />
                            <div>
                                <p className="font-semibold">Carlos Silva</p>
                                <p className="text-sm text-text-secondary">Líder Técnico</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ClientOverviewTab;