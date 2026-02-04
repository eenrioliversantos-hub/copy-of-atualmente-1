
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Card, CardContent } from '../ui/Card';
import { Project, ProjectArtifacts } from '../../types';
import PlanningTool from './tools/PlanningTool';
import InterfaceUXTool from './tools/InterfaceUXTool';
import BackendDesignSystem from '../design-system/BackendDesignSystem';
import DatabaseDesignSystem from '../design-system/DatabaseDesignSystem';
import TechReqsTool from './tools/TechReqsTool';
import DeployTool from './tools/DeployTool';
import ArchitectureTool from './tools/ArchitectureTool';
import ApiDesignTool from './tools/ApiDesignTool';
import { generateBillOfMaterials } from '../../lib/generation/billOfMaterialsGenerator';

interface ModelingWizardProps {
    initialData?: any; 
    isExistingData?: boolean;
    onBack: () => void;
    setCurrentView: (view: string, context?: any) => void;
    project: Project;
    onArtifactsUpdate: (projectId: string, updates: Partial<ProjectArtifacts>) => void;
}

const LOCAL_STORAGE_KEY_PREFIX = 'modeling-wizard-data-v4-';

const ModelingWizard: React.FC<ModelingWizardProps> = ({ initialData, isExistingData, onBack, setCurrentView, project, onArtifactsUpdate }) => {
    const [activeTool, setActiveTool] = useState<string | null>(null);
    
    const [wizardData, setWizardData] = useState<any>(() => {
        const savedDataStr = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${project.id}`);
        
        // ESTADO INICIAL COMPLETO COM AS RESPOSTAS DO BRD
        const basePreFilledState = {
            planning: { 
                step1: { 
                    systemName: 'Nexus ERP & CRM Enterprise',
                    mainObjective: 'Plataforma Integrada de Gestão Reativa e Automação Industrial.',
                    description: 'Solução unificada que funde CRM avançado, ERP industrial e gestão de comissionamento de afiliados em tempo real.',
                    problemSolved: 'Silos de dados entre venda e produção, falta de transparência no split de pagamentos e lead-time industrial elevado.',
                    targetAudience: ["Administradores", "Gestores", "Operadores", "Clientes", "Fornecedores"],
                    hasCompetitors: 'yes',
                    competitors: 'SAP S/4HANA, Salesforce Manufacturing Cloud, Oracle NetSuite',
                    businessObjectives: [
                        { id: 'ob1', text: 'Automatizar 100% do cálculo e trava de comissões', priority: 'Alta' },
                        { id: 'ob2', text: 'Reduzir lead-time de produção em 25% via Kafka Events', priority: 'Alta' },
                        { id: 'ob3', text: 'Integração full-stack com Stripe e Melhor Envio', priority: 'Média' }
                    ],
                    successMetrics: [
                        "Número de usuários ativos", "Taxa de conversão", "Receita recorrente (MRR/ARR)", 
                        "NPS (Net Promoter Score)", "Taxa de retenção", "Tempo médio de uso", 
                        "Número de transações", "Churn rate", "CAC (Custo de Aquisição de Cliente)"
                    ],
                    referenceCenter: {
                        visual: [
                            { id: 'ref1', type: 'link', value: 'https://linear.app', description: 'Referência de UI/UX limpa e produtiva' },
                            { id: 'ref2', type: 'image', value: 'Nexus_Dashboard_Concept.png', description: 'Mockup inicial do Dashboard' }
                        ],
                        functional: [
                            { id: 'ref3', type: 'text', value: 'Split de pagamento via Stripe Connect com 2 níveis de sub-contas.', description: 'Lógica de Pagamento' }
                        ],
                        behavioral: [
                            { id: 'ref4', type: 'text', value: 'O sistema deve ser totalmente reativo (WebSockets) para atualizações de status de produção.', description: 'Comportamento Real-time' }
                        ]
                    }
                }, 
                step2: { 
                    systemType: 'Hybrid',
                    nativeMobile: 'yes_both',
                    mobileFeatures: ["Funcionar offline", "Push notifications", "Acesso à câmera", "Acesso à galeria", "Geolocalização", "Biometria (Face ID/Touch ID)"]
                }, 
                step3: { architecture: 'Microservices (Event-Driven Architecture)' },
                step4: { 
                    frontend: ["React", "HTML/CSS/JS"], 
                    backend: ["Node.js (Express)"], 
                    database: ["PostgreSQL"] 
                }, 
                step5: { 
                    providers: ["E-mail e senha", "Login social (Google, Facebook, etc.)", "Autenticação de 2 fatores (2FA)", "Biometria", "SSO (Single Sign-On)", "Magic Link (login sem senha)"],
                    sessionManagement: 'JWT',
                    passwordRecovery: 'both'
                }, 
                step6: { 
                    userTypes: [
                        {
                            id: 'role-admin',
                            name: 'Admin Geral',
                            roleName: 'Diretor de Operações',
                            importanceLevel: '5',
                            roleDescription: 'Acesso total ao sistema, configuração de taxas, gestão de usuários e auditoria financeira.',
                            authMethod: 'SSO (SAML, JWT)',
                            passwordPolicy: '12+ caracteres, 1 especial, 2FA obrigatório',
                            keyPermissions: 'all, manage_users, manage_finances, factory_control',
                            criticalFlowName: 'Auditoria e Gestão de Fluxo Master',
                            workflowSteps: '1. Login via SSO -> 2. Visualização de Dashboard Global -> 3. Gestão de Contas -> 4. Aprovação de Splits Manuais.',
                            dataFlow: 'Leitura/Escrita em todas as entidades. Acesso a logs de auditoria brutos.',
                            notificationTriggers: 'Disparo de Alerta de Fraude, Relatórios Diários de MRR.',
                            userStories: [
                                { id: 'us1', asA: 'Usuário Administrador', iWantTo: 'Visualizar um dashboard consolidado', soThat: 'Eu possa monitorar a saúde das vendas e da fábrica em tempo real.' }
                            ]
                        },
                        {
                            id: 'role-reseller',
                            name: 'Revendedor/Afiliado',
                            roleName: 'Parceiro Comercial',
                            importanceLevel: '4',
                            roleDescription: 'Vende produtos do catálogo, acompanha suas comissões e gera links de checkout para clientes.',
                            authMethod: 'Magic Link (login sem senha)',
                            passwordPolicy: 'Token de uso único por e-mail com validade de 15min',
                            keyPermissions: 'sales.read, commission.view, profile.edit',
                            criticalFlowName: 'Geração de Link e Consulta de Saldo',
                            workflowSteps: '1. Login via Magic Link -> 2. Painel de Vendas -> 3. Geração de Link Parametrizado -> 4. Saque de Comissões Disponíveis.',
                            dataFlow: 'Leitura: Catálogo e Comissões Próprias. Escrita: Dados de Perfil.',
                            notificationTriggers: 'Push: Venda Realizada; Email: Comissão Disponível para Saque.',
                            userStories: [
                                { id: 'us2', asA: 'Revendedor', iWantTo: 'Acessar meu extrato de comissões', soThat: 'Eu tenha transparência total sobre meus ganhos e pagamentos.' }
                            ]
                        }
                    ] 
                }, 
                step7: {
                    model: 'RBAC',
                    permissions: {
                        'Admin Geral': ['all', 'users.manage', 'factory.override'],
                        'Revendedor/Afiliado': ['sales.read', 'commission.view']
                    }
                },
                planningEntities: [
                    {
                        id: 'pe-order',
                        singularName: 'Pedido de Venda',
                        pluralName: 'Pedidos',
                        owner: 'Sales Service',
                        purpose: 'Registrar transações comerciais e disparar automações de produção e finanças.',
                        statusField: 'status',
                        initialStatus: 'PENDING',
                        possibleStates: 'PENDING, PAID, IN_PRODUCTION, SHIPPED, DELIVERED, CANCELLED',
                        stateTransitions: 'PENDING -> PAID (Pagamento Recebido); PAID -> IN_PRODUCTION (Gatilho de Fábrica); IN_PRODUCTION -> SHIPPED (Expedição)',
                        transitionTriggers: 'Evento PAGAMENTO_RECEBIDO dispara PENDENTE -> PAGO. Webhook do Melhor Envio dispara PAGO -> ENVIADO.',
                        attributes: [
                            { id: 'pa1', attributeName: 'id', dataType: 'UUID', required: 'Sim', isUnique: 'Sim', description: 'ID Global' },
                            { id: 'pa2', attributeName: 'user_id', dataType: 'UUID', required: 'Sim', isUnique: 'Não', description: 'ID do Cliente' },
                            { id: 'pa3', attributeName: 'total_amount', dataType: 'Decimal', required: 'Sim', isUnique: 'Não', description: 'Valor total bruto' },
                            { id: 'pa4', attributeName: 'status', dataType: 'String', required: 'Sim', isUnique: 'Não', description: 'Status atual' }
                        ]
                    }
                ],
                planningDataArchitecture: {
                    dbType: 'PostgreSQL',
                    growthEstimate: '50',
                    dbJustification: 'PostgreSQL pela robustez transacional e suporte a índices B-Tree para alta performance em tabelas de orders.',
                    frontendState: 'Zustand com Persistência para cache de sessão e carrinho.',
                    cacheStrategy: 'Redis para cache de catálogo de produtos e sessões de usuários.',
                    asyncProcessing: 'Kafka para processar eventos: Order_Paid -> Factory_Trigger -> Commission_Lock.',
                    microserviceComms: 'Event Sourcing via Kafka e chamadas internas via gRPC.',
                    architectureStyle: 'Microsserviços',
                    scalabilityReq: 'Alto',
                    externalApis: 'Stripe, Melhor Envio',
                    criticalDocs: 'Faturas XML, Contratos PDF, Imagens de Produtos (S3)',
                    fileStorageStrategy: 'Blob Storage',
                    retentionPolicy: 'Dados financeiros por 5 anos (Conformidade Legal)',
                    complianceReqs: 'LGPD, PCI-DSS',
                    versioningReqs: 'Contratos e Pedidos devem ter versionamento completo (imutável) para fins de auditoria.'
                }
            },
            data_modeling: { 
                step8: { entities: [] }, 
                step10: { relationships: [] }, 
                step13: { endpoints: [] }
            },
            interface_ux: { 
                step15: { 
                    screens: [
                        { id: 's1', path: '/dashboard', description: 'Painel Central de Gestão', layout: 'Standard (Sidebar + Header)' },
                        { id: 's2', path: '/vendas', description: 'Controle de Pedidos e Funil', layout: 'Standard (Sidebar + Header)' },
                        { id: 's3', path: '/fabrica', description: 'Monitoramento de Produção', layout: 'Full Page' }
                    ] 
                }, 
                step18: {
                    primaryColor: '#38bdf8',
                    backgroundColor: '#0f172a',
                    textColor: '#f8fafc',
                    fontFamily: 'Inter',
                    borderRadius: '0.5rem',
                    baseSpacing: '8'
                } 
            },
            functionalities: { 
                step19: {
                    channels: ['In-app', 'E-mail', 'Push notification', 'WhatsApp'],
                    chatEnabled: true,
                    chatFeatures: ['Chat 1:1', 'Histórico de mensagens', 'Envio de arquivos']
                }, 
                step21: {
                    reports: [
                        { id: 'r1', name: 'Faturamento por Afiliado', description: 'Performance de vendas por parceiro comercial', visualization: 'Bar Chart' }
                    ]
                }, 
                step22: {
                    tools: ["Google Analytics", "Sentry / LogRocket", "Dashboard Interno (Nexus)"],
                    dashboardWidgets: ["KPIs Principais", "Gráficos de Tendência", "Alertas de Operação"]
                } 
            },
            tech_reqs: { 
                step23: { sitemap: true, robotsTxt: true, accessibilityLevel: 'AA' }, 
                step24: { concurrentUsers: '1k-10k', dataVolume: '100gb-1tb', responseTime: '<200ms', imageOptimization: true, codeSplitting: true, lazyLoading: true }, 
                step25: { https: true, rateLimiting: true, csp: true, sensitiveData: ["Senhas", "CPF/CNPJ"], compliance: ["LGPD (Brasil)", "PCI-DSS"] }, 
                step26: { levels: ["Unitários", "De Integração", "E2E (ponta a ponta)"], unitFramework: 'Jest', e2eFramework: 'Playwright', coverageTarget: 90 } 
            },
            devops: {
                hostingProvider: 'AWS (Amplify, ECS)',
                databaseProvider: 'AWS RDS',
                ciCdSteps: ["Linting", "Unit Tests", "Build Application", "Deploy to Staging", "Deploy to Production"]
            },
            artifacts: {}
        };

        if (initialData?.wizardData) {
            const blueprintData = initialData.wizardData;
            return {
                ...basePreFilledState,
                ...blueprintData,
                planning: { ...basePreFilledState.planning, ...blueprintData.planning },
            };
        }

        if (savedDataStr) {
            try {
                return JSON.parse(savedDataStr);
            } catch {
                return basePreFilledState;
            }
        }
        
        return basePreFilledState;
    });

    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

    const categories = useMemo(() => [
        { id: 'planning', title: 'Planejamento', icon: 'eye', component: PlanningTool, dataKey: 'planning', description: "Visão, Escopo e Entidades de Negócio." },
        { id: 'architecture_design', title: 'Arquitetura', icon: 'gitBranch', component: ArchitectureTool, dataKey: 'architecture_design', description: "Componentes e Infraestrutura." },
        { id: 'data_modeling', title: 'Modelagem de Dados', icon: 'database', component: DatabaseDesignSystem, dataKey: 'data_modeling', description: "Refinamento Técnico de Tabelas e Big O." },
        { id: 'api_design', title: 'Engenharia de API', icon: 'webhook', component: ApiDesignTool, dataKey: 'api_design', description: "Contratos e Endpoints." },
        { id: 'interface_ux', title: 'Interface e UX', icon: 'layout', component: InterfaceUXTool, dataKey: 'interface_ux', description: "Protótipo e Componentes UI." },
        { id: 'functionalities', title: 'Funcionalidades', icon: 'puzzle', component: BackendDesignSystem, dataKey: 'functionalities', description: "Notificações, Busca e Analytics." },
        { id: 'devops', title: 'Engenharia DevOps', icon: 'server', component: DeployTool, dataKey: 'devops', description: "Deploy e CI/CD." },
        { id: 'tech_reqs', title: 'Requisitos Técnicos', icon: 'shield', component: TechReqsTool, dataKey: 'tech_reqs', description: "Segurança e Qualidade." },
    ], []);

    const saveTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = window.setTimeout(() => {
            localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${project.id}`, JSON.stringify(wizardData));
        }, 1000);
    }, [wizardData, project.id]);

    const handleCompleteCategory = (categoryKey: string, data: any, artifacts?: any) => {
        setWizardData((prev: any) => {
            const updated = {
                ...prev,
                [categoryKey]: data,
                artifacts: { ...prev.artifacts, [categoryKey]: artifacts }
            };
            onArtifactsUpdate(project.id, { wizardData: updated });
            return updated;
        });
        
        if(currentPhaseIndex < categories.length - 1) {
            setCurrentPhaseIndex(currentPhaseIndex + 1);
        }
        setActiveTool(null);
    };

    const handleCompleteWizard = () => {
        const billOfMaterials = generateBillOfMaterials(wizardData);
        onArtifactsUpdate(project.id, { wizardData: { ...wizardData, billOfMaterials } });
        localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${project.id}`);
        setCurrentView('construction_hub', { projectId: project.id });
    };

    const isPhaseCompleted = (index: number) => {
        const key = categories[index].dataKey;
        const data = wizardData[key];
        if (!data) return false;
        return !!(data.step1?.systemName || data.step8?.entities?.length > 0);
    };

    if (activeTool) {
        const toolInfo = categories.find(c => c.id === activeTool);
        if (toolInfo) {
            const ToolComponent = toolInfo.component;
            return (
                <ToolComponent
                    initialData={wizardData[toolInfo.dataKey] || {}}
                    planningData={wizardData.planning || {}}
                    entitiesData={wizardData.data_modeling || {}}
                    setEntitiesData={(d: any) => setWizardData((prev: any) => ({...prev, data_modeling: d}))}
                    onComplete={(data: any, artifacts: any) => handleCompleteCategory(toolInfo.dataKey, data, artifacts)}
                    onBack={() => setActiveTool(null)}
                />
            );
        }
    }

    return (
        <div className="flex flex-col h-screen bg-background text-text-primary p-4 md:p-8">
            <header className="flex-shrink-0 mb-6">
                <Button variant="outline" size="sm" onClick={onBack} className="mb-4">
                    <Icon name="chevronLeft" className="h-4 w-4 mr-2" />Voltar ao Projeto
                </Button>
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Workspace de Modelagem</h1>
                    <p className="text-text-secondary mt-1">
                        {wizardData.planning?.step1?.systemName ? `Blueprint: ${wizardData.planning.step1.systemName}` : 'Iniciando Análise Técnica'}
                    </p>
                </div>
            </header>
            
            <main className="flex-1 overflow-y-auto">
                <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-8">
                    {categories.map((category, index) => {
                        const isCompleted = isPhaseCompleted(index);
                        const isCurrent = index === currentPhaseIndex;
                        return (
                            <React.Fragment key={category.id}>
                                <button onClick={() => setCurrentPhaseIndex(index)} className="flex flex-col items-center w-24">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isCurrent ? 'bg-accent border-accent text-white' : isCompleted ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-sidebar border-card-border text-text-secondary'}`}>
                                        <Icon name={category.icon} className="h-5 w-5"/>
                                    </div>
                                    <p className={`text-[10px] mt-2 font-semibold uppercase text-center ${isCurrent ? 'text-accent' : 'text-text-secondary'}`}>{category.title}</p>
                                </button>
                                {index < categories.length - 1 && <div className="flex-1 h-0.5 bg-card-border mb-6" />}
                            </React.Fragment>
                        );
                    })}
                </div>
                
                <Card className="max-w-2xl mx-auto bg-sidebar/50 text-center animate-in fade-in-50">
                    <CardContent className="p-8">
                        <div className="p-4 bg-accent/10 rounded-full inline-block mb-4">
                            <Icon name={categories[currentPhaseIndex].icon} className="h-10 w-10 text-accent"/>
                        </div>
                        <h2 className="text-2xl font-bold">{categories[currentPhaseIndex].title}</h2>
                        <p className="text-text-secondary mt-2 mb-6">{categories[currentPhaseIndex].description}</p>
                        <Button size="lg" onClick={() => setActiveTool(categories[currentPhaseIndex].id)}>
                            <Icon name="edit" className="h-5 w-5 mr-2"/>
                            Revisar e Gerar
                        </Button>
                    </CardContent>
                </Card>

                <div className="max-w-2xl mx-auto mt-8 text-center">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full h-16 text-xl" onClick={handleCompleteWizard}>
                        <Icon name="sparkles" className="h-6 w-6 mr-3" />
                        Finalizar Análise Mestra
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default ModelingWizard;
