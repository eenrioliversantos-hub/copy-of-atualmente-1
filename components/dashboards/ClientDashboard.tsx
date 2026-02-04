
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import ClientDashboardPage from '../client/ClientDashboardPage';
import ClientProjectsPage from '../client/ClientProjectsPage';
import ClientContractsPage from '../client/ClientContractsPage';
import ClientInvoicesPage from '../client/ClientInvoicesPage';
import ClientSettingsPage from '../client/ClientSettingsPage';
import { 
    Proposal, Project, QuoteRequest, Contract, Invoice, ProjectArtifacts, 
    Message, Conversation, Appointment, SupportTicket, KnowledgeBaseArticle, Client, User 
} from '../../types';
import { TeamMember } from '../team/OperatorTeamPage';
import ClientProposalsPage from '../client/ClientProposalsPage';
import ClientValidationPage from '../client/ClientValidationPage';
import ClientProjectDetailPage from '../client/ClientProjectDetailPage';
import CommunicationHub from '../communication/CommunicationHub';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import ClientContractDetailPage from '../client/ClientContractDetailPage';
import ClientQuoteRequestsPage from '../client/ClientQuoteRequestsPage';
import QuoteRequestDetailPage from '../requests/QuoteRequestDetailPage';
import ProposalDetailPage from '../proposals/ProposalDetailPage';
import InvoiceDetailPage from '../invoices/InvoiceDetailPage';


interface ClientDashboardProps {
  onLogout: () => void;
  quoteRequests: QuoteRequest[];
  proposals: Proposal[];
  projects: Project[];
  contracts: Contract[];
  invoices: Invoice[];
  projectArtifacts: Record<string, ProjectArtifacts>;
  onApproveProposal: (proposal: Proposal) => void;
  onQuoteRequest: (requestData: Omit<QuoteRequest, 'id' | 'status' | 'createdAt'>) => void;
  onApproveValidation: (projectId: string, validationId: string) => void;
  onAssetSubmit: (projectId: string, assetId: string, value: string) => void;
  onApproveDelivery: (projectId: string) => void;
  onRequestChanges: (projectId: string, validationId: string, feedback: string) => void;
  onRequestDeliveryChanges: (projectId: string, feedback: string) => void;
  projectsForDelivery: Project[];
  onSignContract: (contractId: string) => void;
  onPayInvoice: (invoiceId: string) => void;
  onFileUpload: (projectId: string, file: File, description: string) => void;

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
        category: 'Geral', 
        items: [
            { id: 'dashboard', label: 'Dashboard', icon: 'home' },
            { id: 'projects', label: 'Projetos', icon: 'briefcase' },
        ]
    },
    { 
        category: 'Colaboração', 
        items: [
            { id: 'communication', label: 'Comunicação', icon: 'messageSquare' },
        ]
    },
    {
        category: 'Administrativo',
        items: [
            { id: 'quote_requests', label: 'Solicitações', icon: 'mail' },
            { id: 'proposals', label: 'Propostas', icon: 'file-text' },
            { id: 'contracts', label: 'Contratos', icon: 'book' },
            { id: 'invoices', label: 'Faturas', icon: 'creditCard' },
        ]
    }
];

