
import { SystemTemplate, UserProfile } from '../types';

export const blogTemplate: SystemTemplate = {
  id: "simple-blog",
  name: "📝 Blog Pessoal Simples",
  description: "Uma estrutura clássica de blog com posts, categorias e comentários. Ideal para portfólios e publicações.",
  icon: "📝",
  category: "publishing",
  complexity: "low",
  estimatedDuration: "2-4 semanas",
  tags: ["Blog", "Conteúdo", "CMS", "Next.js", "Markdown"],
  systemOverview: {
    objective: "Criar um blog rápido e otimizado para SEO para publicar artigos e tutoriais.",
    targetUsers: "Escritores, Desenvolvedores, Criadores de Conteúdo",
    systemType: "web",
    mainFeatures: ["Publicação de posts com Markdown", "Sistema de categorias e tags", "Comentários em posts", "Busca de conteúdo", "Design responsivo"],
    nonFunctionalRequirements: ["Carregamento rápido (Lighthouse > 95)", "SEO otimizado", "Fácil de publicar"],
    projectScope: "small",
    name: "Blog Pessoal Simples",
    teamSize: 1,
  },
  storytelling: { context: "", problem: "", solution: "", benefits: "" },
  userProfiles: [
    { id: 'template-blog-admin', name: "Admin", description: "Gerencia todos os posts, categorias e comentários.", permissions: [], features: [], priority: 'high' },
    { id: 'template-blog-visitor', name: "Visitor", description: "Lê os posts e pode deixar comentários.", permissions: [], features: [], priority: 'medium' },
  ],
  entities: [
    {
      id: "post",
      name: "Post",
      description: "Representa um artigo do blog.",
      fields: [
        { id: "post-title", name: "title", type: "string", required: true },
        { id: "post-slug", name: "slug", type: "string", required: true },
        { id: "post-content", name: "content", type: "text", required: true },
        { id: "post-publishedAt", name: "publishedAt", type: "date", required: false },
        { id: "post-authorId", name: "authorId", type: "foreign_key", required: true },
      ],
      relationships: [
        { type: "N:1", targetEntity: "User", description: "Um post pertence a um autor." },
        { type: "N:N", targetEntity: "Category", description: "Um post pode ter várias categorias." },
      ],
    },
    {
      id: "category",
      name: "Category",
      description: "Representa uma categoria de posts.",
      fields: [
        { id: "cat-name", name: "name", type: "string", required: true },
        { id: "cat-slug", name: "slug", type: "string", required: true },
      ],
      relationships: [],
    },
     {
      id: "comment",
      name: "Comment",
      description: "Representa um comentário deixado em um post.",
      fields: [
        { id: "comm-content", name: "content", type: "text", required: true },
        { id: "comm-authorName", name: "authorName", type: "string", required: true },
        { id: "comm-postId", name: "postId", type: "foreign_key", required: true },
      ],
      relationships: [{ type: "N:1", targetEntity: "Post", description: "Um comentário pertence a um post." }],
    },
  ],
  useCases: [],
  technologyStack: {
    frontend: ["Next.js", "Tailwind CSS"],
    backend: ["Next.js API Routes"],
    database: ["PostgreSQL"],
    devops: ["Vercel"],
  },
};

