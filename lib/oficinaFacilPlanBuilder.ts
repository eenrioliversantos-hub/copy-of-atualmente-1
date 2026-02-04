
import { DevelopmentPlan, Sprint, DevTask } from '../types';

export function buildOficinaFacilPlan(wizardData: any): DevelopmentPlan {
    const systemName = wizardData?.planning?.step1?.systemName || 'Sistema';

    const plan: DevelopmentPlan = {
        title: systemName,
        id: `plan-${Date.now()}`,
        systemOverview: { name: systemName, objective: '', targetUsers: '', systemType: 'web', mainFeatures: [], nonFunctionalRequirements: [], projectScope: 'medium', estimatedDuration: '12 weeks', teamSize: 4 },
        requirementsGathering: { stakeholderInterviews: [], functionalRequirements: [], nonFunctionalRequirements: [], businessRules: [], constraints: [], assumptions: [], userProfiles: [], integrations: [] },
        systemArchitecture: { architecturalPattern: '', components: [], layers: [], integrations: [], technologyStack: { frontend: [], backend: [], database: [], devops: [], testing: [], monitoring: [], external: [] }, deploymentStrategy: { environment: 'production', platform: 'Vercel', containerization: false, cicd: true, monitoring: true, backup: true, scaling: 'auto', rollback: true } },
        entities: [], useCases: [], umlDiagrams: [], folderStructure: { name: 'root', type: 'folder', description: '', purpose: '' }, componentSuggestions: [], developmentTasks: [], phases: [], milestones: [],
        versioningStrategy: { strategy: 'semantic', majorVersion: 1, minorVersion: 0, patchVersion: 0, releaseNotes: [] },
        timeline: { startDate: '', endDate: '', phases: [], milestones: [], criticalPath: [] },
        systemEvents: [], automations: [], backgroundJobs: [], notificationSystems: [], cacheStrategies: [], queueSystems: [], loggingSystems: [], monitoringSystems: [], webhookConfigurations: [],
        createdAt: new Date(),
        updatedAt: new Date(),

        setupAndDevOps: [
            {
                id: 'f0-1',
                title: 'Fundação e Ambiente',
                status: 'todo',
                toolTarget: 'ide',
                subTasks: [
                    { id: 'f0-1-1', text: 'Inicializar repositório Git e definir padrão de commits.', status: 'todo' },
                    { id: 'f0-1-2', text: 'Configurar ambiente Monorepo (se aplicável) ou estrutura de pastas.', status: 'todo' },
                    { id: 'f0-1-3', text: 'Configurar Linter (ESLint), Formatter (Prettier) e Husky.', status: 'todo' },
                    { id: 'f0-1-4', text: 'Configurar CI/CD inicial (GitHub Actions) para build e testes.', status: 'todo' }
                ]
            },
            {
                id: 'f0-2',
                title: 'Design System e UI Kit',
                status: 'todo',
                toolTarget: 'design_system',
                subTasks: [
                    { id: 'f0-2-1', text: 'Configurar TailwindCSS e variáveis de tema.', status: 'todo' },
                    { id: 'f0-2-2', text: 'Implementar componentes atômicos base (Button, Input, Card).', status: 'todo' },
                    { id: 'f0-2-3', text: 'Definir layouts globais (AuthLayout, DashboardLayout).', status: 'todo' }
                ]
            }
        ],
        sprints: [
            {
                id: 'phase-1',
                title: 'Fase 1: Camada de Dados e Core',
                backendTasks: [
                    {
                        id: 'p1-1', title: 'Modelagem e Banco de Dados', status: 'todo', toolTarget: 'database_design_system',
                        subTasks: [
                            { id: 'p1-1-1', text: 'Implementar Schema Prisma/SQL final.', status: 'todo' },
                            { id: 'p1-1-2', text: 'Executar migrações iniciais.', status: 'todo' },
                            { id: 'p1-1-3', text: 'Criar scripts de seed para dados essenciais.', status: 'todo' }
                        ]
                    },
                    {
                        id: 'p1-2', title: 'Autenticação e Segurança', status: 'todo', toolTarget: 'backend_design_system',
                        subTasks: [
                            { id: 'p1-2-1', text: 'Implementar provedores de Auth (NextAuth/Clerk ou Custom).', status: 'todo' },
                            { id: 'p1-2-2', text: 'Configurar middleware de proteção de rotas.', status: 'todo' },
                            { id: 'p1-2-3', text: 'Definir políticas RLS (se usar Supabase) ou ACL.', status: 'todo' }
                        ]
                    }
                ],
                frontendTasks: []
            },
            {
                id: 'phase-2',
                title: 'Fase 2: Módulos de Negócio (Vertical Slices)',
                backendTasks: [
                    {
                        id: 'p2-1', title: 'API e Serviços de Negócio', status: 'todo', toolTarget: 'backend_design_system',
                        subTasks: [
                            { id: 'p2-1-1', text: 'Implementar Controllers/Resolvers para entidades principais.', status: 'todo' },
                            { id: 'p2-1-2', text: 'Validar inputs com Zod em todos os endpoints.', status: 'todo' },
                            { id: 'p2-1-3', text: 'Implementar lógica de negócio e serviços.', status: 'todo' }
                        ]
                    }
                ],
                frontendTasks: [
                    {
                        id: 'p2-2', title: 'Integração Frontend', status: 'todo', toolTarget: 'playground',
                        subTasks: [
                            { id: 'p2-2-1', text: 'Criar hooks de Data Fetching (React Query/SWR).', status: 'todo' },
                            { id: 'p2-2-2', text: 'Implementar formulários com React Hook Form.', status: 'todo' },
                            { id: 'p2-2-3', text: 'Construir telas de listagem e detalhe.', status: 'todo' }
                        ]
                    }
                ]
            },
             {
                id: 'phase-3',
                title: 'Fase 3: Refinamento e UX',
                backendTasks: [],
                frontendTasks: [
                    {
                        id: 'p3-1', title: 'Feedback e Interatividade', status: 'todo', toolTarget: 'playground',
                        subTasks: [
                            { id: 'p3-1-1', text: 'Implementar Toasts e notificações de erro.', status: 'todo' },
                            { id: 'p3-1-2', text: 'Adicionar Loading States e Skeletons.', status: 'todo' },
                            { id: 'p3-1-3', text: 'Otimizar performance (Lazy loading, Code splitting).', status: 'todo' }
                        ]
                    }
                ]
            }
        ],
        postDeploy: [
            {
                id: 'pd-1', title: 'Qualidade e Monitoramento', status: 'todo',
                subTasks: [
                    {id: 'pd-1-1', text: 'Executar testes E2E (Cypress/Playwright) nos fluxos críticos.', status: 'todo'},
                    {id: 'pd-1-2', text: 'Configurar monitoramento de erros (Sentry).', status: 'todo'},
                    {id: 'pd-1-3', text: 'Realizar auditoria de segurança final.', status: 'todo'},
                ]
            },
        ],
        checklist: [
             {
                id: 'check-final', title: 'Validação de Entrega', status: 'todo',
                subTasks: [
                    {id: 'cf-1', text: 'Todos os testes passando.', status: 'todo'},
                    {id: 'cf-2', text: 'Build de produção verificado.', status: 'todo'},
                    {id: 'cf-3', text: 'Documentação de API e Usuário atualizada.', status: 'todo'},
                ]
            },
        ]
    };

    return plan;
}
