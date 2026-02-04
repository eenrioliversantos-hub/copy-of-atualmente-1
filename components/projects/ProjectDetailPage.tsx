import React from 'react';
import { Project, ProjectArtifacts } from '../../types';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/DropdownMenu';
import { Separator } from '../ui/Separator';
import { buildOficinaFacilPlan } from '../../lib/planBuilder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
  setCurrentView: (view: string, context?: any) => void;
  onRequestValidation: (projectId: string, modelingData: any) => void;
  onArtifactsUpdate: (projectId: string, updates: Partial<ProjectArtifacts>) => void;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project, onBack, setCurrentView, onRequestValidation, onArtifactsUpdate }) => {
    
  const priorities = {
    low: { label: "Baixa", color: "bg-green-500/20 text-green-400" },
    medium: { label: "Média", color: "bg-yellow-500/20 text-yellow-400" },
    high: { label: "Alta", color: "bg-red-500/20 text-red-400" },
  };
  
  const statuses = {
      planning: { label: "Planejamento", color: "bg-blue-500/20 text-blue-400" },
      awaiting_validation: { label: "Aguardando Validação", color: "bg-yellow-500/20 text-yellow-400" },
      in_progress: { label: "Em Progresso", color: "bg-green-500/20 text-green-400" },
      awaiting_delivery_approval: { label: "Aguardando Aprovação", color: "bg-purple-500/20 text-purple-400"},
      completed: { label: "Concluído", color: "bg-slate-700 text-slate-300" },
  }

  const priorityInfo = priorities[project.priority] || { label: 'Não definida', color: 'bg-slate-700 text-slate-300' };
  const statusInfo = statuses[project.status as keyof typeof statuses] || { label: 'Desconhecido', color: 'bg-slate-700 text-slate-300' };
  
  const isDevelopmentLocked = project.status !== 'in_progress' && project.status !== 'completed' && project.status !== 'awaiting_delivery_approval';
  const canRequestValidation = project.status === 'planning';

  const getMockModelingData = () => {
      const plan = buildOficinaFacilPlan({ step1: { systemName: project.name }});
      return {
          planning: { step1: { systemName: project.name, description: project.description } },
          data_modeling: { step8: { entities: plan.entities }, step10: { relationships: [] }, step13: { endpoints: [] } },
          interface_ux: { step15: { screens: [] }, step17: {}, step18: {} },
          functionalities: { step19: { channels: [] }, step20: { globalSearch: {} }, step21: { reports: [] } },
          tech_reqs: { step23: {}, step24: {}, step25: {}, step26: {} },
          deploy: {},
          artifacts: {}
      };
  }

  const handleGenerateAndGoToConstruction = () => {
    const modelingData = getMockModelingData();
    const plan = buildOficinaFacilPlan(modelingData);
    onArtifactsUpdate(project.id, { developmentPlan: plan, wizardData: modelingData });
    setCurrentView('construction_hub', { projectId: project.id });
  }

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary">
      <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
            Voltar aos Projetos
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-text-primary">{project.name}</h1>
            <p className="text-sm text-text-secondary">{project.client || 'Projeto Interno'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>
                        <Icon name="cog" className="h-4 w-4 mr-2" />
                        Ações
                        <Icon name="chevronDown" className="h-4 w-4 ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setCurrentView('modeling_hub', { project })}>
                        <Icon name="schema" className="h-4 w-4 mr-2" />
                        Modelagem Avançada
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRequestValidation(project.id, getMockModelingData())} disabled={!canRequestValidation}>
                        <Icon name="share" className="h-4 w-4 mr-2" />
                        Enviar para Validação
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem onClick={handleGenerateAndGoToConstruction} disabled={isDevelopmentLocked}>
                        <Icon name="cpu" className="h-4 w-4 mr-2" />
                        Hub de Construção
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Visão Geral</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className={statusInfo.color}>{statusInfo.label}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-sidebar rounded-lg">
                        <p className="text-sm text-text-secondary">Prioridade</p>
                        <Badge variant="outline" className={`${priorityInfo.color} mt-1`}>{priorityInfo.label}</Badge>
                    </div>
                     <div className="p-4 bg-sidebar rounded-lg">
                        <p className="text-sm text-text-secondary">Data de Início</p>
                        <p className="font-semibold">{new Date(project.startDate).toLocaleDateString()}</p>
                    </div>
                     <div className="p-4 bg-sidebar rounded-lg">
                        <p className="text-sm text-text-secondary">Data de Entrega</p>
                        <p className="font-semibold">{new Date(project.endDate).toLocaleDateString()}</p>
                    </div>
                    <div className="p-4 bg-sidebar rounded-lg">
                        <p className="text-sm text-text-secondary">Progresso</p>
                        <div className="flex items-center gap-2 mt-1">
                            <Progress value={0} className="w-20 h-2" />
                            <span className="font-semibold text-sm">0%</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Tabs defaultValue="budget">
            <TabsList>
                <TabsTrigger value="budget">Orçamento</TabsTrigger>
                <TabsTrigger value="schedule">Cronograma</TabsTrigger>
                <TabsTrigger value="assets">Ativos do Cliente</TabsTrigger>
                <TabsTrigger value="tech">Tecnologias</TabsTrigger>
            </TabsList>
            <TabsContent value="budget" className="mt-4">
                 <Card>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="space-y-1"><p className="text-sm text-text-secondary">Orçamento Total:</p><p className="font-bold text-green-400 text-lg">R$ {Number(project.budget || 0).toLocaleString()}</p></div>
                         <div className="space-y-1"><p className="text-sm text-text-secondary">Valor/Hora:</p><p className="font-bold text-lg">R$ {Number(project.hourlyRate || 0).toLocaleString()}</p></div>
                         <div className="space-y-1"><p className="text-sm text-text-secondary">Horas Estimadas:</p><p className="font-bold text-lg">{project.estimatedHours || 0}h</p></div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="schedule" className="mt-4">
                <Card><CardContent className="p-6 text-center text-text-secondary">Visualização de Cronograma em desenvolvimento.</CardContent></Card>
            </TabsContent>
            <TabsContent value="assets" className="mt-4">
                <Card>
                    <CardContent className="p-6">
                         {project.assets.filter(a => a.status === 'submitted').length > 0 ? (
                            <ul className="space-y-2">
                                {project.assets.filter(a => a.status === 'submitted').map(asset => (
                                    <li key={asset.id} className="text-sm flex items-center gap-2 p-2 bg-sidebar rounded-md">
                                        <Icon name="checkCircle" className="h-4 w-4 text-green-400" />
                                        <span>{asset.label}: <span className="text-text-secondary italic">{asset.value || asset.fileName}</span></span>
                                    </li>
                                ))}
                            </ul>
                         ) : <p className="text-sm text-text-secondary text-center py-4">Nenhum ativo enviado pelo cliente ainda.</p>}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="tech" className="mt-4">
                 <Card>
                    <CardContent className="p-6 flex flex-wrap gap-2">
                        {project.technologies.map(tech => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProjectDetailPage;
