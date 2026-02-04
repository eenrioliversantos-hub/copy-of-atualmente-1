import { DevelopmentPlan, Sprint, DevTask } from '../types';

export function buildOficinaFacilPlan(wizardData: any): DevelopmentPlan {
    const plan: DevelopmentPlan = {
        title: wizardData?.planning?.step1?.systemName || 'Oficina Fácil',
        id: 'plan-oficina-facil',
        systemOverview: { name: 'Oficina Fácil', objective: '', targetUsers: '', systemType: 'web', mainFeatures: [], nonFunctionalRequirements: [], projectScope: 'medium', estimatedDuration: '12 weeks', teamSize: 4 },
        requirementsGathering: { stakeholderInterviews: [], functionalRequirements: [], nonFunctionalRequirements: [], businessRules: [], constraints: [], assumptions: [], userProfiles: [], integrations: [] },
        systemArchitecture: { architecturalPattern: '', components: [], layers: [], integrations: [], technologyStack: { frontend: [], backend: [], database: [], devops: [], testing: [], monitoring: [], external: [] }, deploymentStrategy: { environment: 'production', platform: 'Vercel', containerization: false, cicd: true, monitoring: true, backup: true, scaling: 'auto', rollback: true } },
        entities: wizardData?.data_modeling?.step8?.entities || [], 
        useCases: [], umlDiagrams: [], folderStructure: { name: 'root', type: 'folder', description: '', purpose: '' }, componentSuggestions: [], developmentTasks: [], phases: [], milestones: [],
        versioningStrategy: { strategy: 'semantic', majorVersion: 1, minorVersion: 0, patchVersion: 0, releaseNotes: [] },
        timeline: { startDate: '', endDate: '', phases: [], milestones: [], criticalPath: [] },
        systemEvents: [], automations: [], backgroundJobs: [], notificationSystems: [], cacheStrategies: [], queueSystems: [], loggingSystems: [], monitoringSystems: [], webhookConfigurations: [],
        createdAt: new Date(),
        updatedAt: new Date(),

        setupAndDevOps: [
            {
                id: 'devops-task-1',
                title: 'Inicialização do Projeto',
                status: 'todo',
                toolTarget: 'playground',
                subTasks: [
                    { id: 'devops-1-1', text: 'Criar pasta raiz do projeto.', status: 'todo' },
                    { id: 'devops-1-2', text: 'Inicializar Git (`git init`).', status: 'todo' },
                    { id: 'devops-1-3', text: 'Criar o repositório no GitHub/GitLab/Bitbucket.', status: 'todo' },
                    { id: 'devops-1-4', text: 'Criar `backend/` e inicializar projeto Node.js com TypeScript.', status: 'todo' },
                    { id: 'devops-1-5', text: 'Criar `frontend/` e inicializar projeto React com Vite.', status: 'todo' },
                    { id: 'devops-1-6', text: 'Configurar `.gitignore` e `README.md` principal.', status: 'todo' }
                ]
            },
            {
                id: 'devops-task-2',
                title: 'Configuração de Ferramentas de Desenvolvimento',
                status: 'todo',
                toolTarget: 'playground',
                subTasks: [
                    { id: 'devops-2-1', text: 'Instalar e configurar ESLint e Prettier (backend e frontend).', status: 'todo' },
                    { id: 'devops-2-2', text: 'Configurar VS Code para formatação automática ao salvar.', status: 'todo' },
                    { id: 'devops-2-3', text: 'Instalar Jest e Testing Library para backend e frontend.', status: 'todo' },
                    { id: 'devops-2-4', text: 'Instalar Cypress ou Playwright para testes E2E.', status: 'todo' }
                ]
            }
        ],
        sprints: [
            // Sprint 1
            {
                id: 'sprint-1',
                title: 'Sprint 1: Ambiente, Banco e Autenticação',
                backendTasks: [
                    {
                        id: 's1-bt-1', title: 'Configuração do Banco de Dados (Prisma & PostgreSQL)', status: 'todo', toolTarget: 'database_design_system',
                        subTasks: [
                            { id: 's1-bt-1-1', text: 'Instalar Prisma e configurar datasource.', status: 'todo' },
                            { id: 's1-bt-1-2', text: 'Definir modelos Prisma: Usuario, Cliente, Veiculo, OrdemServico, ServicoRealizado, PecaUtilizada, PecaEstoque, Pagamento.', status: 'todo' },
                            { id: 's1-bt-1-3', text: 'Criar a primeira migração com `prisma migrate dev`.', status: 'todo' },
                            { id: 's1-bt-1-4', text: 'Gerar o cliente Prisma e criar arquivo de configuração.', status: 'todo' }
                        ]
                    },
                    {
                        id: 's1-bt-2', title: 'Estrutura Principal do Backend (Express)', status: 'todo', toolTarget: 'backend_design_system',
                        subTasks: [
                            { id: 's1-bt-2-1', text: 'Instalar Express, CORS, Helmet, etc.', status: 'todo' },
                            { id: 's1-bt-2-2', text: 'Configurar `app.ts` e `server.ts`.', status: 'todo' },
                            { id: 's1-bt-2-3', text: 'Implementar middleware de tratamento de erros global.', status: 'todo' },
                        ]
                    },
                    {
                        id: 's1-bt-3', title: 'Módulo de Autenticação (`auth`)', status: 'todo', toolTarget: 'laboratory',
                        subTasks: [
                            { id: 's1-bt-3-1', text: 'Definir Schemas Zod para registro e login.', status: 'todo' },
                            { id: 's1-bt-3-2', text: 'Implementar `auth.service.ts` com lógica de registro e login (bcrypt, JWT).', status: 'todo' },
                            { id: 's1-bt-3-3', text: 'Implementar `auth.controller.ts` e `auth.routes.ts`.', status: 'todo' },
                            { id: 's1-bt-3-4', text: 'Implementar middleware de autenticação (`auth.ts`).', status: 'todo' },
                            { id: 's1-bt-3-5', text: 'Escrever testes unitários e de integração para autenticação.', status: 'todo' },
                        ]
                    }
                ],
                frontendTasks: [
                    {
                        id: 's1-ft-1', title: 'Configuração Inicial do Frontend', status: 'todo', toolTarget: 'design_system',
                        subTasks: [
                            { id: 's1-ft-1-1', text: 'Instalar e configurar TailwindCSS.', status: 'todo' },
                            { id: 's1-ft-1-2', text: 'Instalar `axios`, `zustand`, `react-router-dom`, `react-hook-form`.', status: 'todo' },
                        ]
                    },
                    {
                        id: 's1-ft-2', title: 'Componentes UI Básicos', status: 'todo',
                        subTasks: [
                            { id: 's1-ft-2-1', text: 'Criar componentes reutilizáveis `Input.tsx`, `Button.tsx`, `Spinner.tsx`.', status: 'todo' },
                            { id: 's1-ft-2-2', text: 'Configurar `react-toastify` para notificações.', status: 'todo' },
                        ]
                    },
                    {
                        id: 's1-ft-3', title: 'Lógica e UI de Autenticação', status: 'todo', toolTarget: 'playground',
                        subTasks: [
                            { id: 's1-ft-3-1', text: 'Criar página de Login com `react-hook-form` e Zod.', status: 'todo' },
                            { id: 's1-ft-3-2', text: 'Criar `authStore` (Zustand) para gerenciar usuário e token.', status: 'todo' },
                            { id: 's1-ft-3-3', text: 'Configurar instância do Axios com interceptors para JWT.', status: 'todo' },
                            { id: 's1-ft-3-4', text: 'Criar `ProtectedRoute.tsx` para rotas autenticadas.', status: 'todo' },
                            { id: 's1-ft-3-5', text: 'Escrever testes de integração para a página de Login.', status: 'todo' },
                        ]
                    },
                ]
            },
        ],
        postDeploy: [
            {
                id: 'pd-1', title: 'Monitoramento e Logs Detalhados', status: 'todo',
                subTasks: [
                    {id: 'pd-1-1', text: 'Configurar Sentry para rastreamento de erros.', status: 'todo'},
                    {id: 'pd-1-2', text: 'Implementar logs estruturados com Pino.', status: 'todo'},
                    {id: 'pd-1-3', text: 'Configurar alertas automáticos para métricas críticas.', status: 'todo'},
                ]
            },
        ],
        checklist: [
             {
                id: 'check-0', title: 'Configuração Geral e DevOps', status: 'todo',
                subTasks: [
                    {id: 'c-0-1', text: 'Inicialização do Projeto concluída.', status: 'todo'},
                    {id: 'c-0-2', text: 'Configuração de Ferramentas concluída.', status: 'todo'},
                ]
            },
        ]
    };

    return plan;
}