export const projectManagementTemplate: SystemTemplate = {
  id: "project-management-tool",
  name: "🔨 Ferramenta de Gestão de Projetos",
  description: "Um sistema estilo Trello/Jira para gerenciar projetos, quadros, colunas e tarefas.",
  icon: "🔨",
  category: "productivity",
  complexity: "medium",
  estimatedDuration: "6-10 semanas",
  tags: ["Kanban", "Produtividade", "Gestão", "React", "Real-time"],
  systemOverview: {
    objective: "Organizar o fluxo de trabalho de equipes ágeis através de quadros Kanban interativos.",
    targetUsers: "Gerentes de Projeto, Desenvolvedores, Designers",
    systemType: "web",
    mainFeatures: ["Criação de múltiplos projetos e quadros", "Colunas customizáveis", "Tarefas com drag-and-drop", "Atribuição de responsáveis", "Prazos e etiquetas"],
    nonFunctionalRequirements: ["Atualizações em tempo real", "Interface intuitiva", "Histórico de atividades"],
    projectScope: "medium",
    name: "Ferramenta de Gestão de Projetos",
    teamSize: 3,
  },
  storytelling: { context: "", problem: "", solution: "", benefits: "" },
  userProfiles: [
    { id: 'template-pm-admin', name: "Admin", description: "Cria projetos e gerencia membros.", permissions: [], features: [], priority: 'high' },
    { id: 'template-pm-member', name: "Member", description: "Cria e movimenta tarefas dentro dos quadros.", permissions: [], features: [], priority: 'medium' },
  ],
  entities: [
    { id: "pm-project", name: "Project", description: "Representa um projeto organizacional.", fields: [{ id: "proj-name", name: "name", type: "string", required: true }], relationships: [] },
    { id: "pm-board", name: "Board", description: "Um quadro Kanban de um projeto.", fields: [{ id: "board-name", name: "name", type: "string", required: true }, { id: "board-projectId", name: "projectId", type: "foreign_key", required: true }], relationships: [] },
    { id: "pm-column", name: "Column", description: "Uma coluna de um quadro Kanban.", fields: [{ id: "col-title", name: "title", type: "string", required: true }, { id: "col-boardId", name: "boardId", type: "foreign_key", required: true }, { id: "col-order", name: "order", type: "number", required: true }], relationships: [] },
    { id: "pm-task", name: "Task", description: "Uma tarefa dentro de uma coluna.", fields: [{ id: "task-title", name: "title", type: "string", required: true }, { id: "task-desc", name: "description", type: "text", required: false }, { id: "task-columnId", name: "columnId", type: "foreign_key", required: true }], relationships: [] },
  ],
  useCases: [],
  technologyStack: {
    frontend: ["React (Vite)", "Tailwind CSS"],
    backend: ["Node.js (Express)"],
    database: ["PostgreSQL"],
    devops: ["Docker", "Vercel"],
  },
};

