
import React, { useState } from 'react';
import { Project, Invoice, ProjectArtifacts, Sprint, DevTask, Contract, ProjectValidation } from '../../types';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Checkbox } from '../ui/Checkbox';
import { Label } from '../ui/Label';
import FileExplorer, { FileTreeItem } from '../shared/FileExplorer';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogCloseButton } from '../ui/Dialog';
import { Textarea } from '../ui/Textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
// FIX: The error "is not a module" for ProjectPipeline is resolved by creating the component in components/projects/ProjectPipeline.tsx.
import ProjectPipeline from '../projects/ProjectPipeline';
import ClientMonitoringTab from '../projects/tabs/ClientMonitoringTab';
import ClientFinancialsTab from '../projects/tabs/ClientFinancialsTab';
import ClientOverviewTab from '../projects/tabs/ClientOverviewTab';
import ProjectFilesTab from '../projects/tabs/ProjectFilesTab';

interface ClientProjectDetailPageProps {
  project: Project;
  invoices: Invoice[];
  contracts: Contract[];
  projectArtifacts?: ProjectArtifacts;
  onBack: () => void;
  onAssetSubmit: (projectId: string, assetId: string, value: string) => void;
  onApproveDelivery: (projectId: string) => void;
  onRequestChanges: (projectId: string, feedback: string) => void;
  onApproveValidation: (projectId: string, validationId: string) => void;
  setCurrentView: (view: string, context?: any) => void;
  onFileUpload: (projectId: string, file: File, description: string) => void;
}

