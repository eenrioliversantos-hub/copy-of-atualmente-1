import { KanbanBoardData, TaskPriority, User } from './types';

export const USERS: User[] = [
  { id: 'user-1', name: 'Ana Costa', avatarUrl: 'https://i.pravatar.cc/150?u=user-1' },
  { id: 'user-2', name: 'Pedro Santos', avatarUrl: 'https://i.pravatar.cc/150?u=user-2' },
  { id: 'user-3', name: 'Juliana Oliveira', avatarUrl: 'https://i.pravatar.cc/150?u=user-3' },
  { id: 'user-4', name: 'Carlos Silva', avatarUrl: 'https://i.pravatar.cc/150?u=user-4' },
];

export const DATA_TYPES = [
    'INT',
    'BIGINT',
    'VARCHAR(255)',
    'TEXT',
    'BOOLEAN',
    'DATE',
    'TIMESTAMP',
    'TIMESTAMPTZ',
    'JSON',
    'JSONB',
    'UUID',
    'DECIMAL(10, 2)',
    'FLOAT',
    'DOUBLE',
];

export const MOCK_DATA: KanbanBoardData = {
  tasks: {
    'task-1': { id: 'task-1', title: 'Design Homepage Mockups', projectId: 'proj-1', priority: TaskPriority.High, assignee: USERS[2] },
    'task-2': { id: 'task-2', title: 'Setup CI/CD Pipeline', projectId: 'proj-1', priority: TaskPriority.Urgent, assignee: USERS[1] },
    'task-3': { id: 'task-3', title: 'Develop Authentication API', projectId: 'proj-1', priority: TaskPriority.High, assignee: USERS[1] },
    'task-4': { id: 'task-4', title: 'Create User Profile Page', projectId: 'proj-1', priority: TaskPriority.Medium, assignee: USERS[0] },
    'task-5': { id: 'task-5', title: 'Review Marketing Copy', projectId: 'proj-1', priority: TaskPriority.Low, assignee: USERS[3] },
    'task-6': { id: 'task-6', title: 'Fix Login Page Bug', projectId: 'proj-1', priority: TaskPriority.Urgent, assignee: USERS[1] },
    'task-7': { id: 'task-7', title: 'Write E2E Tests for Signup', projectId: 'proj-1', priority: TaskPriority.Medium, assignee: USERS[0] },
    'task-8': { id: 'task-8', title: 'Deploy Staging Environment', projectId: 'proj-1', priority: TaskPriority.High, assignee: USERS[1] },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-5'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-2', 'task-3', 'task-4'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Review',
      taskIds: ['task-7'],
    },
    'column-4': {
      id: 'column-4',
      title: 'Done',
      taskIds: ['task-6', 'task-8'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
};

export const MOCK_MODELING_DATA = {
  structure: {
    name: "Sistema de Gestão de Vendas",
    description: "Sistema completo para gestão de vendas, clientes e produtos, com foco em automação e geração de relatórios.",
    objective: "Automatizar processo de vendas e melhorar controle de estoque.",
    systemType: "Web Application",
    expectedUsers: "100-500 usuários simultâneos",
    dataVolume: "Até 1 milhão de registros no primeiro ano",
    performance: "Tempo de resposta da API abaixo de 200ms.",
  },
  storytelling: {
    businessContext: "Uma empresa de médio porte que vende produtos B2B e precisa de um sistema centralizado para gerenciar seu processo comercial.",
    problemStatement: "A equipe de vendas gasta muito tempo em tarefas manuais, o controle de estoque é impreciso e não há visibilidade sobre as métricas de vendas.",
    targetAudience: "Vendedores, Gerentes de Vendas, Administradores de Sistema.",
    successCriteria: "Redução de 30% no tempo gasto em tarefas manuais de vendas, precisão de 99% no estoque e relatórios de vendas gerados em tempo real.",
  },
  entities: [
    { id: 'ent-1', name: "Produto", description: "Representa um item vendido pela empresa.", purpose: "Gerenciar o catálogo de produtos, preços e estoque.", fields: [{id: 'f-1-1', name: 'nome', type: 'String', required: true, businessPurpose: 'Nome comercial do produto.'}, {id: 'f-1-2', name: 'preco', type: 'Decimal', required: true, businessPurpose: 'Preço de venda unitário.'}, {id: 'f-1-3', name: 'estoque', type: 'Integer', required: true, businessPurpose: 'Quantidade disponível em estoque.'}], businessRules: [{id: 'br-1-1', rule: 'Estoque não pode ser negativo.', description: 'O sistema deve impedir que a quantidade de um produto em estoque se torne menor que zero.'}] },
    { id: 'ent-2', name: "Cliente", description: "Representa um cliente da empresa.", purpose: "Manter um registro dos clientes, seus contatos e histórico de compras.", fields: [{id: 'f-2-1', name: 'nome', type: 'String', required: true, businessPurpose: 'Nome ou razão social do cliente.'}, {id: 'f-2-2', name: 'email', type: 'String', required: true, businessPurpose: 'Email principal para contato.'}], businessRules: [{id: 'br-2-1', rule: 'Email deve ser único.', description: 'Não podem existir dois clientes com o mesmo endereço de e-mail.'}] },
    { id: 'ent-3', name: "Venda", description: "Registra uma transação de venda.", purpose: "Manter o histórico de todas as vendas, incluindo itens, valores e status.", fields: [{id: 'f-3-1', name: 'data', type: 'DateTime', required: true, businessPurpose: 'Data e hora da realização da venda.'}, {id: 'f-3-2', name: 'valor_total', type: 'Decimal', required: true, businessPurpose: 'Valor total da venda.'}], businessRules: [] },
  ],
  userProfiles: [
    { id: 'up-1', name: "Vendedor", description: "Responsável por realizar vendas e gerenciar seus clientes.", responsibilities: ["Cadastrar clientes", "Registrar vendas", "Acompanhar pipeline"], permissions: [{action: 'Criar Venda'}, {action: 'Editar Cliente'}], restrictions: [{description: 'Só pode ver clientes da própria carteira.'}] },
    { id: 'up-2', name: "Gerente", description: "Responsável por supervisionar a equipe de vendas e analisar resultados.", responsibilities: ["Aprovar descontos", "Gerar relatórios", "Definir metas"], permissions: [{action: 'Ver todos os clientes'}, {action: 'Gerar relatórios'}], restrictions: [] },
  ],
  businessFlows: [
    { id: 'bf-1', name: "Realizar Nova Venda", description: "Fluxo para registrar uma nova venda no sistema.", userType: "Vendedor", trigger: "Cliente decide comprar um produto.", steps: [{id: 'bfs-1-1', order: 1, actor: 'Vendedor', action: 'Seleciona o cliente', description: 'Busca e seleciona o cliente no sistema.'}, {id: 'bfs-1-2', order: 2, actor: 'Vendedor', action: 'Adiciona produtos', description: 'Adiciona os produtos e quantidades ao carrinho.'}, {id: 'bfs-1-3', order: 3, actor: 'Sistema', action: 'Calcula o total', description: 'O sistema calcula o valor total, impostos e descontos.'}], outcomes: [{id: 'bfo-1-1', condition: 'Sucesso', result: 'Venda registrada e estoque atualizado.'}] }
  ],
  systemRoutes: [
    { id: 'sr-1', method: "GET", path: "/api/produtos", description: "Lista todos os produtos.", entity: "Produto", authentication: "Requerida" },
    { id: 'sr-2', method: "POST", path: "/api/produtos", description: "Cria um novo produto.", entity: "Produto", authentication: "Requerida" },
    { id: 'sr-3', method: "GET", path: "/api/clientes", description: "Lista todos os clientes.", entity: "Cliente", authentication: "Requerida" },
    { id: 'sr-4', method: "POST", path: "/api/vendas", description: "Registra uma nova venda.", entity: "Venda", authentication: "Requerida" },
    { id: 'sr-5', method: 'POST', path: '/api/auth/login', description: 'Autentica um usuário.' },
    { id: 'sr-6', method: 'POST', path: '/api/auth/register', description: 'Registra um novo usuário.' },
    { id: 'sr-7', method: 'PUT', path: '/api/produtos/:id', description: 'Atualiza um produto existente.', entity: 'Produto' },
  ],
  technicalRequirements: [
    { id: 'tr-1', category: "performance", requirement: "Respostas de API rápidas", description: "Todas as chamadas de API devem responder em menos de 200ms.", priority: "high", examples: ["Listagem de produtos"], suggestions: ["Caching", "Indexação de banco de dados"], metrics: ["P95 Latency"] },
    { id: 'tr-2', category: "security", requirement: "Autenticação Segura", description: "Implementar autenticação baseada em JWT com refresh tokens.", priority: "high", examples: ["Login de usuário"], suggestions: ["HTTPS", "HTTPOnly cookies"], metrics: ["Tentativas de login falhas"] },
    { id: 'tr-3', category: "usability", requirement: "Design Responsivo", description: "A interface deve ser totalmente funcional em desktops, tablets e smartphones.", priority: "high", examples: ["Página de Vendas", "Dashboard"], suggestions: ["Mobile-First Design", "Testes em múltiplos dispositivos"], metrics: ["Google Lighthouse Score"] },
    { id: 'tr-4', category: "scalability", requirement: "Escalabilidade Horizontal", description: "A arquitetura deve suportar a adição de novos servidores para lidar com o aumento de carga.", priority: "medium", examples: ["Black Friday"], suggestions: ["Stateless Services", "Load Balancer"], metrics: ["CPU Utilization", "Request per Second"] },
  ],
  umlDiagrams: [
    { name: "Diagrama de Entidade-Relacionamento", description: "Mostra as entidades e seus relacionamentos.", mermaidCode: "erDiagram\n    CLIENTE ||--o{ VENDA : realiza\n    VENDA }|..|{ PRODUTO : contém", imageUrl: "https://via.placeholder.com/800x400.png?text=ER+Diagram+Preview" },
  ],
  businessRules: [
    { rule: "Um cliente não pode ter o mesmo e-mail que outro.", description: "Garante a unicidade dos clientes.", priority: "high", category: "Validação de Dados" },
  ],
  useCases: [],
  generatedAt: new Date().toISOString(),
};

export const WIZARD_STEPS = [
  // Categoria 1: Planejamento & Visão
  { id: 1, title: 'Visão do Produto', icon: 'eye', category: 'Planejamento & Visão' },
  { id: 2, title: 'Tipo de Sistema', icon: 'zap', category: 'Planejamento & Visão' },
  { id: 6, title: 'Tipos de Usuários', icon: 'users', category: 'Planejamento & Visão' },

  // Categoria 2: Arquitetura
  { id: 3, title: 'Padrão Arquitetural', icon: 'gitBranch', category: 'Arquitetura' },
  { id: 4, title: 'Stack Tecnológico', icon: 'layers', category: 'Arquitetura' },
  { id: 5, title: 'Autenticação', icon: 'lock', category: 'Arquitetura' },
  { id: 7, title: 'Permissões & Acessos', icon: 'shield', category: 'Arquitetura' },

  // Categoria 3: Modelagem de Dados
  { id: 8, title: 'Entidades Principais', icon: 'database', category: 'Modelagem de Dados' },
  { id: 9, title: 'Campos das Entidades', icon: 'list', category: 'Modelagem de Dados' },
  { id: 10, title: 'Relacionamentos', icon: 'workflow', category: 'Modelagem de Dados' },
  { id: 12, title: 'Regras de Negócio', icon: 'gavel', category: 'Modelagem de Dados' },
  
  // Categoria 4: Engenharia de API
  { id: 13, title: 'APIs & Endpoints', icon: 'route', category: 'Engenharia de API' },
  { id: 14, title: 'Integrações Externas', icon: 'plug', category: 'Engenharia de API' },
  { id: 29, title: 'Webhooks', icon: 'webhook', category: 'Engenharia de API' }, // Novo ID

  // Categoria 5: Interface e UX
  { id: 15, title: 'Telas/Páginas', icon: 'layout', category: 'Interface e UX' },
  { id: 16, title: 'Componentes UI', icon: 'puzzle', category: 'Interface e UX' },
  { id: 17, title: 'Layout Principal', icon: 'layoutTemplate', category: 'Interface e UX' },
  { id: 18, title: 'Tema/Design System', icon: 'palette', category: 'Interface e UX' },

  // Categoria 6: Funcionalidades
  { id: 19, title: 'Notificações', icon: 'bell', category: 'Funcionalidades' },
  { id: 20, title: 'Busca e Filtros', icon: 'search', category: 'Funcionalidades' },
  { id: 21, title: 'Relatórios', icon: 'barChart', category: 'Funcionalidades' },
  { id: 22, title: 'Analytics', icon: 'activity', category: 'Funcionalidades' },
  { id: 30, title: 'Pagamentos', icon: 'creditCard', category: 'Funcionalidades' }, // Novo ID

  // Categoria 7: Engenharia DevOps
  { id: 27, title: 'Deploy & Hosting', icon: 'server', category: 'Engenharia DevOps' },
  { id: 31, title: 'CI/CD', icon: 'git-fork', category: 'Engenharia DevOps' }, // Novo ID
  { id: 32, title: 'Infraestrutura', icon: 'hardDrive', category: 'Engenharia DevOps' }, // Novo ID

  // Categoria 8: Requisitos Não-Funcionais
  { id: 23, title: 'SEO & Acessibilidade', icon: 'trendingUp', category: 'Requisitos Não-Funcionais' },
  { id: 24, title: 'Performance', icon: 'rocket', category: 'Requisitos Não-Funcionais' },
  { id: 25, title: 'Segurança', icon: 'shield', category: 'Requisitos Não-Funcionais' },
  { id: 26, title: 'Testes & Qualidade', icon: 'clipboardCheck', category: 'Requisitos Não-Funcionais' },
  
  // Categoria 9: Finalização
  { id: 28, title: 'Revisão Final', icon: 'check', category: 'Finalização' },
];