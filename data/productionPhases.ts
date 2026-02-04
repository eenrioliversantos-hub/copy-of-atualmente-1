import { ProductionPhase } from '../types';

export const PRODUCTION_PHASES: ProductionPhase[] = [
  {
    id: 'fase-1',
    title: 'Fase 1: Blueprint',
    icon: 'pen-tool',
    description: 'Planejamento e Arquitetura do Sistema',
    steps: [
      { id: 'f1s1', title: 'Análise de Requisitos', description: 'Coleta de requisitos funcionais e não-funcionais.', subSteps: [
        { id: 'f1s1ss1', title: 'Definir User Stories', details: 'Criar histórias de usuário para cada funcionalidade.' },
        { id: 'f1s1ss2', title: 'Estabelecer Critérios de Aceite', details: 'Definir condições para que uma feature seja considerada pronta.' },
        { id: 'f1s1ss3', title: 'Levantar Requisitos Não-Funcionais', details: 'Performance, segurança, escalabilidade.' },
      ]},
      { id: 'f1s2', title: 'Definição da Arquitetura', description: 'Escolha de padrões, componentes e tecnologias.', subSteps: [
        { id: 'f1s2ss1', title: 'Selecionar Padrão Arquitetural', details: 'Monolito, Microserviços, Serverless.' },
        { id: 'f1s2ss2', title: 'Escolher Stack Tecnológica', details: 'Frontend, Backend, Banco de Dados.' },
      ]},
      { id: 'f1s3', title: 'Modelagem de Dados', description: 'Estruturação das entidades e seus relacionamentos.', subSteps: [
        { id: 'f1s3ss1', title: 'Criar Diagrama Entidade-Relacionamento (ER)', details: 'Visualizar a estrutura do banco de dados.' },
      ]},
      { id: 'f1s4', title: 'Design da Experiência do Usuário (UX/UI)', description: 'Criação de wireframes e protótipos de baixa fidelidade.', subSteps: []},
    ],
  },
  {
    id: 'fase-2',
    title: 'Fase 2: Fundação (Setup)',
    icon: 'compass',
    description: 'Construção da Fundação do Projeto',
    steps: [
      { id: 'f2s1', title: 'Setup do Ambiente de Desenvolvimento', description: 'Configuração das ferramentas locais.', subSteps: [
        { id: 'f2s1ss1', title: 'Instalar dependências (Node, Docker, etc.)', details: '' },
        { id: 'f2s1ss2', title: 'Configurar variáveis de ambiente (.env)', details: '' },
      ]},
      { id: 'f2s2', title: 'Estrutura de Pastas e Arquivos', description: 'Organização do código-fonte.', subSteps: []},
      { id: 'f2s3', title: 'Configuração de Ferramentas', description: 'CI/CD, Linting, Testes.', subSteps: [
        { id: 'f2s3ss1', title: 'Configurar ESLint e Prettier', details: 'Garantir a qualidade e padronização do código.' },
        { id: 'f2s3ss2', title: 'Criar pipeline inicial de CI (GitHub Actions)', details: 'Automatizar verificação de código a cada commit.' },
      ]},
      { id: 'f2s4', title: 'Configuração do Banco de Dados', description: 'Criação do schema inicial e migrations.', subSteps: []},
    ],
  },
  {
    id: 'fase-3',
    title: 'Fase 3: Core (Backend)',
    icon: 'server',
    description: 'Desenvolvimento do Core do Sistema',
    steps: [
      { id: 'f3s1', title: 'Implementação da Autenticação e Autorização', description: 'Controle de acesso de usuários.', subSteps: []},
      { id: 'f3s2', title: 'Desenvolvimento dos Módulos de Negócio', description: 'Criação das funcionalidades principais (CRUDs).', subSteps: []},
      { id: 'f3s3', title: 'Criação de Endpoints da API', description: 'Definição das rotas REST/GraphQL.', subSteps: []},
      { id: 'f3s4', title: 'Implementação da Lógica de Negócio', description: 'Codificação das regras e validações.', subSteps: []},
    ],
  },
  {
    id: 'fase-4',
    title: 'Fase 4: Interface (Frontend)',
    icon: 'layout',
    description: 'Desenvolvimento da Interface do Usuário',
    steps: [
      { id: 'f4s1', title: 'Implementação do Design System', description: 'Criação de componentes UI reutilizáveis.', subSteps: []},
      { id: 'f4s2', title: 'Desenvolvimento das Telas e Páginas', description: 'Construção das interfaces visuais.', subSteps: []},
      { id: 'f4s3', title: 'Integração com as APIs do Backend', description: 'Conexão do frontend com os dados do servidor.', subSteps: []},
      { id: 'f4s4', title: 'Gerenciamento de Estado', description: 'Controle do estado da aplicação (Context, Redux, etc.).', subSteps: []},
    ],
  },
  {
    id: 'fase-5',
    title: 'Fase 5: Qualidade',
    icon: 'clipboardCheck',
    description: 'Integração, Testes e Polimento',
    steps: [
      { id: 'f5s1', title: 'Testes Unitários e de Integração', description: 'Verificação do funcionamento de componentes e módulos.', subSteps: []},
      { id: 'f5s2', title: 'Testes End-to-End (E2E)', description: 'Simulação do fluxo completo do usuário.', subSteps: []},
      { id: 'f5s3', title: 'Revisão de Código (Code Review) e Refatoração', description: 'Melhoria da qualidade e manutenibilidade.', subSteps: []},
      { id: 'f5s4', title: 'Configuração do Pipeline de CI/CD Completo', description: 'Automatização de testes e deploy.', subSteps: []},
    ],
  },
  {
    id: 'fase-6',
    title: 'Fase 6: Go-Live',
    icon: 'rocket',
    description: 'Deploy e Operações',
    steps: [
      { id: 'f6s1', title: 'Configuração dos Ambientes', description: 'Staging e Produção.', subSteps: []},
      { id: 'f6s2', title: 'Processo de Deploy Automatizado', description: 'Publicação da aplicação.', subSteps: []},
      { id: 'f6s3', title: 'Monitoramento, Logging e Alertas', description: 'Observabilidade da aplicação em produção.', subSteps: []},
      { id: 'f6s4', title: 'Estratégia de Backup e Recuperação', description: 'Plano de contingência.', subSteps: []},
    ],
  },
];