
import React, { useState, useCallback } from 'react';
import LoginPage from './components/auth/LoginPage';
import OperatorDashboard from './components/dashboards/OperatorDashboard';
import ClientDashboard from './components/dashboards/ClientDashboard';
import TeamDashboard from './components/dashboards/TeamDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import { DPOProvider } from './contexts/DPOContext';
import { 
    Proposal, Project, QuoteRequest, Contract, Invoice, ProjectAsset, ProjectValidation, 
    DevelopmentPlan, ProjectArtifacts, Message, Conversation, Appointment, SupportTicket, 
    KnowledgeBaseArticle, Client, User, DevTask 
} from './types';
// FIX: Removed unused and non-exported type `OperatorTeamPageProps` from import statement.
import { TeamMember } from './components/team/OperatorTeamPage';
import { notificationService } from './services/notificationService';
import { NotificationType } from './types';

export type UserProfile = 'operator' | 'client' | 'team' | 'admin';

const initialQuoteRequests: QuoteRequest[] = [
    { id: 'QR-001', clientName: 'Empresa Y', projectName: 'Novo App de Logística', projectDescription: 'Preciso de um app para otimizar minhas entregas.', status: 'pending', createdAt: new Date().toISOString() },
    { id: 'QR-002', clientName: 'Startup Z', projectName: 'Plataforma de Cursos', projectDescription: 'Marketplace de cursos online.', status: 'converted', createdAt: new Date().toISOString() }
];

const initialProposals: Proposal[] = [
    { id: 'PROP-001', quoteId: 'QR-002', clientId: '1', clientName: 'Startup Z', title: 'Plataforma de Cursos', status: 'sent', description: 'Desenvolvimento da plataforma de cursos online com área de membros.', scopeDetails: { complexity: "Médio", estimatedHours: 250, timeline: "8-10 semanas", valueProposition: "Plataforma completa com painel de instrutor e aluno.", team: "1 Sênior, 2 Plenos"}, budget: 35000, deadline: '2024-10-30', projectName: 'Plataforma de Cursos' },
    { id: 'PROP-002', clientId: '2', clientName: 'Digital Innovations', title: 'Manutenção de E-commerce', status: 'approved', description: 'Manutenção e melhorias contínuas para a plataforma de e-commerce.', scopeDetails: { complexity: "Contínuo", estimatedHours: 40, timeline: "Mensal", valueProposition: "Suporte técnico e desenvolvimento de pequenas features.", team: "1 Pleno (part-time)"}, budget: 5000, deadline: '2024-08-15', projectId: 'PROJ-001', projectName: 'Manutenção de E-commerce' },
    { id: 'PROP-003', clientId: '3', clientName: 'Marketing Pro', title: 'Criação de Landing Page', status: 'draft', description: '', scopeDetails: {}, budget: 8000, deadline: '2024-09-01', projectName: 'Criação de Landing Page' },
];

const initialAssets: ProjectAsset[] = [
    { id: 'asset-logo', label: 'Logo da Empresa (SVG, PNG)', type: 'file', status: 'pending' },
    { id: 'asset-content', label: 'Conteúdo da Página "Sobre Nós"', type: 'text', status: 'pending' },
    { id: 'asset-api', label: 'Credenciais da API de Pagamento', type: 'credentials', status: 'pending' },
];

const initialContracts: Contract[] = [
    { id: 'CONTR-001', proposalId: 'PROP-002', projectId: 'PROJ-001', clientId: '2', clientName: 'Digital Innovations', amount: 30000, title: 'Contrato para Manutenção de E-commerce', terms: 'Termos padrão de serviço...', status: 'signed', signedAt: new Date().toISOString(), projectName: 'Manutenção de E-commerce' }
];

const initialInvoices: Invoice[] = [
    { id: 'FAT-001', clientId: '2', clientName: 'Digital Innovations', projectId: 'PROJ-001', projectName: 'Manutenção de E-commerce', amount: 2500, issueDate: '2024-07-01', dueDate: '2024-07-15', status: 'paid' },
    { id: 'FAT-002', clientId: '2', clientName: 'Digital Innovations', projectId: 'PROJ-001', projectName: 'Manutenção de E-commerce', amount: 2500, issueDate: '2024-08-01', dueDate: '2024-08-15', status: 'pending' }
];

