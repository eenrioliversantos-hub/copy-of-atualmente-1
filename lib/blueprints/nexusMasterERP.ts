
import { SystemTemplate } from '../../types';

export const nexusMasterERPBlueprint: SystemTemplate = {
  id: 'template-nexus-enterprise-master',
  name: '🚀 Nexus Enterprise Master (ERP+CRM+MFG)',
  category: 'Enterprise Resource Planning',
  description: 'O exemplo definitivo: ERP, CRM e Manufatura integrados. 10+ entidades, 4 personas, 28 etapas 100% preenchidas.',
  icon: '🚀',
  complexity: 'high',
  estimatedDuration: '24-36 semanas',
  tags: ['Master Example', 'Full Stack', 'Microservices', 'Event-Driven', 'High Performance'],
  storytelling: {
    context: 'Indústrias de manufatura de alta escala que buscam unificação total do varejo à fábrica.',
    problem: 'Silos de dados, falta de rastreabilidade em tempo real e processos manuais de comissionamento e estoque.',
    solution: 'Plataforma unificada com arquitetura orientada a eventos e Single Source of Truth.',
    benefits: 'Eficiência operacional +40%, redução de lead-time em 30% e transparência financeira absoluta.'
  },
  systemOverview: {
    name: "Nexus Enterprise Core",
    teamSize: 20,
    objective: "Unificar toda a operação industrial e comercial em um único ecossistema reativo.",
    targetUsers: "C-Level, Vendedores, Supervisores de Produção, Logística",
    systemType: "web",
    mainFeatures: ["CRM 360", "MRP II Automático", "Split de Pagamento", "Real-time Fleet Tracking"],
    nonFunctionalRequirements: ["Latência < 100ms", "Zero Downtime Deploy", "Conformidade ISO 27001"],
    projectScope: "large"
  },
  userProfiles: [],
  entities: [],
  useCases: [],
  technologyStack: { frontend: ["React", "Next.js"], backend: ["Node.js (Express)", "Kafka"], database: ["PostgreSQL", "Redis"], devops: ["AWS", "Docker"] },
  
  wizardData: {
    planning: {
      step1: {
        systemName: 'Nexus Enterprise Core',
        description: 'Solução ERP reativa que funde CRM avançado com controle de produção industrial (MFG) e logística.',
        mainObjective: 'Automatizar o ciclo completo do lead à entrega fabril com visibilidade 360.',
        problemSolved: 'Fragmentação de estoque entre canais e delay no provisionamento de produção.',
        targetAudience: ['Administradores', 'Gestores', 'Operadores', 'Clientes', 'Fornecedores'],
        hasCompetitors: 'yes',
        competitors: 'SAP S/4HANA, Oracle NetSuite, Microsoft Dynamics 365',
        businessObjectives: [
          { id: 'ob1', text: 'Consolidar 100% dos dados em uma única malha de eventos', priority: 'Alta' },
          { id: 'ob2', text: 'Reduzir lead-time de produção em 25% via automação MRP', priority: 'Alta' },
          { id: 'ob3', text: 'Automatizar 90% do split de pagamentos e comissões', priority: 'Média' }
        ],
        successMetrics: [
            "Número de usuários ativos", "Taxa de conversão", "Receita recorrente (MRR/ARR)", 
            "NPS (Net Promoter Score)", "Taxa de retenção", "Tempo médio de uso", 
            "Número de transações", "Churn rate", "CAC (Custo de Aquisição de Cliente)"
        ],
        referenceCenter: {
            visual: [{ id: 'v1', type: 'link', value: 'https://linear.app', description: 'Padrão de UI produtiva' }],
            functional: [{ id: 'f1', type: 'text', value: 'Split de pagamentos automático via Kafka events.', description: 'Lógica Financeira' }]
        }
      },
      step2: { 
        systemType: 'Hybrid', 
        nativeMobile: 'yes_both', 
        mobileFeatures: ['Biometria (Face ID/Touch ID)', 'Push notifications', 'Acesso à câmera', 'Geolocalização', 'Funcionar offline'] 
      },
      step3: { architecture: 'Microservices (Event-Driven Architecture)' },
      step4: { 
        frontend: ['React'], 
        backend: ['Node.js (Express)'], 
        database: ['PostgreSQL'] 
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
            roleName: 'System Architect Admin',
            importanceLevel: '5',
            roleDescription: 'Controle total da infraestrutura, usuários e auditoria global de logs.',
            authMethod: 'SSO (SAML, JWT)',
            passwordPolicy: 'Mínimo 16 caracteres, MFA obrigatório, rotação trimestral',
            keyPermissions: 'all',
            criticalFlowName: 'Auditoria e Recuperação de Desastre',
            workflowSteps: '1. Login via SSO -> 2. Dashboard de Saúde -> 3. Análise de Logs Kafka -> 4. Gestão de Crise',
            dataFlow: 'Leitura/Escrita em todos os serviços de infraestrutura e gestão de usuários.',
            notificationTriggers: 'Push: Erro Crítico 5xx; Email: Relatório de Segurança Semanal',
            userStories: [{ id: 's1', asA: 'Super Admin', iWantTo: 'Monitorar a saúde de todos os microsserviços', soThat: 'Eu possa agir preventivamente em caso de falha' }]
          },
          {
            id: 'role-reseller',
            name: 'Revendedor/Afiliado',
            roleName: 'Affiliate Partner',
            importanceLevel: '4',
            roleDescription: 'Vende produtos e recebe comissão automática através de links parametrizados.',
            authMethod: 'Magic Link (login sem senha)',
            passwordPolicy: 'Autenticação via token temporário',
            keyPermissions: 'sales.read, commission.view',
            criticalFlowName: 'Geração de Link e Provisionamento',
            workflowSteps: '1. Login -> 2. Seleção de Produto -> 3. Geração de Link -> 4. Checkout Cliente -> 5. Push: Comissão Recebida',
            notificationTriggers: 'Push: Venda Aprovada; Email: Relatório Semanal',
            userStories: [{ id: 'us2', asA: 'Revendedor', iWantTo: 'Ver meu extrato', soThat: 'Eu saiba meus ganhos' }]
          }
        ]
      },
      step7: {
        model: 'RBAC',
        permissions: {
          'Admin Geral': ['all'],
          'Revendedor/Afiliado': ['sales.view', 'commission.read']
        }
      },
      planningEntities: [
        {
          id: 'pe-order',
          singularName: 'Pedido de Venda',
          pluralName: 'Pedidos',
          owner: 'Sales Service',
          purpose: 'Gerenciar a transação comercial e disparar a esteira de fabricação.',
          statusField: 'status',
          initialStatus: 'PENDING',
          possibleStates: 'PENDING, PAID, IN_PRODUCTION, SHIPPED, DELIVERED, CANCELLED',
          attributes: [
            { id: 'f1', attributeName: 'id', dataType: 'UUID', required: 'Sim', isUnique: 'Sim', description: 'ID Global' },
            { id: 'f2', attributeName: 'user_id', dataType: 'UUID', required: 'Sim', isUnique: 'Não', description: 'ID do Cliente' },
            { id: 'f3', attributeName: 'total_amount', dataType: 'Decimal', required: 'Sim', isUnique: 'Não', description: 'Valor total' },
            { id: 'f4', attributeName: 'status', dataType: 'String', required: 'Sim', isUnique: 'Não', description: 'Status' }
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
        microserviceComms: 'gRPC para chamadas internas síncronas e CloudEvents via Kafka para fluxos assíncronos.',
        architectureStyle: 'Microsserviços',
        scalabilityReq: 'Alto (Milhões de usuários)',
        externalApis: 'Stripe, Melhor Envio',
        criticalDocs: 'NF-e (XML), Contratos de Venda (PDF), Termos de Garantia',
        fileStorageStrategy: 'Blob Storage (AWS S3)',
        retentionPolicy: 'Dados financeiros por 5 anos (Legal)',
        complianceReqs: 'LGPD (Brasil), PCI-DSS',
        versioningReqs: 'Audit trail imutável em todas as tabelas via triggers de histórico no Postgres.'
      }
    },
    data_modeling: {
      step8: {
        entities: [
          {
            id: 'ent-order',
            name: 'Pedido',
            description: 'Cabeçalho de transação comercial.',
            fields: [
              { id: 'o1', name: 'id', type: 'UUID', required: true, unique: true, indexed: true },
              { id: 'o2', name: 'user_id', type: 'UUID', required: true, indexed: true },
              { id: 'o3', name: 'total_amount', type: 'Decimal', required: true },
              { id: 'o4', name: 'status', type: 'String', required: true, defaultValue: 'PENDING', indexed: true }
            ],
            timestamps: true, softDeletes: false,
            dataStructure: { type: 'Árvore (Tree)', logicalOrganization: 'Hierárquico', physicalOrganization: 'Indexada', timeComplexity: 'O(log n)', classificationNature: 'Dinâmica', classificationAllocation: 'Dinâmica (Heap)', keyOperations: ['Range Search'] }
          }
        ]
      }
    }
  }
};