const ClientDashboard: React.FC<ClientDashboardProps> = (props) => {
    const { onLogout, quoteRequests, proposals, projects, contracts, invoices, projectArtifacts, onApproveProposal, onQuoteRequest, onApproveValidation, onAssetSubmit, onApproveDelivery, onRequestChanges, onRequestDeliveryChanges, projectsForDelivery, onSignContract, onPayInvoice, onFileUpload } = props;
    const [view, setView] = useState('dashboard');
    const [context, setContext] = useState<any>({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSetView = (view: string, newContext = {}) => {
        setContext(newContext);
        setView(view);
        setIsSidebarOpen(false);
    };

    const clientProposals = (proposals || []).filter(p => p.status === 'sent' || p.status === 'approved');
    const pendingValidations = (projects || []).flatMap(p => (p.validations || []).filter(v => v.status === 'pending').map(v => ({ ...v, projectName: p.name, projectId: p.id })));
    const projectForAssets = (projects || []).find(p => p.status === 'in_progress' && (p.assets || []).some(a => a.status === 'pending'));

    const handleValidationApproval = (projectId: string, validationId: string) => {
        onApproveValidation(projectId, validationId);
        handleSetView('client_project_detail', { projectId });
    };

    const handleValidationChangesRequest = (projectId: string, validationId: string, feedback: string) => {
        onRequestChanges(projectId, validationId, feedback);
        handleSetView('client_project_detail', { projectId });
    };


    const renderContent = () => {
        switch (view) {
            case 'dashboard': return <ClientDashboardPage setView={handleSetView} onQuoteRequest={onQuoteRequest} pendingValidations={pendingValidations} projectForAssets={projectForAssets} projectsForDelivery={projectsForDelivery} projects={projects} />;
            case 'projects': return <ClientProjectsPage projects={projects} onProjectSelect={(projectId) => handleSetView('client_project_detail', { projectId })} />;
            case 'client_project_detail': {
                const project = projects.find(p => p.id === context.projectId);
                if (!project) return <div>Projeto não encontrado.</div>;
                const projectInvoices = invoices.filter(i => i.projectId === project.id);
                const projectContracts = contracts.filter(c => c.projectId === project.id);
                return <ClientProjectDetailPage 
                    project={project} 
                    invoices={projectInvoices}
                    contracts={projectContracts}
                    projectArtifacts={projectArtifacts?.[project.id]}
                    onBack={() => handleSetView('projects')} 
                    onAssetSubmit={onAssetSubmit} 
                    onApproveDelivery={onApproveDelivery} 
                    onRequestChanges={onRequestDeliveryChanges} 
                    onApproveValidation={onApproveValidation}
                    setCurrentView={handleSetView}
                    onFileUpload={onFileUpload}
                />;
            }
            case 'quote_requests': return <ClientQuoteRequestsPage quoteRequests={quoteRequests} onViewDetails={(quoteId) => handleSetView('quote_request_detail', { quoteId })} />;
            case 'quote_request_detail': {
                const quote = quoteRequests.find(q => q.id === context.quoteId);
                if (!quote) return <div>Solicitação não encontrada.</div>;
                const relatedProposal = proposals.find(p => p.quoteId === quote.id);
                return <QuoteRequestDetailPage quote={quote} onBack={() => handleSetView('quote_requests')} userType="client" relatedProposal={relatedProposal} />;
            }
            case 'proposals': return <ClientProposalsPage proposals={clientProposals} onApprove={onApproveProposal} onViewDetails={(proposalId) => handleSetView('proposal_detail', { proposalId })} />;
            case 'proposal_detail': {
                const proposal = proposals.find(p => p.id === context.proposalId);
                if (!proposal) return <div>Proposta não encontrada.</div>;
                const relatedQuote = quoteRequests.find(q => q.id === proposal.quoteId);
                return <ProposalDetailPage proposal={proposal} onBack={() => handleSetView('proposals')} userType="client" relatedQuote={relatedQuote} onApprove={onApproveProposal} />;
            }
            case 'contracts': return <ClientContractsPage contracts={contracts} onSign={onSignContract} onViewDetails={(contractId) => handleSetView('contract_detail', { contractId })} />;
            case 'contract_detail': {
                const contract = contracts.find(c => c.id === context.contractId);
                if (!contract) return <div>Contrato não encontrado.</div>;
                const linkedInvoices = invoices.filter(i => i.projectId === contract.projectId);
                return <ClientContractDetailPage contract={contract} invoices={linkedInvoices} onBack={() => handleSetView('contracts')} onSign={onSignContract} />;
            }
            case 'invoices': return <ClientInvoicesPage invoices={invoices} onPay={onPayInvoice} onViewDetails={(invoiceId) => handleSetView('invoice_detail', { invoiceId })} />;
             case 'invoice_detail': {
                const invoice = invoices.find(i => i.id === context.invoiceId);
                if (!invoice) return <div>Fatura não encontrada.</div>;
                const relatedProject = projects.find(p => p.id === invoice.projectId);
                return <InvoiceDetailPage invoice={invoice} onBack={() => handleSetView('invoices')} userType="client" relatedProject={relatedProject} onPay={onPayInvoice} />;
            }
            case 'communication': return <CommunicationHub onBack={() => handleSetView('dashboard')} {...props} />;
            case 'settings': return <ClientSettingsPage />;
            case 'validation_detail': {
                const project = projects.find(p => p.id === context.projectId);
                const validation = project?.validations.find(v => v.id === context.validationId);
                if (!project || !validation) return <div>Validação não encontrada.</div>;
                return <ClientValidationPage project={project} validation={validation} onBack={() => handleSetView('client_project_detail', { projectId: project.id })} onApprove={handleValidationApproval} onRequestChanges={handleValidationChangesRequest} />;
            }
            default: return <ClientDashboardPage setView={handleSetView} onQuoteRequest={onQuoteRequest} pendingValidations={pendingValidations} projectForAssets={projectForAssets} projectsForDelivery={projectsForDelivery} projects={projects} />;
        }
    };
    
    const fullScreenViews = ['validation_detail', 'client_project_detail', 'communication', 'contract_detail', 'quote_request_detail', 'proposal_detail', 'invoice_detail'];
    if (fullScreenViews.includes(view)) {
        return renderContent();
    }

    return (
        <div className="flex h-screen bg-background text-text-primary">
            <Sidebar 
                currentView={view}
                setCurrentView={handleSetView}
                navStructure={NAV_STRUCTURE}
                onLogout={onLogout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <Header 
                    title={NAV_STRUCTURE.flatMap(c => c.items).find(i => i.id === view)?.label || 'Dashboard'} 
                    onLogout={onLogout} 
                    setCurrentView={handleSetView}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};
export default ClientDashboard;