const initialProjects: Project[] = [
    { 
        id: 'PROJ-001', 
        name: 'Manutenção de E-commerce', 
        description: 'Projeto de manutenção contínua', 
        client: 'Digital Innovations', 
        projectScope: 'client', 
        type: 'maintenance', 
        priority: 'high', 
        startDate: '2024-07-01', 
        endDate: '2024-12-31', 
        budget: '30000', 
        milestones: [], 
        teamMembers: [], 
        technologies: ['React', 'Node.js'], 
        features: [],
        status: 'in_progress',
        validations: [
            { id: 'VAL-001-1', type: 'phase_validation', targetId: 'fase-1', targetName: 'Fase 1: Blueprint', status: 'approved', requestedAt: '2024-06-25T10:00:00Z', respondedAt: '2024-06-28T14:00:00Z', data: { summary: 'Blueprint inicial aprovado.' } },
            { id: 'VAL-001-2', type: 'phase_validation', targetId: 'fase-2', targetName: 'Fase 2: Fundação (Setup)', status: 'approved', requestedAt: '2024-07-05T10:00:00Z', respondedAt: '2024-07-08T14:00:00Z', data: { summary: 'Setup do ambiente concluído.' } }
        ],
        assets: [
            { id: 'asset-logo-1', label: 'Logo da Empresa (SVG, PNG)', type: 'file', status: 'submitted', fileName: 'logo_digital_innovations.svg', sender: 'client', submittedBy: 'João Silva', size: 153600, submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'asset-content-1', label: 'Conteúdo da Página "Sobre Nós"', type: 'text', status: 'submitted', value: 'Somos uma empresa de inovação digital focada em...', sender: 'client', submittedBy: 'João Silva', submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'asset-api-1', label: 'Credenciais da API de Pagamento', type: 'credentials', status: 'submitted', value: 'sk_test_xxxxxxxxxx', sender: 'client', submittedBy: 'João Silva', submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'asset-wireframe-1', label: 'Wireframe Inicial', type: 'file', status: 'submitted', fileName: 'wireframe_v1.pdf', sender: 'operator', submittedBy: 'Carlos Silva', size: 819200, submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        ]
    },
    { 
        id: 'PROJ-002', 
        name: 'Plataforma de Cursos Online', 
        description: 'Desenvolvimento de um marketplace para cursos online', 
        client: 'Startup Z', 
        projectScope: 'client', 
        type: 'webapp', 
        priority: 'high', 
        startDate: '2024-07-15', 
        endDate: '2024-12-15', 
        budget: '75000', 
        milestones: [], 
        teamMembers: [], 
        technologies: ['Next.js', 'PostgreSQL', 'TailwindCSS'], 
        features: [],
        status: 'awaiting_validation',
        validations: [
             { id: 'VAL-002-1', type: 'phase_validation', targetId: 'fase-1', targetName: 'Fase 1: Blueprint', status: 'approved', requestedAt: '2024-07-16T10:00:00Z', respondedAt: '2024-07-18T11:00:00Z', data: { summary: 'Requisitos e arquitetura definidos.' } },
             { id: 'VAL-002-2', type: 'phase_validation', targetId: 'fase-2', targetName: 'Fase 2: Fundação (Setup)', status: 'pending', requestedAt: new Date().toISOString(), data: { summary: 'Ambiente de desenvolvimento, estrutura de pastas e CI/CD inicial configurados.' } }
        ],
        assets: initialAssets
    }
];

// --- MOCK DATA FOR COMMUNICATION HUB ---
const teamMembers: TeamMember[] = [
    { id: "op-1", name: "Carlos Silva (Operador)", role: "Tech Lead", email: "carlos@nexus.com", status: "active", projectsAssigned: 3, hourlyRate: 120, avatar: "", skills: ["React", "Node.js", "PostgreSQL", "AWS"] },
    { id: "dev-1", name: "Ana Santos (Dev)", role: "Frontend", email: "ana@nexus.com", status: "active", projectsAssigned: 2, hourlyRate: 80, avatar: "https://i.pravatar.cc/150?u=user-1", skills: ["React", "Vue.js", "Tailwind CSS"] },
];

const clients: Client[] = [
    { id: "client-1", name: "João Silva (Cliente)", company: "TechCorp Solutions", email: "joao@techcorp.com", phone: "(11) 99999-9999", status: "active", projects: 3, totalValue: "R$ 85.000", satisfaction: 4.9, lastContact: "2024-01-20", avatar: "https://i.pravatar.cc/150?u=user-client", tags: ["Premium", "Recorrente"] }
];

const initialConversations: Conversation[] = [
    { id: '1', name: 'Maria Oliveira (Cliente)', participants: [], project: 'Sistema ERP', avatarUrl: 'https://i.pravatar.cc/150?u=user-3', lastMessage: 'Claro, vou verificar e te retorno.', unreadCount: 2, lastMessageTimestamp: '10:42' },
    { id: '2', name: '#projeto-erp', participants: [], project: 'Sistema ERP', lastMessage: 'Carlos: O deploy foi concluído.', unreadCount: 0, lastMessageTimestamp: '09:15' },
    { id: '3', name: 'Carlos Silva (Dev)', participants: [], project: 'E-commerce', avatarUrl: 'https://i.pravatar.cc/150?u=user-4', lastMessage: 'Obrigado pelo feedback!', unreadCount: 0, lastMessageTimestamp: 'Ontem' },
];

const initialMessages: Record<string, Message[]> = {
    '1': [
        { id: 'm1-1', senderId: 'user-3', text: 'Olá João, tudo bem? Recebi sua dúvida sobre o relatório financeiro.', timestamp: '10:30' },
        { id: 'm1-2', senderId: 'me', text: 'Oi Maria, tudo ótimo! Sim, estou com uma questão na exportação para PDF.', timestamp: '10:35' },
        { id: 'm1-3', senderId: 'user-3', text: 'Claro, vou verificar e te retorno.', timestamp: '10:42' },
    ],
    '2': [{ id: 'm2-1', senderId: 'user-4', text: 'Carlos: O deploy foi concluído.', timestamp: '09:15' }],
    '3': [{ id: 'm3-1', senderId: 'user-4', text: 'Obrigado pelo feedback!', timestamp: 'Ontem' }],
};

const initialAppointments: Appointment[] = [
    { id: 'apt-1', title: 'Reunião de Acompanhamento - ERP', type: 'Acompanhamento', date: '2024-07-25', time: '14:00', with: ['Maria Oliveira'], notes: '' },
    { id: 'apt-2', title: 'Demonstração do Módulo de Vendas', type: 'Demonstração', date: '2024-08-01', time: '10:00', with: ['Carlos Silva'], notes: '' },
];

const initialTickets: SupportTicket[] = [
    { id: 'TKT-003', subject: 'Exportação de relatório não funciona', priority: 'Alta', description: '', status: 'Aberto', lastUpdate: '2h atrás', createdAt: '' },
    { id: 'TKT-002', subject: 'Dúvida sobre fatura FAT-003', priority: 'Média', description: '', status: 'Em Andamento', lastUpdate: '1 dia atrás', createdAt: '' },
    { id: 'TKT-001', subject: 'Erro ao fazer login', priority: 'Alta', description: '', status: 'Resolvido', lastUpdate: '3 dias atrás', createdAt: '' },
];

const initialKnowledgeBase: KnowledgeBaseArticle[] = [
    { id: 'kb-1', title: 'Como resetar sua senha', category: 'Conta', content: 'Você pode resetar sua senha na página de login clicando em "Esqueci minha senha". Um link de recuperação será enviado para o seu email.', tags: ['senha', 'conta'] },
    { id: 'kb-2', title: 'Acompanhando o progresso de um projeto', category: 'Projetos', content: 'Você pode ver o progresso detalhado na seção "Projetos". Lá você encontrará um dashboard com o status atual, marcos e tarefas concluídas.', tags: ['projeto', 'progresso'] },
    { id: 'kb-3', title: 'Como solicitar uma alteração', category: 'Projetos', content: 'A melhor forma é abrir um ticket de suporte nesta página ou enviar uma mensagem direta para o gerente do seu projeto na seção "Mensagens".', tags: ['alteração', 'suporte'] },
];

const App: React.FC = () => {
  const [loggedInProfile, setLoggedInProfile] = useState<UserProfile | null>(null);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(initialQuoteRequests);
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [projectArtifacts, setProjectArtifacts] = useState<Record<string, ProjectArtifacts>>({
    'PROJ-001': { commitHistory: [] },
    'PROJ-002': { commitHistory: [] },
  });
  
  // Communication Hub State
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const knowledgeBase = initialKnowledgeBase; // Static for now

  const handleLogin = (profile: UserProfile) => {
    setLoggedInProfile(profile);
  };

  const handleLogout = () => {
    setLoggedInProfile(null);
  }

  const handleQuoteRequest = (requestData: Omit<QuoteRequest, 'id' | 'status' | 'createdAt'>) => {
      const newRequest: QuoteRequest = {
        ...requestData,
        id: `QR-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setQuoteRequests(prev => [newRequest, ...prev]);
      notificationService.create(NotificationType.ASSET_REQUESTED, {
          clientName: newRequest.clientName,
          projectName: newRequest.projectName,
      });
      alert('Solicitação de orçamento enviada com sucesso!');
  };

  const handleCreateProposalFromEstimator = (quote: QuoteRequest, estimatorData: any) => {
    const newProposal: Proposal = {
        id: `PROP-${Date.now()}`,
        quoteId: quote.id,
        clientId: 'mock-client-id',
        clientName: quote.clientName,
        title: quote.projectName,
        projectName: quote.projectName,
        description: quote.projectDescription,
        scopeDetails: {
          complexity: estimatorData.complexity,
          estimatedHours: estimatorData.estimatedHours,
          timeline: estimatorData.timeline,
          valueProposition: estimatorData.valueProposition,
          team: estimatorData.team,
        },
        budget: estimatorData.finalPrice, 
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
    };
    
    setProposals(prev => [...prev, newProposal]);
    setQuoteRequests(prev => prev.map(q => q.id === quote.id ? { ...q, status: 'converted' } : q));
    alert(`Proposta "${newProposal.title}" criada em rascunho. Envie ao cliente pela página de Propostas.`);
  };

  const handleSendProposal = (proposalId: string) => {
    setProposals(prev => prev.map(p => {
        if (p.id === proposalId) {
             notificationService.create(NotificationType.PROPOSAL_SENT, {
                proposalId: p.id,
                proposalTitle: p.title,
            });
            return { ...p, status: 'sent' };
        }
        return p;
    }));
    alert('Proposta enviada ao cliente!');
  };

  const handleApproveProposal = (proposal: Proposal) => {
    const updatedProposals = proposals.map(p => p.id === proposal.id ? { ...p, status: 'approved' as 'approved' } : p);
    setProposals(updatedProposals);
    notificationService.create(NotificationType.PROPOSAL_APPROVED, {
        proposalTitle: proposal.title,
        clientName: proposal.clientName,
    });
    const newProject: Project = {
      id: `PROJ-${Date.now()}`,
      name: proposal.title,
      description: proposal.description || `Projeto gerado a partir da proposta ${proposal.id}`,
      client: proposal.clientName,
      projectScope: 'client', type: 'webapp', priority: 'medium',
      startDate: new Date().toISOString().split('T')[0],
      endDate: proposal.deadline,
      budget: String(proposal.budget),
      estimatedHours: String(proposal.scopeDetails?.estimatedHours || 0),
      milestones: [], teamMembers: [], technologies: [], features: [],
      status: 'planning', validations: [], assets: initialAssets,
    };
    setProjects(prev => [...prev, newProject]);
    const newContract: Contract = {
        id: `CONTR-${Date.now()}`,
        proposalId: proposal.id,
        projectId: newProject.id,
        projectName: newProject.name,
        clientId: proposal.clientId,
        clientName: proposal.clientName,
        amount: proposal.budget,
        title: `Contrato para ${newProject.name}`,
        terms: "Termos padrão de serviço...",
        status: 'pending',
    };
    setContracts(prev => [...prev, newContract]);
    const newInvoice: Invoice = {
        id: `FAT-${Date.now()}`,
        clientId: proposal.clientId,
        clientName: proposal.clientName,
        projectId: newProject.id,
        projectName: newProject.name,
        amount: proposal.budget * 0.30,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending',
    };
    setInvoices(prev => [...prev, newInvoice]);
    notificationService.create(NotificationType.INVOICE_GENERATED, {
        invoiceId: newInvoice.id,
        projectName: newProject.name,
    });
    alert(`Proposta aprovada! Projeto "${newProject.name}" foi criado. Contrato e fatura inicial gerados.`);
  };

  const handleRequestValidation = (projectId: string, targetId: string, targetName: string, data: any) => {
      setProjects(prev => prev.map(p => {
          if (p.id === projectId) {
              const newValidation: ProjectValidation = {
                  id: `VAL-${Date.now()}`,
                  type: 'phase_validation',
                  targetId, targetName, status: 'pending',
                  requestedAt: new Date().toISOString(),
                  data: data,
              };
              const otherValidations = p.validations.filter(v => v.targetId !== targetId);
              notificationService.create(NotificationType.VALIDATION_REQUESTED, {
                  projectName: p.name,
                  phaseName: targetName,
                  projectId: p.id,
                  validationId: newValidation.id,
              });
              return { ...p, status: 'awaiting_validation', validations: [...otherValidations, newValidation] };
          }
          return p;
      }));
      alert(`Fase "${targetName}" enviada para validação do cliente.`);
  };

  const handleApproveValidation = (projectId: string, validationId: string) => {
      setProjects(prev => prev.map(p => {
          if (p.id === projectId) {
              const validation = p.validations.find(v => v.id === validationId);
              if (validation) {
                notificationService.create(NotificationType.VALIDATION_APPROVED, {
                    projectName: p.name,
                    phaseName: validation.targetName,
                });
              }
              return { ...p, status: 'in_progress', validations: p.validations.map(v => v.id === validationId ? { ...v, status: 'approved', respondedAt: new Date().toISOString() } : v) };
          }
          return p;
      }));
      alert('Validação aprovada! O projeto pode prosseguir.');
  };
  
  const handleAssetSubmit = (projectId: string, assetId: string, value: string) => {
     setProjects(prev => prev.map(p => {
          if (p.id === projectId) {
              const asset = p.assets.find(a => a.id === assetId);
              if (asset) {
                  notificationService.create(NotificationType.ASSET_SUBMITTED, {
                      assetLabel: asset.label,
                      projectName: p.name,
                  });
              }
              return { ...p, assets: p.assets.map(a => a.id === assetId ? { ...a, status: 'submitted', value: value, submittedAt: new Date().toISOString() } : a) };
          }
          return p;
      }));
      alert('Ativo enviado com sucesso!');
  };

  const handleFileUpload = (projectId: string, file: File, description: string) => {
    setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
            const newAsset: ProjectAsset = {
                id: `asset-${Date.now()}`,
                label: description || file.name,
                type: 'file',
                status: 'submitted',
                fileName: file.name,
                submittedAt: new Date().toISOString(),
                sender: loggedInProfile === 'client' ? 'client' : 'operator',
                submittedBy: loggedInProfile === 'client' ? 'João Silva (Cliente)' : 'Carlos Silva (Operador)',
                size: file.size,
            };
            return { ...p, assets: [...p.assets, newAsset] };
        }
        return p;
    }));
    alert(`Arquivo "${file.name}" enviado com sucesso!`);
  };
  
  const handleArtifactsUpdate = useCallback((projectId: string, updates: Partial<ProjectArtifacts>) => {
     setProjectArtifacts(prev => {
         const existingArtifacts = prev[projectId] || {};
         return { ...prev, [projectId]: { ...existingArtifacts, ...updates } }
     });
  }, []);

// FIX: Update function signature to accept `message` to align with downstream component types.
  const handleSendFinalProduct = (projectId: string, message: string) => {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'awaiting_delivery_approval' } : p));
      
      notificationService.create(NotificationType.DELIVERY_READY_FOR_APPROVAL, {
          projectName: project.name,
          projectId: project.id,
      });
      
      alert('Produto final enviado para aprovação do cliente!');
  };

  const handleApproveDelivery = (projectId: string) => {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'completed' } : p));
      alert('Entrega aprovada! O projeto foi concluído.');
  };
  
  const handleRequestDeliveryChanges = (projectId: string, feedback: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'changes_requested' } : p));
    notificationService.create(NotificationType.DELIVERY_CHANGES_REQUESTED, {
        projectName: projects.find(p=>p.id === projectId)?.name,
        projectId: projectId,
        feedback: feedback,
    });
    alert('Solicitação de alterações enviada.');
  };

  const handleRequestChanges = (projectId: string, validationId: string, feedback: string) => {
    setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
            return { ...p, status: 'changes_requested', validations: p.validations.map(v => v.id === validationId ? {...v, status: 'changes_requested', feedback, respondedAt: new Date().toISOString() } : v) };
        }
        return p;
    }));
    alert('Solicitação de alterações enviada.');
  };
  
  const handleSignContract = (contractId: string) => {
    setContracts(prev => prev.map(c => {
        if (c.id === contractId) {
            notificationService.create(NotificationType.CONTRACT_SIGNED, {
                contractTitle: c.title,
                clientName: c.clientName,
            });
            return { ...c, status: 'signed', signedAt: new Date().toISOString() };
        }
        return c;
    }));
    alert('Contrato assinado!');
  };

  const handlePayInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(i => i.id === invoiceId ? { ...i, status: 'paid' } : i));
    alert('Pagamento realizado!');
  };

  const handleMarkInvoiceAsPaid = (invoiceId: string) => {
    setInvoices(prev => prev.map(i => i.id === invoiceId ? { ...i, status: 'paid' } : i));
    alert('Fatura marcada como paga.');
  };

  const handleStartConstruction = (projectId: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'in_progress' } : p));
  };

  const handleCommitChanges = (projectId: string, taskId: string, message: string) => {
    handleArtifactsUpdate(projectId, {
        commitHistory: [
            ...(projectArtifacts[projectId]?.commitHistory || []),
            { hash: (Math.random() + 1).toString(36).substring(7), message, author: 'Operador', date: new Date().toISOString() }
        ]
    });

    const plan = projectArtifacts[projectId]?.developmentPlan;
    if (!plan) return;

    const newPlan = JSON.parse(JSON.stringify(plan)) as DevelopmentPlan;
    let taskFound = false;

    const findAndUpdate = (tasks: DevTask[]) => {
      const targetTask = tasks.find(t => t.id === taskId);
      if (targetTask) {
        targetTask.status = 'done';
        targetTask.subTasks.forEach(st => st.status = 'done');
        taskFound = true;
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
      handleArtifactsUpdate(projectId, { developmentPlan: newPlan });
    }
  };

  // --- COMMUNICATION HUB HANDLERS ---
  const handleSendMessage = (conversationId: string, text: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));
  };

  const handleScheduleAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
        ...appointmentData,
        id: `apt-${Date.now()}`
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const handleCreateTicket = (ticketData: Omit<SupportTicket, 'id' | 'status' | 'lastUpdate' | 'createdAt'>) => {
    const newTicket: SupportTicket = {
        ...ticketData,
        id: `TKT-${Date.now()}`,
        status: 'Aberto',
        lastUpdate: 'agora',
        createdAt: new Date().toISOString(),
    };
    setTickets(prev => [newTicket, ...prev]);
  };


  const renderDashboard = () => {
    const commsProps = {
        conversations, messages, appointments, tickets, knowledgeBase, teamMembers, clients,
        onSendMessage: handleSendMessage,
        onScheduleAppointment: handleScheduleAppointment,
        onCreateTicket: handleCreateTicket
    };

    switch (loggedInProfile) {
      case 'operator':
        return <OperatorDashboard 
                    onLogout={handleLogout} 
                    quoteRequests={quoteRequests}
                    proposals={proposals} 
                    projects={projects} 
                    contracts={contracts}
                    invoices={invoices}
                    artifacts={projectArtifacts}
                    onCreateProposalFromEstimator={handleCreateProposalFromEstimator}
                    onSendProposal={handleSendProposal} 
                    onRequestValidation={handleRequestValidation}
                    onArtifactsUpdate={handleArtifactsUpdate}
                    onSendFinalProduct={handleSendFinalProduct}
                    onMarkInvoiceAsPaid={handleMarkInvoiceAsPaid}
                    onFileUpload={handleFileUpload}
                    onStartConstruction={handleStartConstruction}
                    onCommitChanges={handleCommitChanges}
                    {...commsProps}
                />;
      case 'client':
        return <ClientDashboard 
                    onLogout={handleLogout} 
                    quoteRequests={quoteRequests}
                    proposals={proposals} 
                    projects={projects} 
                    contracts={contracts}
                    invoices={invoices}
                    projectArtifacts={projectArtifacts}
                    onApproveProposal={handleApproveProposal} 
                    onQuoteRequest={handleQuoteRequest} 
                    onApproveValidation={handleApproveValidation}
                    onAssetSubmit={handleAssetSubmit}
                    onApproveDelivery={handleApproveDelivery}
                    onRequestChanges={handleRequestChanges}
                    onRequestDeliveryChanges={handleRequestDeliveryChanges}
                    projectsForDelivery={(projects || []).filter(p => p.status === 'awaiting_delivery_approval')}
                    onSignContract={handleSignContract}
                    onPayInvoice={handlePayInvoice}
                    onFileUpload={handleFileUpload}
                    {...commsProps}
                />;
      case 'team':
        return <TeamDashboard onLogout={handleLogout} {...commsProps} />;
      case 'admin':
        return <AdminDashboard onLogout={handleLogout} {...commsProps} />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  }

  const renderContent = () => {
    if (!loggedInProfile) {
      return <LoginPage onLogin={handleLogin} />;
    }
    return renderDashboard();
  }

  return (
    <DPOProvider projectArtifacts={projectArtifacts} handleArtifactsUpdate={handleArtifactsUpdate}>
      {renderContent()}
    </DPOProvider>
  );
};

export default App;