export const ecommerceMultivendorTemplate: SystemTemplate = {
  id: "ecommerce-multivendor-advanced",
  name: "🏪 Marketplace Multvendedor Avançado",
  description:
    "Plataforma completa de e-commerce multvendedor com IA, microserviços, sistema financeiro avançado e logística inteligente.",
  icon: "🏪",
  category: "ecommerce",
  complexity: "high",
  estimatedDuration: "16-24 semanas",
  tags: ["E-commerce", "Marketplace", "IA", "Microserviços", "Fintech"],
  systemOverview: {
    objective:
      "Criar uma plataforma de marketplace multvendedor de alta complexidade que integre inteligência artificial, sistema financeiro avançado, logística inteligente e experiência omnichannel.",
    targetUsers:
      "Vendedores (PMEs e grandes empresas), Compradores (B2B e B2C), Administradores da plataforma, Operadores logísticos",
    systemType: "web",
    mainFeatures: [
      "🤖 IA para recomendações e detecção de fraudes",
      "💳 Gateway de pagamentos com split automático",
      "📦 Sistema logístico inteligente",
      "💬 Chat em tempo real",
      "📊 Analytics avançados com BI integrado",
    ],
    nonFunctionalRequirements: [
      "Suporte a 100.000+ usuários simultâneos",
      "Tempo de resposta < 200ms",
      "Disponibilidade 99.9%",
    ],
    projectScope: "large",
    name: "Marketplace Multvendedor Avançado",
    teamSize: 15,
  },
  storytelling: {
    context:
      "Uma empresa de tecnologia quer criar o próximo grande marketplace do Brasil, competindo com grandes players.",
    problem:
      "Os marketplaces atuais têm limitações em personalização, taxas altas para vendedores e experiência fragmentada.",
    solution:
      "Marketplace de nova geração com IA, sistema financeiro próprio e logística inteligente.",
    benefits:
      "Taxas competitivas, IA para aumentar vendas, logística otimizada e experiência unificada.",
  },
  userProfiles: [
    { id: 'template-ecom-superadmin', name: "Super Administrador", description: "Acesso total ao sistema.", permissions: [], features: [], priority: 'high' },
    { id: 'template-ecom-enterprise', name: "Vendedor Enterprise", description: "Grandes empresas que vendem em volume alto.", permissions: [], features: [], priority: 'high' },
    { id: 'template-ecom-sme', name: "Vendedor PME", description: "Pequenas e médias empresas.", permissions: [], features: [], priority: 'medium' },
    { id: 'template-ecom-b2c', name: "Comprador B2C", description: "Consumidores finais.", permissions: [], features: [], priority: 'medium' },
    { id: 'template-ecom-b2b', name: "Comprador B2B", description: "Empresas que compram para revenda ou uso.", permissions: [], features: [], priority: 'medium' },
  ],
  entities: [
    {
      id: "ecom-user",
      name: "Usuario",
      description: "Representa um usuário do sistema de e-commerce.",
      fields: [
        { id: "user-email", name: "email", type: "string", required: true },
        { id: "user-password", name: "senha", type: "string", required: true },
        { id: "user-name", name: "nome", type: "string", required: true },
        { id: "user-type", name: "tipo", type: "enum", required: true, description: "ADMIN, VENDEDOR, COMPRADOR" },
      ],
      relationships: [],
    },
    {
      id: "ecom-vendor",
      name: "Vendedor",
      description: "Representa uma loja ou vendedor no marketplace.",
      fields: [
        { id: "vendor-userId", name: "usuarioId", type: "foreign_key", required: true },
        { id: "vendor-tradeName", name: "nomeFantasia", type: "string", required: true },
        { id: "vendor-taxId", name: "cnpj", type: "string", required: false },
        { id: "vendor-rating", name: "avaliacaoMedia", type: "number", required: true },
      ],
      relationships: [],
    },
    {
      id: "ecom-product",
      name: "Produto",
      description: "Representa um item à venda no marketplace.",
      fields: [
        { id: "prod-vendorId", name: "vendedorId", type: "foreign_key", required: true },
        { id: "prod-name", name: "nome", type: "string", required: true },
        { id: "prod-price", name: "preco", type: "number", required: true },
        { id: "prod-stock", name: "estoque", type: "number", required: true },
      ],
      relationships: [],
    },
    {
      id: "ecom-order",
      name: "Pedido",
      description: "Representa uma transação de compra.",
      fields: [
        { id: "order-buyerId", name: "compradorId", type: "foreign_key", required: true },
        { id: "order-total", name: "valorTotal", type: "number", required: true },
        { id: "order-status", name: "status", type: "enum", required: true },
      ],
      relationships: [],
    },
    {
      id: "ecom-payment",
      name: "Pagamento",
      description: "Representa os dados de pagamento de um pedido.",
      fields: [
        { id: "pay-orderId", name: "pedidoId", type: "foreign_key", required: true },
        { id: "pay-amount", name: "valor", type: "number", required: true },
        { id: "pay-status", name: "status", type: "enum", required: true },
      ],
      relationships: [],
    },
  ],
  useCases: [],
  technologyStack: {
    frontend: ["Next.js", "React Native", "TypeScript"],
    backend: ["Node.js", "Java Spring Boot", "Python FastAPI", "Go"],
    database: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
    devops: ["Docker", "Kubernetes", "AWS EKS", "Terraform"],
  },
};


export const ALL_TEMPLATES: SystemTemplate[] = [
    ecommerceMultivendorTemplate,
    projectManagementTemplate,
    blogTemplate,
];
