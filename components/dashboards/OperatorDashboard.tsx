
import React, { useState, useEffect } from 'react';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import DashboardPage from '../dashboard/DashboardPage';
import ProjectPage from '../projects/ProjectPage';
import NewProjectPage from '../projects/NewProjectPage';
import OperatorClientsPage from '../clients/OperatorClientsPage';
import OperatorTeamPage from '../team/OperatorTeamPage';
import OperatorAnalyticsPage from '../analytics/OperatorAnalyticsPage';
import OperatorSettingsPage from '../settings/OperatorSettingsPage';
import AcademyPage from '../academy/AcademyPage';
import ModelingPage from '../modeling/ModelingPage';
import OperatorWorkspace from '../workspace/OperatorWorkspace';
import BackendDesignSystem from '../design-system/BackendDesignSystem';
import DatabaseDesignSystem from '../design-system/DatabaseDesignSystem';
import Laboratory from '../academy/Laboratory';
import Playground from '../academy/Playground';
import AlquimistaWeb from '../academy/AlquimistaWeb';
import NewSessionPage from '../workspace/NewSessionPage';
import ModuleWrapper from '../workspace/ModuleWrapper';
import FromTemplateModule from '../workspace/modules/FromTemplateModule';
import MaintenanceModule from '../workspace/modules/MaintenanceModule';
import ImportModelingModule from '../workspace/modules/ImportModelingModule';
import OperatorReportsPage from '../reports/OperatorReportsPage';
import LearningPathPage from '../academy/LearningPathPage';
import CourseDetailPage from '../academy/CourseDetailPage';
import ConstructionHub from '../production/ConstructionHub';
import { 
    Project, Proposal, QuoteRequest, Contract, Invoice, ProjectArtifacts, 
    Message, Conversation, Appointment, SupportTicket, KnowledgeBaseArticle, Client 
} from '../../types';
import { TeamMember } from '../team/OperatorTeamPage';
import { Button } from '../ui/Button';
import OperatorProposalsPage from '../proposals/OperatorProposalsPage';
import OperatorInvoicesPage from '../invoices/OperatorInvoicesPage';
import OperatorQuoteRequestsPage from '../requests/OperatorQuoteRequestsPage';
import OperatorContractsPage from '../contracts/OperatorContractsPage';
import QuoteEstimatorPage from '../proposals/QuoteEstimatorPage';
import CommunicationHub from '../communication/CommunicationHub';
import OperatorContractDetailPage from '../contracts/OperatorContractDetailPage';
import QuoteRequestDetailPage from '../requests/QuoteRequestDetailPage';
import ProposalDetailPage from '../proposals/ProposalDetailPage';
import InvoiceDetailPage from '../invoices/InvoiceDetailPage';
import DevelopmentPlanTool from '../modeling/generation/DevelopmentPlanTool';
import DevelopmentCockpit from '../development/DevelopmentCockpit';
import ProductionPage from '../production/ProductionPage';
import DeliveryWizardPage from '../projects/DeliveryWizardPage';


interface OperatorDashboardProps {
  onLogout: () => void;
  quoteRequests: QuoteRequest[];
  proposals: Proposal[];
  projects: Project[];
  contracts: Contract[];
  invoices: Invoice[];
  artifacts: Record<string, ProjectArtifacts>;
  onCreateProposalFromEstimator: (quote: QuoteRequest, estimatorData: any) => void;
  onSendProposal: (proposalId: string) => void;
  onRequestValidation: (projectId: string, targetId: string, targetName: string, data: any) => void;
  onArtifactsUpdate: (projectId: string, updates: Partial<ProjectArtifacts>) => void;
  onSendFinalProduct: (projectId: string, message: string) => void;
  onMarkInvoiceAsPaid: (invoiceId: string) => void;
  onFileUpload: (projectId: string, file: File, description: string) => void;
  onStartConstruction: (projectId: string) => void;
  onCommitChanges: (projectId: string, taskId: string, message: string) => void;