const mockDeliveryFiles: FileTreeItem[] = [
    { name: 'documentacao', type: 'folder', children: [ { name: 'API.md', type: 'file' }, { name: 'ManualDoUsuario.pdf', type: 'file' }] },
    { name: 'codigo-fonte.zip', type: 'file' },
    { name: 'credenciais.txt', type: 'file' },
    { name: 'blueprint-digital.json', type: 'file' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'in_progress': return <Badge variant="secondary" className="bg-sky-500/10 text-sky-400">Em Andamento</Badge>;
        case 'planning': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">Planejamento</Badge>;
        case 'awaiting_validation': return <Badge variant="secondary" className="bg-orange-500/10 text-orange-400">Aguardando Validação</Badge>;
        case 'awaiting_delivery_approval': return <Badge variant="secondary" className="bg-purple-500/10 text-purple-400">Aguardando Aprovação da Entrega</Badge>;
        case 'completed': return <Badge variant="secondary" className="bg-green-500/10 text-green-400">Concluído</Badge>;
        case 'changes_requested': return <Badge variant="secondary" className="bg-orange-500/10 text-orange-400">Alterações Solicitadas</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}

const ProjectStatusGuide: React.FC<{ project: Project; setView: (view: string, context?: any) => void; }> = ({ project, setView }) => {
    switch (project.status) {
        case 'planning':
            return (
                <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Icon name="compass" className="h-6 w-6 text-blue-300" />
                            <p className="font-semibold text-blue-300">Próximo Passo: Nossa equipe está na fase de planejamento e modelagem. Enquanto isso, por favor, envie os ativos pendentes.</p>
                        </div>
                    </CardContent>
                </Card>
            );
        case 'awaiting_validation':
            const validation = project.validations.find(v => v.status === 'pending');
            return (
                <Card className="bg-yellow-500/10 border-yellow-500/30">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Icon name="alertCircle" className="h-6 w-6 text-yellow-300" />
                            <p className="font-semibold text-yellow-300">Ação Necessária: Revise o plano de modelagem para que possamos continuar.</p>
                        </div>
                        <Button size="sm" onClick={() => setView('validation_detail', { projectId: project.id, validationId: validation?.id })}>Revisar Plano</Button>
                    </CardContent>
                </Card>
            );
        case 'in_progress':
             return (
                <Card className="bg-green-500/10 border-green-500/30">
                    <CardContent className="p-4 flex items-center gap-3">
                        <Icon name="cog" className="h-6 w-6 text-green-300 animate-spin" />
                        <p className="font-semibold text-green-300">O desenvolvimento está em andamento! Você pode acompanhar as atividades e o progresso geral aqui.</p>
                    </CardContent>
                </Card>
            );
        case 'awaiting_delivery_approval':
             return (
                <Card className="bg-purple-500/10 border-purple-500/30">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Icon name="package" className="h-6 w-6 text-purple-300" />
                            <p className="font-semibold text-purple-300">Seu projeto está pronto! Revise os entregáveis finais na aba 'Entrega Final'.</p>
                        </div>
                    </CardContent>
                </Card>
            );
        case 'completed':
             return (
                <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4 flex items-center gap-3">
                        <Icon name="award" className="h-6 w-6 text-gray-300" />
                        <p className="font-semibold text-gray-300">Este projeto foi concluído com sucesso! Obrigado por trabalhar conosco.</p>
                    </CardContent>
                </Card>
            );
        default:
            return null;
    }
}


const ClientProjectDetailPage: React.FC<ClientProjectDetailPageProps> = ({ project, invoices, contracts, projectArtifacts, onBack, onAssetSubmit, onApproveDelivery, onRequestChanges, setCurrentView, onApproveValidation, onFileUpload }) => {
    const [approvalChecked, setApprovalChecked] = React.useState(false);
    const [showRequestChangesDialog, setShowRequestChangesDialog] = React.useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
    const [feedback, setFeedback] = React.useState("");
    
    const getDefaultTab = () => {
        if (project.status === 'awaiting_delivery_approval') return 'delivery';
        if (project.status === 'awaiting_validation') return 'pipeline';
        return 'overview';
    };

    const [activeTab, setActiveTab] = useState(getDefaultTab());


    const handleApproveClick = () => {
        onApproveDelivery(project.id);
        setShowSuccessDialog(true);
    };

    const handleRequestChangesSubmit = () => {
        onRequestChanges(project.id, feedback);
        setShowRequestChangesDialog(false);
        setFeedback("");
    };

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary">
        <Dialog open={showRequestChangesDialog} onClose={() => setShowRequestChangesDialog(false)}>
            <DialogHeader>
                <DialogTitle>Solicitar Alterações</DialogTitle>
                <DialogDescription>Descreva as alterações necessárias para a equipe. Seja o mais detalhado possível.</DialogDescription>
                <DialogCloseButton />
            </DialogHeader>
            <DialogContent>
                <Textarea placeholder="Ex: A documentação da API está incompleta na seção de usuários..." rows={5} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            </DialogContent>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowRequestChangesDialog(false)}>Cancelar</Button>
                <Button onClick={handleRequestChangesSubmit} disabled={!feedback.trim()}>Enviar Solicitação</Button>
            </DialogFooter>
        </Dialog>

        <Dialog open={showSuccessDialog} onClose={onBack}>
            <DialogHeader>
                <DialogTitle>Projeto Concluído com Sucesso!</DialogTitle>
                <DialogDescription>
                  Parabéns! O projeto foi aprovado. Você pode baixar todos os arquivos finais agora.
                </DialogDescription>
                <DialogCloseButton />
            </DialogHeader>
            <DialogContent className="text-center">
                <Icon name="award" className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <p>Obrigado por trabalhar conosco neste projeto.</p>
            </DialogContent>
            <DialogFooter>
                <Button variant="outline" onClick={onBack}>Fechar</Button>
                <Button onClick={() => alert('Iniciando download de todos os arquivos...')}>
                    <Icon name="download" className="h-4 w-4 mr-2" />
                    Baixar Todos os Arquivos
                </Button>
            </DialogFooter>
        </Dialog>

        <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={onBack}>
                    <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
                    Voltar para Projetos
                </Button>
                <div>
                    <h1 className="text-lg font-semibold text-text-primary">{project.name}</h1>
                    <p className="text-sm text-text-secondary">{project.description}</p>
                </div>
            </div>
        </header>
        
       <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
            <ProjectStatusGuide project={project} setView={setCurrentView} />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                    <TabsTrigger value="files">Arquivos</TabsTrigger>
                    <TabsTrigger value="financial">Financeiro</TabsTrigger>
                    <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
                    <TabsTrigger value="delivery">Entrega Final</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                    <ClientOverviewTab project={project} setActiveTab={setActiveTab} invoices={invoices} />
                </TabsContent>

                 <TabsContent value="pipeline" className="mt-4">
                    <ProjectPipeline 
                        project={project} 
                        userType="client"
                        onApproveValidation={onApproveValidation}
                        onRequestChanges={(projectId, validationId, feedback) => onRequestChanges(feedback)} // Adapted for final delivery
                        onViewValidation={(validation) => setCurrentView('validation_detail', { projectId: project.id, validationId: validation.id })}
                    />
                </TabsContent>
                
                <TabsContent value="files" className="mt-4">
                    <ProjectFilesTab
                        project={project}
                        userType="client"
                        onFileUpload={onFileUpload}
                        artifacts={projectArtifacts}
                        invoices={invoices}
                        contracts={contracts}
                        setCurrentView={setCurrentView}
                    />
                </TabsContent>
                
                <TabsContent value="financial" className="mt-4 space-y-6">
                   <ClientFinancialsTab project={project} invoices={invoices} />
                </TabsContent>

                 <TabsContent value="monitoring" className="mt-4">
                    <ClientMonitoringTab project={project} />
                </TabsContent>

                <TabsContent value="delivery" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Artefatos da Entrega Final</CardTitle>
                                    <CardDescription>Aqui estão todos os arquivos e links relacionados à entrega do seu projeto.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                     <ul className="space-y-3">
                                        <li className="flex items-center justify-between p-3 bg-sidebar/50 rounded-md border border-card-border">
                                            <div className="flex items-center gap-3"><Icon name="externalLink" className="h-5 w-5 text-accent"/><div><p className="font-medium">Link da Aplicação</p><p className="text-xs text-text-secondary">Acesse seu projeto online</p></div></div>
                                            <Button size="sm">Acessar</Button>
                                        </li>
                                        <li className="flex items-center justify-between p-3 bg-sidebar/50 rounded-md border border-card-border">
                                            <div className="flex items-center gap-3"><Icon name="package" className="h-5 w-5 text-accent"/><div><p className="font-medium">Código-Fonte (.zip)</p></div></div>
                                            <Button size="sm" variant="outline"><Icon name="download" className="h-4 w-4 mr-2"/>Baixar</Button>
                                        </li>
                                         <li className="flex items-center justify-between p-3 bg-sidebar/50 rounded-md border border-card-border">
                                            <div className="flex items-center gap-3"><Icon name="bookOpen" className="h-5 w-5 text-accent"/><div><p className="font-medium">Documentação (PDF)</p></div></div>
                                            <Button size="sm" variant="outline"><Icon name="download" className="h-4 w-4 mr-2"/>Baixar</Button>
                                        </li>
                                          <li className="flex items-center justify-between p-3 bg-sidebar/50 rounded-md border border-card-border">
                                            <div className="flex items-center gap-3"><Icon name="file-code" className="h-5 w-5 text-accent"/><div><p className="font-medium">Blueprint Digital (JSON)</p></div></div>
                                            <Button size="sm" variant="outline"><Icon name="download" className="h-4 w-4 mr-2"/>Baixar</Button>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1">
                            <Card className="h-full flex flex-col justify-between">
                                <CardHeader>
                                    <CardTitle>Aprovação da Entrega</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center flex-1 flex flex-col items-center justify-center">
                                {project.status === 'awaiting_delivery_approval' && (
                                     <>
                                        <h3 className="font-semibold text-lg">Pronto para aprovar?</h3>
                                        <p className="text-sm text-text-secondary mt-2 mb-6 max-w-md mx-auto">Após baixar e conferir os artefatos, aprove a entrega para concluir o projeto.</p>
                                        <div className="flex items-center justify-center space-x-2 mb-4">
                                            <Checkbox id="approval-check" checked={approvalChecked} onCheckedChange={(checked) => setApprovalChecked(Boolean(checked))} />
                                            <Label htmlFor="approval-check" className="text-sm font-medium">Li e conferi todos os entregáveis.</Label>
                                        </div>
                                    </>
                                )}
                                {project.status === 'completed' && (
                                     <>
                                        <Icon name="award" className="h-12 w-12 text-green-400 mx-auto mb-4" />
                                        <h3 className="font-semibold text-lg">Projeto Concluído!</h3>
                                        <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto">Este projeto foi concluído e aprovado com sucesso.</p>
                                    </>
                                )}
                                 {project.status === 'changes_requested' && (
                                    <>
                                        <Icon name="alertCircle" className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                                        <h3 className="font-semibold text-lg">Alterações Solicitadas</h3>
                                        <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto">Sua solicitação de alterações foi enviada para a equipe. Aguarde o retorno para uma nova versão.</p>
                                    </>
                                )}
                                </CardContent>
                                {project.status === 'awaiting_delivery_approval' && (
                                    <CardFooter className="flex justify-center gap-2">
                                        <Button variant="destructive" onClick={() => setShowRequestChangesDialog(true)}><Icon name="x" className="h-4 w-4 mr-2" />Solicitar Alterações</Button>
                                        <Button className="bg-green-600 hover:bg-green-700 gap-2" disabled={!approvalChecked} onClick={handleApproveClick}><Icon name="checkCircle" className="h-4 w-4" />Aprovar Entrega</Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
       </main>
    </div>
  );
};

export default ClientProjectDetailPage;