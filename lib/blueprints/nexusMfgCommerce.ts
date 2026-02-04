
import { SystemTemplate } from '../../types';

export const nexusMfgCommerceBlueprint: SystemTemplate = {
  id: 'template-nexus-mfg-commerce',
  name: '🏭 Nexus MFG Commerce (Factory + Retail)',
  category: 'E-commerce & Manufacturing',
  description: 'Sistema híbrido integrando manufatura sob demanda, e-commerce D2C e gestão automática de comissões para afiliados.',
  icon: '🏭',
  complexity: 'high',
  estimatedDuration: '16-24 semanas',
  tags: ['E-commerce', 'Fintech', 'Logistics', 'Event-Driven'],
  storytelling: {
    context: 'Fábricas que vendem direto ao consumidor sofrem com desconexão entre estoque real e virtual.',
    problem: 'O delay entre a venda e a ordem de produção gera ruptura de estoque e o cálculo manual de comissões para revendedores gera desconfiança.',
    solution: "Uma plataforma unificada onde o 'Checkout' dispara instantaneamente a 'Ordem de Produção' e o 'Provisionamento de Comissão'.",
    benefits: 'Zero furo de estoque, pagamento de comissões em tempo real e rastreabilidade total.'
  },
  systemOverview: {
    name: "Nexus MFG Commerce",
    teamSize: 15,
    objective: "Arquitetura orientada a eventos unificando Vendas, Produção e Financeiro.",
    targetUsers: "Gestores de Fábrica, Revendedores, Clientes Finais",
    systemType: "web",
    mainFeatures: ["Split de Pagamento Automático", "Lead-time Tracking", "Order-to-Factory Trigger", "Dashboard de Afiliados"],
    nonFunctionalRequirements: ["Latência < 200ms", "Conformidade PCI-DSS", "Alta Disponibilidade (99.9%)"],
    projectScope: "large"
  },
  userProfiles: [
    {
      id: "role-admin",
      name: "Admin Geral",
      description: "Acesso total ao sistema, configuração de taxas e gestão de usuários.",
      permissions: ["all"],
      features: ["Dashboard Global", "Gestão de Taxas", "Auditoria"],
      priority: "high"
    },
    {
      id: "role-reseller",
      name: "Revendedor/Afiliado",
      description: "Vende produtos e recebe comissão automática através de links parametrizados.",
      permissions: ["sales.create", "commission.read", "report.export"],
      features: ["Extrato de Comissões", "Links de Venda", "Relatórios"],
      priority: "medium"
    }
  ],
  entities: [],
  useCases: [],
  technologyStack: {
    frontend: ["Next.js", "Tailwind CSS", "TypeScript"],
    backend: ["Node.js (NestJS)", "Kafka (Event-Driven)", "Redis"],
    database: ["PostgreSQL", "B-Tree Indexes"],
    devops: ["AWS", "Docker", "Kubernetes (EKS)", "Terraform"]
  },
  
  wizardData: {
    planning: {
      step1: {
        systemName: 'Nexus MFG Commerce',
        description: 'Plataforma de comércio unificado com motor de regras financeiras e controle de chão de fábrica.',
        mainObjective: 'Automatizar o fluxo da venda até a fabricação e o pagamento de comissões.',
        problemSolved: 'Ruptura de estoque e delay no cálculo de comissões de afiliados.',
        targetAudience: ['Gestores de Fábrica', 'Revendedores', 'Clientes Finais'],
        hasCompetitors: 'yes',
        competitors: 'VTEX, SAP',
        businessObjectives: [
          { id: 'm1', text: 'Automatizar cálculo de Split de Pagamento', priority: 'Alta' },
          { id: 'm2', text: 'Reduzir lead-time de produção em 30%', priority: 'Alta' }
        ],
        successMetrics: ['Margem de Contribuição por Venda', 'Lead-time Médio', 'Churn de Afiliados']
      },
      step2: { 
        systemType: 'Hybrid', 
        nativeMobile: 'yes_both', 
        mobileFeatures: ['Câmera (Barcode)', 'Geolocalização (Tracking)', 'Push Real-time'] 
      },
      step6: {
        userTypes: [
          {
            id: "role-admin",
            name: "Admin Geral",
            roleName: "Super Admin",
            importanceLevel: "5",
            roleDescription: "Administrador central da plataforma.",
            authMethod: "2FA",
            keyPermissions: "all"
          },
          {
            id: "role-reseller",
            name: "Revendedor/Afiliado",
            roleName: "Affiliate Sales Rep",
            importanceLevel: "4",
            roleDescription: "Indivíduos que comercializam o catálogo em troca de comissão.",
            authMethod: "Social + 2FA",
            keyPermissions: "sales.create, commission.read, report.export",
            criticalFlowName: "Geração de Venda e Provisionamento",
            workflowSteps: "1. Login -> 2. Seleção de Produto -> 3. Geração de Link -> 4. Checkout Cliente -> 5. Push: Comissão Recebida",
            notificationTriggers: "Push: Venda Aprovada; Email: Relatório Semanal"
          }
        ]
      },
      planningEntities: [
        {
          id: 'ent-order',
          singularName: 'Pedido de Venda',
          pluralName: 'Pedidos',
          owner: 'Sales Service',
          purpose: 'Centralizar a transação comercial e disparar eventos de produção.',
          statusField: 'status',
          initialStatus: 'PENDING',
          possibleStates: 'PENDING, PAID, IN_PRODUCTION, SHIPPED, DELIVERED, CANCELLED',
          attributes: [
            { id: 'f1', attributeName: 'id', dataType: 'UUID', required: 'Sim', isUnique: 'Sim' },
            { id: 'f2', attributeName: 'user_id', dataType: 'UUID', required: 'Sim', isUnique: 'Não' },
            { id: 'f3', attributeName: 'total_amount', dataType: 'Decimal', required: 'Sim', isUnique: 'Não' },
            { id: 'f4', attributeName: 'status', dataType: 'String', required: 'Sim', isUnique: 'Não' }
          ]
        },
        {
          id: 'ent-commission',
          singularName: 'Comissão',
          pluralName: 'Comissões',
          owner: 'Finance Service',
          purpose: 'Gerenciar pagamentos e split de afiliados.',
          statusField: 'status',
          initialStatus: 'LOCKED',
          possibleStates: 'LOCKED, AVAILABLE, PAID_OUT',
          attributes: [
            { id: 'c1', attributeName: 'id', dataType: 'UUID', required: 'Sim', isUnique: 'Sim' },
            { id: 'c2', attributeName: 'order_id', dataType: 'UUID', required: 'Sim', isUnique: 'Sim' },
            { id: 'c3', attributeName: 'amount', dataType: 'Decimal', required: 'Sim' }
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
        scalabilityReq: 'Alto (Milhões de usuários)',
        externalApis: 'Stripe, Melhor Envio',
        retentionPolicy: 'Dados financeiros por 5 anos (Legal)',
        complianceReqs: 'LGPD, PCI-DSS'
      }
    },

    architecture_design: {
      conference: {
        cloudProvider: 'AWS',
        containerStrategy: 'Kubernetes (EKS)',
        dbStrategy: 'Banco de dados por serviço',
        ciCdTool: 'GitHub Actions'
      }
    },

    data_modeling: {
      step8: {
        entities: [
          {
            id: 'ent-order',
            name: 'Pedido de Venda',
            physicalName: 'orders',
            description: 'Tabela central de transações de venda.',
            dataStructure: {
              type: 'Árvore (Tree) - B-Tree',
              logicalOrganization: 'Relacional',
              physicalOrganization: 'Indexada',
              timeComplexity: 'O(log n)',
              classificationNature: 'Dinâmica',
              classificationAllocation: 'Dinâmica (Heap)',
              keyOperations: ['Search O(log n)', 'Range Scan']
            },
            fields: [
              { id: 'of1', name: 'id', type: 'UUID', required: true, unique: true, indexed: true, isPK: true },
              { id: 'of2', name: 'user_id', type: 'UUID', required: true, indexed: true },
              { id: 'of3', name: 'total_amount', type: 'Float', required: true },
              { id: 'of4', name: 'status', type: 'String', required: true, indexed: true }
            ],
            lifecycle: {
              statusField: 'status',
              defaultStatus: 'PENDING',
              transitions: [
                { from: 'PENDING', to: 'PAID', event: 'payment.confirmed' },
                { from: 'PAID', to: 'IN_PRODUCTION', event: 'factory.received' },
                { from: 'IN_PRODUCTION', to: 'SHIPPED', event: 'logistics.shipped' }
              ]
            },
            security: {
              policies: [
                { id: 1, type: 'SELECT', condition: 'auth.uid() = user_id', roles: ['CLIENT'], description: 'Cliente vê apenas seus pedidos' },
                { id: 2, type: 'UPDATE', condition: "user_role = 'ADMIN'", roles: ['ADMIN'], description: 'Admin atualiza qualquer pedido' }
              ],
              hasAudit: true,
              isVersioned: true
            },
            actions: [
              { id: 1, name: 'CANCELAR_PEDIDO', method: 'POST', route: '/orders/:id/cancel', description: 'Cancela o pedido e estorna comissão.' },
              { id: 2, name: 'DISPARAR_PRODUCAO', method: 'POST', route: '/orders/:id/produce', description: 'Envia ordem para o chão de fábrica.' }
            ],
            endpoints: [
              { id: 1, operation: 'LISTAR_PEDIDOS', method: 'GET', path: '/api/v1/orders', auth: 'AUTHENTICATED' },
              { id: 2, operation: 'CRIAR_PEDIDO', method: 'POST', path: '/api/v1/orders', auth: 'AUTHENTICATED' }
            ],
            integration: {
              exposureChannels: [
                { id: 1, channel: 'Dashboard Admin', description: 'Monitoramento de Vendas', dataFields: ['*'] },
                { id: 2, channel: 'App Mobile Revendedor', description: 'Extrato de Vendas', dataFields: ['id', 'total_amount', 'status'] }
              ]
            },
            dataGovernance: {
              retentionPolicy: { type: 'SOFT_DELETE', afterDays: 1825, notes: 'Manter por 5 anos' },
              dataOwner: 'Vendas & Financeiro'
            }
          },
          {
            id: 'ent-commission',
            name: 'Comissão',
            physicalName: 'commissions_ledger',
            description: 'Ledger de comissões devidas aos afiliados.',
            dataStructure: {
              type: 'Tabela Hash',
              logicalOrganization: 'Linear',
              physicalOrganization: 'Indexada',
              timeComplexity: 'O(1)',
              classificationNature: 'Dinâmica',
              classificationAllocation: 'Dinâmica',
              keyOperations: ['Point Query O(1)']
            },
            fields: [
              { id: 'cf1', name: 'id', type: 'UUID', required: true, unique: true, indexed: true, isPK: true },
              { id: 'cf2', name: 'order_id', type: 'UUID', required: true, unique: true },
              { id: 'cf3', name: 'seller_id', type: 'UUID', required: true, indexed: true },
              { id: 'cf4', name: 'amount', type: 'Float', required: true },
              { id: 'cf5', name: 'status', type: 'String', required: true, indexed: true }
            ],
            lifecycle: {
              statusField: 'status',
              defaultStatus: 'LOCKED',
              transitions: [
                { from: 'LOCKED', to: 'AVAILABLE', event: 'warranty.expired' },
                { from: 'AVAILABLE', to: 'PAID_OUT', event: 'payout.requested' }
              ]
            },
            security: {
              policies: [
                { id: 1, type: 'SELECT', condition: 'auth.uid() = seller_id', roles: ['RESELLER'], description: 'Revendedor vê apenas seu saldo' }
              ],
              hasAudit: true,
              isVersioned: false
            },
            dataGovernance: {
              retentionPolicy: { type: 'HARD_DELETE', afterDays: 3650, notes: 'Manter por 10 anos' },
              dataOwner: 'Financeiro'
            }
          },
          {
            id: 'ent-product',
            name: 'Produto',
            physicalName: 'products',
            description: 'Itens fabricados e vendidos.',
            dataStructure: {
              type: 'Array (Vetor)',
              logicalOrganization: 'Sequencial',
              physicalOrganization: 'Contígua',
              timeComplexity: 'O(n)',
              classificationNature: 'Dinâmica',
              classificationAllocation: 'Dinâmica',
              keyOperations: ['List O(n)']
            },
            fields: [
              { id: 'pf1', name: 'id', type: 'UUID', required: true, unique: true, indexed: true, isPK: true },
              { id: 'pf2', name: 'sku', type: 'String', required: true, unique: true },
              { id: 'pf3', name: 'stock_qty', type: 'Integer', required: true }
            ],
            lifecycle: {
              statusField: 'stock_status',
              defaultStatus: 'IN_STOCK',
              transitions: [
                { from: 'IN_STOCK', to: 'OUT_OF_STOCK', event: 'inventory.depleted' }
              ]
            },
             security: {
              policies: [
                { id: 1, type: 'SELECT', condition: 'true', roles: ['PUBLIC'], description: 'Catálogo é público' }
              ],
              hasAudit: true,
              isVersioned: true
            },
            dataGovernance: {
              retentionPolicy: { type: 'NONE', afterDays: 0, notes: 'Catálogo permanente' },
              dataOwner: 'Manufatura'
            }
          }
        ]
      },
      step10: {
        relationships: [
          { id: 'r1', fromEntityId: 'ent-order', toEntityId: 'ent-commission', type: '1:1', onDelete: 'Restrict' }
        ]
      },
      step12: {
          businessRules: [
              { id: 'br1', entityId: 'ent-commission', name: 'Regra de Garantia', gherkin: 'DADO que o pedido foi entregue, QUANDO passarem 7 dias, ENTÃO liberar comissão.', priority: 'High' }
          ]
      }
    },

    api_design: {
      step13: {
        endpoints: [
          { id: 'ep-chk', method: 'POST', path: '/api/v1/checkout', description: 'Processa o pagamento e provisiona a ordem', authRequired: true, primaryEntityId: 'ent-order' },
          { id: 'ep-aff', method: 'GET', path: '/api/v1/affiliates/balance', description: 'Consulta saldo e extrato do afiliado', authRequired: true, primaryEntityId: 'ent-commission' }
        ]
      },
       step14: {
        integrations: [
          { id: 'int-str', service: 'Stripe', type: 'Payment Gateway', direction: 'Outbound', purpose: 'Processamento de cartões' }
        ]
      }
    },

    interface_ux: {
      step15: {
        screens: [
          { id: 'screen-res', path: '/dashboard/reseller', name: 'Painel do Afiliado', description: 'Visão do afiliado com vendas e saldo', layout: 'SidebarLayout' },
          { id: 'screen-fac', path: '/factory/kanban', name: 'Monitor de Produção', description: 'Monitor de ordens de produção em tempo real', layout: 'FullWidth' }
        ]
      },
      step16: {
          componentMap: [
              {
                  screenId: 'screen-res',
                  components: [
                      { id: 'c1', type: 'StatCard', label: 'Saldo Disponível', entitySource: 'ent-commission', field: 'amount' },
                      { id: 'c2', type: 'DataTable', label: 'Minhas Vendas', entitySource: 'ent-order' }
                  ]
              },
              {
                  screenId: 'screen-fac',
                  components: [
                      { id: 'c3', type: 'KanbanBoard', label: 'Ordens de Produção', entitySource: 'ent-order', groupBy: 'status' }
                  ]
              }
          ]
      },
      step18: { 
          designTokens: {
            primaryColor: '#0056b3', 
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            fontFamily: 'Inter' 
          }
      }
    },

    functionalities: {
      step19: {
        notifications: [
          { id: 'ev1', name: 'Venda Realizada', description: 'Disparado no checkout', channel: 'Push', recipientRole: 'role-reseller', template: 'Parabéns! Venda de R$ {{total_amount}} realizada.' }
        ]
      },
      step21: {
        reports: [
          { id: 'rep-1', name: 'Faturamento Mensal', description: 'Relatório consolidado de vendas', baseEntityId: 'ent-order', metrics: ['SUM(total_amount)'], groupBy: ['status'] }
        ]
      }
    },

    devops: {
      cloudProvider: 'AWS',
      ciCdStrategy: 'Blue/Green Deployment',
      infrastructure: {
        container: 'Docker',
        orchestrator: 'Kubernetes (EKS)',
        iac: 'Terraform'
      }
    },

    tech_reqs: {
      security: {
        policies: ['CSP Strict', 'Rate Limiting', 'RLS (Row Level Security) enabled'],
        compliance: ['LGPD', 'PCI-DSS']
      },
      performance: {
        lighthouseTarget: 95,
        maxResponseTime: '200ms'
      },
      testing: {
        coverageTarget: 80,
        frameworks: ['Jest', 'Cypress']
      }
    }
  }
};