  // Communication Hub Props
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  appointments: Appointment[];
  tickets: SupportTicket[];
  knowledgeBase: KnowledgeBaseArticle[];
  teamMembers: TeamMember[];
  clients: Client[];
  onSendMessage: (conversationId: string, text: string) => void;
  onScheduleAppointment: (appointmentData: Omit<Appointment, 'id'>) => void;
  onCreateTicket: (ticketData: Omit<SupportTicket, 'id' | 'status' | 'lastUpdate' | 'createdAt'>) => void;
}

const NAV_STRUCTURE = [
    { 
        category: 'Operações de Fábrica', 
        items: [
            { id: 'dashboard', label: 'Centro de Comando', icon: 'activity' },
            { id: 'projects', label: 'Linhas de Produção', icon: 'server' },
            { id: 'workspace', label: 'Engenharia & R&D', icon: 'cpu' },
        ]
    },
    { 
        category: 'Gestão de Recursos', 
        items: [
            { id: 'team', label: 'Especialistas', icon: 'users' },
            { id: 'clients', label: 'Parceiros', icon: 'briefcase' },
            { id: 'analytics', label: 'Métricas de Fábrica', icon: 'barChart' },
        ]
    },
    {
        category: 'Comercial & Contratos',
        items: [
            { id: 'quote_requests', label: 'Novas Demandas', icon: 'inbox' },
            { id: 'proposals', label: 'Projetos em Negociação', icon: 'file-text' },
            { id: 'invoices', label: 'Faturamento', icon: 'dollar-sign' },
        ]
    },
    {
        category: 'Conhecimento',
        items: [
             { id: 'academy', label: 'Universidade Nexus', icon: 'graduationCap' },
        ]
    }
];

const FromTemplateModulePhases = [
  { id: 'upload', title: 'Upload do Template', icon: 'upload' },
  { id: 'analysis', title: 'Diagnóstico', icon: 'search' },
  { id: 'adaptation', title: 'Plano de Adaptação', icon: 'settings' },
  { id: 'integration', title: 'Integração e Passos', icon: 'code' },
];
const MaintenanceModulePhases = [
  { id: 'current-analysis', title: 'Análise do Sistema Atual', icon: 'search' },
  { id: 'problem-identification', title: 'Identificação de Problemas', icon: 'alertCircle' },
  { id: 'upgrade-suggestions', title: 'Sugestões de Atualização', icon: 'trendingUp' },
  { id: 'action-plan', title: 'Plano de Ação', icon: 'clock' },
];
const ImportModulePhases = [
  { id: 'import', title: 'Importação de Dados', icon: 'upload' },
  { id: 'validation', title: 'Validação', icon: 'checkCircle' },
  { id: 'continuation', title: 'Continuação do Fluxo', icon: 'cog' },
];


