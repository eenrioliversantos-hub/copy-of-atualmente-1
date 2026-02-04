
import { DevelopmentPlan, DevTask, Sprint } from '../../types';

export function generateDevelopmentPlan(wizardData: any): DevelopmentPlan {
    const systemName = wizardData.planning?.step1?.systemName || 'Sistema Gerado';
    const entities = wizardData.data_modeling?.step8?.entities || [];
    const screens = wizardData.interface_ux?.step15?.screens || [];
    const authProviders = wizardData.planning?.step5?.providers || [];
    
    // --- Helper para criar IDs únicos ---
    const getId = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

    // --- SPRINT 0: Setup & DevOps ---
    const setupTasks: DevTask[] = [
        {
            id: getId('task-setup'),
            title: 'Configuração Inicial do Ambiente',
            status: 'todo',
            toolTarget: 'ide',
            subTasks: [
                { id: getId('sub'), text: 'Inicializar repositório Git e estrutura Monorepo.', status: 'todo' },
                { id: getId('sub'), text: 'Configurar variáveis de ambiente (.env).', status: 'todo' },
                { id: getId('sub'), text: `Configurar projeto Backend (${wizardData.planning?.step4?.backend?.[0] || 'Node.js'}).`, status: 'todo' },
                { id: getId('sub'), text: `Configurar projeto Frontend (${wizardData.planning?.step4?.frontend?.[0] || 'React'}).`, status: 'todo' }
            ]
        },
        {
            id: getId('task-db-setup'),
            title: 'Infraestrutura de Banco de Dados',
            status: 'todo',
            toolTarget: 'database_design_system',
            subTasks: [
                { id: getId('sub'), text: 'Configurar conexão com PostgreSQL via Docker Compose.', status: 'todo' },
                { id: getId('sub'), text: 'Inicializar Prisma ORM e Schema base.', status: 'todo' }
            ]
        }
    ];

    // --- SPRINT 1: Core & Backend ---
    const sprint1BackendTasks: DevTask[] = [];
    
    // Auth Task
    if (authProviders.length > 0) {
        sprint1BackendTasks.push({
            id: getId('task-auth'),
            title: 'Implementação de Autenticação',
            status: 'todo',
            toolTarget: 'backend_design_system',
            subTasks: [
                { id: getId('sub'), text: 'Configurar JWT e Middlewares de proteção.', status: 'todo' },
                { id: getId('sub'), text: `Implementar estratégias: ${authProviders.join(', ')}.`, status: 'todo' },
                { id: getId('sub'), text: 'Criar endpoints de Login, Registro e Refresh Token.', status: 'todo' }
            ]
        });
    }

    // Entity CRUD Tasks
    entities.forEach((entity: any) => {
        sprint1BackendTasks.push({
            id: getId(`task-crud-${entity.name}`),
            title: `API CRUD: ${entity.name}`,
            status: 'todo',
            toolTarget: 'backend_design_system',
            subTasks: [
                { id: getId('sub'), text: `Criar migração de banco para tabela '${entity.name}'.`, status: 'todo' },
                { id: getId('sub'), text: `Implementar Service para lógica de ${entity.name}.`, status: 'todo' },
                { id: getId('sub'), text: `Criar Controller e Rotas para ${entity.name}.`, status: 'todo' },
                { id: getId('sub'), text: `Adicionar validações Zod para ${entity.name}.`, status: 'todo' }
            ]
        });
    });

    // --- SPRINT 2: Frontend & UI ---
    const sprint2FrontendTasks: DevTask[] = [];

    // Base UI
    sprint2FrontendTasks.push({
        id: getId('task-ui-base'),
        title: 'Design System e Layout',
        status: 'todo',
        toolTarget: 'design_system',
        subTasks: [
            { id: getId('sub'), text: `Configurar tema (${wizardData.interface_ux?.conference?.theme || 'Padrão'}).`, status: 'todo' },
            { id: getId('sub'), text: 'Implementar Layout Principal (Sidebar/Header).', status: 'todo' },
            { id: getId('sub'), text: 'Criar componentes base (Button, Input, Card, Table).', status: 'todo' }
        ]
    });

    // Screen Tasks
    screens.forEach((screen: any) => {
        sprint2FrontendTasks.push({
            id: getId(`task-screen-${screen.path}`),
            title: `Tela: ${screen.path}`,
            status: 'todo',
            toolTarget: 'playground',
            subTasks: [
                { id: getId('sub'), text: `Criar página para rota '${screen.path}'.`, status: 'todo' },
                { id: getId('sub'), text: 'Implementar hooks de data fetching.', status: 'todo' },
                { id: getId('sub'), text: 'Construir interface responsiva.', status: 'todo' },
                { id: getId('sub'), text: 'Integrar com API Backend.', status: 'todo' }
            ]
        });
    });

    // Fallback if no screens defined, generate per entity
    if (screens.length === 0) {
        entities.forEach((entity: any) => {
            sprint2FrontendTasks.push({
                id: getId(`task-ui-${entity.name}`),
                title: `Gestão de ${entity.name} (Frontend)`,
                status: 'todo',
                toolTarget: 'playground',
                subTasks: [
                    { id: getId('sub'), text: `Criar listagem de ${entity.name}.`, status: 'todo' },
                    { id: getId('sub'), text: `Criar formulário de criação/edição de ${entity.name}.`, status: 'todo' }
                ]
            });
        });
    }

    const plan: DevelopmentPlan = {
        id: getId('plan'),
        title: systemName,
        systemOverview: {
            name: systemName,
            objective: wizardData.planning?.step1?.mainObjective || '',
            targetUsers: (wizardData.planning?.step1?.targetAudience || []).join(', '),
            systemType: wizardData.planning?.step2?.systemType || 'Web',
            mainFeatures: [],
            nonFunctionalRequirements: [],
            projectScope: 'medium',
            estimatedDuration: 'N/A',
            teamSize: 1
        },
        requirementsGathering: { stakeholderInterviews: [], functionalRequirements: [], nonFunctionalRequirements: [], businessRules: [], constraints: [], assumptions: [], userProfiles: [], integrations: [] },
        systemArchitecture: { architecturalPattern: '', components: [], layers: [], integrations: [], technologyStack: { frontend: [], backend: [], database: [], devops: [], testing: [], monitoring: [], external: [] }, deploymentStrategy: { environment: 'production', platform: 'Vercel', containerization: false, cicd: true, monitoring: true, backup: true, scaling: 'auto', rollback: true } },
        entities: entities,
        useCases: [], umlDiagrams: [], folderStructure: { name: 'root', type: 'folder', description: '', purpose: '' }, componentSuggestions: [], developmentTasks: [], phases: [], milestones: [],
        versioningStrategy: { strategy: 'semantic', majorVersion: 1, minorVersion: 0, patchVersion: 0, releaseNotes: [] },
        timeline: { startDate: '', endDate: '', phases: [], milestones: [], criticalPath: [] },
        systemEvents: [], automations: [], backgroundJobs: [], notificationSystems: [], cacheStrategies: [], queueSystems: [], loggingSystems: [], monitoringSystems: [], webhookConfigurations: [],
        
        // --- DYNAMIC PLAN ---
        setupAndDevOps: setupTasks,
        sprints: [
            {
                id: getId('sprint-1'),
                title: 'Sprint 1: Backend Core & APIs',
                backendTasks: sprint1BackendTasks,
                frontendTasks: []
            },
            {
                id: getId('sprint-2'),
                title: 'Sprint 2: Frontend & Integração',
                backendTasks: [],
                frontendTasks: sprint2FrontendTasks
            }
        ],
        postDeploy: [
             {
                id: getId('task-deploy'),
                title: 'Deploy em Produção',
                status: 'todo',
                subTasks: [
                    { id: getId('sub'), text: 'Configurar pipeline de CI/CD.', status: 'todo' },
                    { id: getId('sub'), text: 'Executar migrações em produção.', status: 'todo' },
                    { id: getId('sub'), text: 'Monitoramento de logs.', status: 'todo' }
                ]
            }
        ],
        checklist: [
            {
                id: getId('check-final'),
                title: 'Validação Final',
                status: 'todo',
                subTasks: [{id: getId('sub'), text: 'Todos os testes passaram.', status: 'todo'}]
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    return plan;
}
