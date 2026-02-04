import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import Icon from '../shared/Icon';
import AvatarGroup from '../ui/AvatarGroup';
import { Project } from '../../types';

interface ClientProjectsPageProps {
    projects: Project[];
    onProjectSelect: (projectId: string) => void;
}

const mockTeam = [{ name: 'Maria Oliveira', avatar: 'https://i.pravatar.cc/150?u=user-3' }, { name: 'Carlos Silva', avatar: 'https://i.pravatar.cc/150?u=user-4' }];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'in_progress': return <Badge variant="secondary" className="bg-sky-500/10 text-sky-400">Em Andamento</Badge>;
        case 'planning': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">Planejamento</Badge>;
        case 'awaiting_validation': return <Badge variant="secondary" className="bg-orange-500/10 text-orange-400">Aguardando Validação</Badge>;
        case 'completed': return <Badge variant="secondary" className="bg-green-500/10 text-green-400">Concluído</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}

const ClientProjectsPage: React.FC<ClientProjectsPageProps> = ({ projects, onProjectSelect }) => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Seus Projetos</h1>
                <p className="text-text-secondary">Acompanhe o status e os detalhes de todos os seus projetos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(projects || []).map(project => (
                    <Card key={project.id} className="cursor-pointer hover:border-accent transition-all group" onClick={() => onProjectSelect(project.id)}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="group-hover:text-accent transition-colors">{project.name}</CardTitle>
                                {getStatusBadge(project.status)}
                            </div>
                            <CardDescription>Início: {project.startDate} - Fim: {project.endDate}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center text-sm text-text-secondary mb-2">
                                <span>Progresso</span>
                                <span>0%</span>
                            </div>
                            <Progress value={0} />
                            <div className="mt-4 flex justify-between items-center">
                                <AvatarGroup avatars={mockTeam} />
                                <div className="flex items-center gap-1 text-text-secondary text-sm">
                                    <Icon name="messageSquare" className="h-4 w-4" /> 3
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                 {(!projects || projects.length === 0) && (
                    <Card className="md:col-span-2 lg:col-span-3 text-center py-12">
                         <Icon name="briefcase" className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                         <h3 className="text-lg font-semibold mb-2">Nenhum projeto ativo</h3>
                         <p className="text-text-secondary">Seus projetos aparecerão aqui assim que uma proposta for aprovada.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ClientProjectsPage;