const OperatorDashboard: React.FC<OperatorDashboardProps> = (props) => {
    const { onLogout, quoteRequests, proposals, projects: initialProjects, contracts, invoices, artifacts, onCreateProposalFromEstimator, onSendProposal, onRequestValidation, onArtifactsUpdate, onSendFinalProduct, onMarkInvoiceAsPaid, onFileUpload, onCommitChanges } = props;
    const [currentView, setCurrentView] = useState('dashboard');
    const [context, setContext] = useState<any>({});
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setProjects(initialProjects);
    }, [initialProjects]);

    const handleSetView = (view: string, newContext = {}) => {
        setContext(newContext);
        setCurrentView(view);
        setIsSidebarOpen(false); // Close mobile sidebar on view change
    };

    const handleCreateProject = (projectData: Omit<Project, 'id'>) => {
        const newProject: Project = {
            ...projectData,
            id: `proj-${Date.now()}`,
            status: 'planning',
            validations: [],
            assets: [],
        };
        setProjects(prev => [...prev, newProject]);
        handleSetView('construction_hub', { projectId: newProject.id });
    };

    const handleUpdateProject = (updatedProject: Project) => {
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        handleSetView('construction_hub', { projectId: updatedProject.id });
    };

    const handleDeleteProject = (projectId: string) => {
        if (window.confirm("Tem certeza que deseja desmontar esta linha de produção? A ação não pode ser desfeita.")) {
            setProjects(prev => prev.filter(p => p.id !== projectId));
            handleSetView('projects');
        }
    };

    const handleNavigateToEstimator = (quoteId: string) => {
        const quote = quoteRequests.find(q => q.id === quoteId);
        if (quote) {
            handleSetView('quote_estimator', { quote });
        }
    };

    const handleStartConstruction = (projectId: string, taskId?: string) => {
        props.onStartConstruction(projectId);
        handleSetView('development_cockpit', { projectId, taskId });
    };
    
    const handleCommitAndNavigate = (projectId: string, taskId: string, message: string) => {
        onCommitChanges(projectId, taskId, message);
        // This is the key change: navigate to the production page after commit
        handleSetView('production_page', { projectId });
    };


    const renderContent = () => {
        switch (currentView) {
            case 'dashboard': return <DashboardPage />;
            case 'workspace': return <OperatorWorkspace setCurrentView={handleSetView} />;
            case 'projects': return <ProjectPage 
                                        projects={projects} 
                                        onNewProject={() => handleSetView('new_project')} 
                                        onProjectSelect={(project) => handleSetView('construction_hub', { projectId: project.id })}
                                        onEdit={(projectId) => handleSetView('edit_project', { projectId })}
                                        onDelete={handleDeleteProject}
                                    />;
            case 'new_project': return <NewProjectPage onBack={() => handleSetView('projects')} onSave={handleCreateProject} />;
            case 'edit_project': {
                const projectToEdit = projects.find(p => p.id === context.projectId);
                return <NewProjectPage onBack={() => handleSetView('construction_hub', { projectId: context.projectId })} onSave={handleUpdateProject} initialData={projectToEdit} />;
            }
            case 'clients': return <OperatorClientsPage />;
            case 'quote_requests': return <OperatorQuoteRequestsPage quoteRequests={quoteRequests} onCreateProposal={handleNavigateToEstimator} onViewDetails={(quoteId) => handleSetView('quote_request_detail', { quoteId })} />;
            case 'quote_request_detail': {
                const quote = quoteRequests.find(q => q.id === context.quoteId);
                if (!quote) return <div>Solicitação não encontrada.</div>;
                const relatedProposal = proposals.find(p => p.quoteId === quote.id);
                return <QuoteRequestDetailPage quote={quote} onBack={() => handleSetView('quote_requests')} userType="operator" onCreateProposal={handleNavigateToEstimator} relatedProposal={relatedProposal} />;
            }
            case 'quote_estimator': return <QuoteEstimatorPage quoteRequest={context.quote} onBack={() => handleSetView('quote_requests')} onGenerateProposal={(estimatorData) => { onCreateProposalFromEstimator(context.quote, estimatorData); handleSetView('proposals'); }} />;
            case 'proposals': return <OperatorProposalsPage proposals={proposals} onSend={onSendProposal} onViewDetails={(proposalId) => handleSetView('proposal_detail', { proposalId })} />;
            case 'proposal_detail': {
                const proposal = proposals.find(p => p.id === context.proposalId);
                if (!proposal) return <div>Proposta não encontrada.</div>;
                const relatedQuote = quoteRequests.find(q => q.id === proposal.quoteId);
                return <ProposalDetailPage proposal={proposal} onBack={() => handleSetView('proposals')} userType="operator" relatedQuote={relatedQuote} onSend={onSendProposal} />;
            }
            case 'contracts': return <OperatorContractsPage contracts={contracts} onViewDetails={(contractId) => handleSetView('operator_contract_detail', { contractId })} />;
            case 'operator_contract_detail': {
                const contract = contracts.find(c => c.id === context.contractId);
                if (!contract) return <div>Contrato não encontrado.</div>;
                const linkedInvoices = invoices.filter(i => i.projectId === contract.projectId);
                return <OperatorContractDetailPage 
                            contract={contract} 
                            invoices={linkedInvoices} 
                            onBack={() => handleSetView('contracts')} 
                        />;
            }
            case 'invoices': return <OperatorInvoicesPage invoices={invoices} onMarkInvoiceAsPaid={onMarkInvoiceAsPaid} onViewDetails={(invoiceId) => handleSetView('invoice_detail', { invoiceId })} />;
            case 'invoice_detail': {
                const invoice = invoices.find(i => i.id === context.invoiceId);
                if (!invoice) return <div>Fatura não encontrada.</div>;
                const relatedProject = projects.find(p => p.id === invoice.projectId);
                return <InvoiceDetailPage invoice={invoice} onBack={() => handleSetView('invoices')} userType="operator" relatedProject={relatedProject} onMarkAsPaid={onMarkInvoiceAsPaid} />;
            }
            case 'team': return <OperatorTeamPage />;
            case 'analytics': return <OperatorAnalyticsPage />;
            case 'academy': return <AcademyPage setCurrentView={handleSetView} />;
            case 'learning_path': return <LearningPathPage pathId={context.pathId} onBack={() => handleSetView('academy')} />;
            case 'academy_course_detail': return <CourseDetailPage courseId={context.courseId} onBack={() => handleSetView('academy')} />;
            case 'settings': return <OperatorSettingsPage />;
            case 'modeling_hub': {
                const project = projects.find(p => p.id === context.project.id);
                if (!project) return <div>Projeto não encontrado.</div>;
                
                // Get existing wizard data if available to allow editing
                const existingWizardData = artifacts[project.id]?.wizardData;

                return <ModelingPage 
                    onBack={() => handleSetView('construction_hub', { projectId: project.id })} 
                    setCurrentView={handleSetView} 
                    project={project}
                    onArtifactsUpdate={onArtifactsUpdate}
                    existingWizardData={existingWizardData}
                />;
            }
            case 'backend_design_system': return <BackendDesignSystem onBack={() => handleSetView('workspace')} />;
            case 'database_design_system': return <DatabaseDesignSystem onBack={() => handleSetView('workspace')} setEntitiesData={() => {}} />;
            case 'laboratory': return <Laboratory onBack={() => handleSetView('workspace')} />;
            case 'playground': return <Playground onBack={() => handleSetView('workspace')} />;
            case 'alquimista_web': return <AlquimistaWeb onBack={() => handleSetView('workspace')} />;
            case 'construction_hub': {
                const project = projects.find(p => p.id === context.projectId);
                if (!project) {
                     return (
                        <div className="text-center p-8">
                            <h2 className="text-xl font-semibold">Projeto não encontrado</h2>
                            <Button onClick={() => handleSetView('projects')} className="mt-4">Voltar para a lista</Button>
                        </div>
                    );
                }
                const projectArtifact = artifacts[project.id];
                const projectInvoices = invoices.filter(i => i.projectId === project.id);
                const projectContracts = contracts.filter(c => c.projectId === project.id);
                return <ConstructionHub 
                            onBack={() => handleSetView('projects')} 
                            setCurrentView={handleSetView} 
                            project={project}
                            invoices={projectInvoices}
                            contracts={projectContracts}
                            developmentPlan={projectArtifact?.developmentPlan}
                            wizardData={projectArtifact?.wizardData}
                            onRequestValidation={onRequestValidation}
                            onArtifactsUpdate={onArtifactsUpdate}
                            onFileUpload={onFileUpload}
                            onSendFinalProduct={(projectId) => onSendFinalProduct(projectId, 'Entrega final via Hub de Construção.')}
                        />;
            }
            case 'development_plan_tool': {
                const project = projects.find(p => p.id === context.projectId);
                const projectArtifact = artifacts[context.projectId];
                if (!project || !projectArtifact?.developmentPlan) return <div>Plano de desenvolvimento não encontrado.</div>;
                return <DevelopmentPlanTool 
                    plan={projectArtifact.developmentPlan}
                    wizardData={projectArtifact.wizardData}
                    project={project}
                    onArtifactsUpdate={onArtifactsUpdate}
                    setCurrentView={handleSetView}
                    onBack={() => handleSetView('construction_hub', { projectId: context.projectId })}
                    onStartConstruction={(taskId) => handleStartConstruction(project.id, taskId)}
                />;
            }
            case 'development_cockpit': {
                const project = projects.find(p => p.id === context.projectId);
                const projectArtifact = artifacts[context.projectId];
                if (!project || !projectArtifact?.developmentPlan) return <div>Projeto ou plano não encontrado.</div>;
                return <DevelopmentCockpit
                    project={project}
                    plan={projectArtifact.developmentPlan}
                    wizardData={projectArtifact.wizardData}
                    onBack={() => handleSetView('development_plan_tool', { projectId: context.projectId })}
                    onCommit={handleCommitAndNavigate}
                    initialTaskId={context.taskId}
                />
            }
            case 'production_page': {
                 const project = projects.find(p => p.id === context.projectId);
                if (!project) return <div>Projeto não encontrado.</div>;
                return <ProductionPage
                    project={project}
                    onBack={() => handleSetView('construction_hub', { projectId: context.projectId })}
                    onPrepareDelivery={() => handleSetView('delivery_wizard', { projectId: project.id })}
                />
            }
            case 'delivery_wizard': {
                const project = projects.find(p => p.id === context.projectId);
                if (!project) return <div>Projeto não encontrado.</div>;
                return <DeliveryWizardPage
                    project={project}
                    onBack={() => handleSetView('production_page', { projectId: project.id })}
                    onSend={onSendFinalProduct}
                />
            }
            case 'new_session': return <NewSessionPage setCurrentView={handleSetView} />;
            case 'template_module': return <ModuleWrapper title="Módulo: Template" icon="layoutTemplate" phases={FromTemplateModulePhases} ModuleComponent={FromTemplateModule} onBack={() => handleSetView('new_session')} />;
            case 'maintenance_module': return <ModuleWrapper title="Módulo: Manutenção" icon="wrench" phases={MaintenanceModulePhases} ModuleComponent={MaintenanceModule} onBack={() => handleSetView('new_session')} />;
            case 'import_module': return <ModuleWrapper title="Módulo: Importar" icon="upload" phases={ImportModulePhases} ModuleComponent={ImportModelingModule} onBack={() => handleSetView('new_session')} />;
            case 'communication': return <CommunicationHub onBack={() => handleSetView('dashboard')} {...props} />;
            case 'reports': return <OperatorReportsPage />;
            default: return <DashboardPage />;
        }
    };
    
    // Views that take full screen and don't need the shell (or handle their own layout)
    const fullScreenViews = [
        'learning_path', 'academy_course_detail', 'modeling_hub', 'backend_design_system', 'database_design_system', 
        'laboratory', 'playground', 'alquimista_web', 'construction_hub', 'development_plan_tool', 
        'development_cockpit', 'production_page', 'delivery_wizard', 'new_project', 'edit_project',
        'template_module', 'maintenance_module', 'import_module', 'quote_estimator', 
        'communication', 'operator_contract_detail', 'quote_request_detail', 'proposal_detail', 'invoice_detail'
    ];

    if (fullScreenViews.includes(currentView)) {
        return renderContent();
    }

    return (
        <div className="flex h-screen bg-background text-text-primary">
            <Sidebar 
                currentView={currentView}
                setCurrentView={handleSetView}
                navStructure={NAV_STRUCTURE}
                onLogout={onLogout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <Header 
                    title={NAV_STRUCTURE.flatMap(c => c.items).find(i => i.id === currentView)?.label || 'Centro de Comando'} 
                    onLogout={onLogout} 
                    setCurrentView={handleSetView}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="max-w-7xl mx-auto w-full">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OperatorDashboard;
