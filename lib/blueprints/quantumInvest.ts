
import { SystemTemplate } from '../../types';

export const quantumInvestBlueprint: SystemTemplate = {
  id: 'fintech-quantum-invest',
  name: '📈 QuantumInvest (Fintech)',
  category: 'Fintech',
  description: 'Plataforma de investimentos de alta performance com trading em tempo real e analytics avançado.',
  icon: '📈',
  complexity: 'high',
  estimatedDuration: '16-24 semanas',
  tags: ['Fintech', 'Investimentos', 'Tempo Real', 'Kafka', 'High Availability'],
  storytelling: {
    context: 'Mercado financeiro institucional de alta frequência.',
    problem: 'Latência excessiva em ordens e falta de rastreabilidade imutável.',
    solution: 'Engine de execução event-driven distribuída com storage de série temporal.',
    benefits: 'Execução sub-5ms, auditoria completa via Ledger e conformidade CVM/Bacen.'
  },
  systemOverview: {
    name: "QuantumInvest PRO",
    objective: "Prover infraestrutura de negociação de ativos com liquidação em D+0.",
    targetUsers: "Traders Institucionais, Analistas de Risco, Gestores de Compliance",
    systemType: "web",
    mainFeatures: ["Order Book Real-time", "Cálculo de Margem Dinâmico", "Ledger Imutável", "Smart Order Routing"],
    nonFunctionalRequirements: ["Latência < 5ms", "Disponibilidade 99.999%", "Criptografia em repouso (AES-256)"],
    projectScope: "large",
    teamSize: 12,
  },
  userProfiles: [],
  entities: [],
  useCases: [],
  technologyStack: { frontend: [], backend: [], database: [], devops: [] },
  
  wizardData: {
    planning: {
      step1: {
        systemName: 'QuantumInvest PRO',
        description: 'Plataforma de Trading Institucional.',
        mainObjective: 'Execução de ordens de baixa latência e custódia segura.',
        problemSolved: 'Fragmentação de liquidez e latência em execuções críticas.',
        targetAudience: ['Traders', 'Gestores de Fundo', 'Compliance Officers'],
        hasCompetitors: 'yes',
        competitors: 'Bloomberg, XP Pro, ProfitChart',
        businessObjectives: [
          { id: 'q1', text: 'Processar 1M de ordens/segundo', priority: 'Alta' },
          { id: 'q2', text: 'Latência de ponta a ponta < 10ms', priority: 'Alta' }
        ],
        successMetrics: ['Volume Diário Negociado (ADV)', 'Slippage Médio', 'Uptime']
      },
      step2: { systemType: 'Web Application', nativeMobile: 'yes_both', mobileFeatures: ['Biometria', 'Push Real-time', 'Offline Mode para Visualização'] },
      step3: { architecture: 'Microservices (Event-Driven Architecture)' },
      step4: { frontend: ['Next.js', 'Tailwind', 'WebSockets'], backend: ['Go', 'Kafka', 'gRPC'], database: ['PostgreSQL', 'TimescaleDB', 'Redis'] },
      step5: { providers: ['SSO (Okta)', '2FA (TOTP)', 'Certificado Digital'], sessionManagement: 'JWT + Refresh Token (HttpOnly Cookies)', passwordRecovery: 'both' },
      step6: { 
        userTypes: [{ 
          id: 'trader-1', 
          name: 'Trader Institucional', 
          roleName: 'High-Frequency Trader',
          importanceLevel: '5',
          roleDescription: 'Opera grandes volumes, necessita de dados em tempo real e execução instantânea.',
          authMethod: 'SSO + Hardware Token (Yubikey)',
          passwordPolicy: '16+ chars, rotação a cada 30 dias',
          keyPermissions: 'order.create, order.cancel, positions.view, leverage.adjust',
          criticalFlowName: 'Execução de Ordem de Mercado',
          workflowSteps: '1. Seleção de Ativo -> 2. Validação de Margem (Real-time) -> 3. Envio ao Matching Engine -> 4. Confirmação de Match -> 5. Atualização de Posição',
          dataFlow: 'Leitura: Redis (Market Data). Escrita: Kafka (Transaction Log) -> PostgreSQL (Ledger)',
          notificationTriggers: 'Push/Socket: Ordem Executada, Margin Call',
          userStories: [
            { id: 's1', asA: 'Trader', iWantTo: 'Executar ordens em menos de 10ms', soThat: 'Eu não perca o preço de mercado desejado' }
          ]
        }] 
      },
      planningEntities: [
        {
          id: 'ent-order',
          singularName: 'Ordem',
          pluralName: 'Ordens',
          owner: 'Matching Engine Service',
          purpose: 'Representar uma intenção de compra ou venda de um ativo financeiro.',
          statusField: 'order_status',
          initialStatus: 'RECEIVED',
          possibleStates: 'RECEIVED, VALIDATED, MATCHED, CANCELLED, REJECTED, SETTLED',
          stateTransitions: 'RECEIVED -> VALIDATED; VALIDATED -> MATCHED; MATCHED -> SETTLED',
          transitionTriggers: 'Match Engine Event, Payment Gateway Confirmation, Manual Cancel',
          attributes: [
            { id: 'a1', attributeName: 'id', dataType: 'UUID', required: 'Sim', isUnique: 'Sim', description: 'ID Global Único' },
            { id: 'a2', attributeName: 'ticker', dataType: 'String', required: 'Sim', isUnique: 'Não', description: 'Símbolo do Ativo' },
            { id: 'a3', attributeName: 'side', dataType: 'String', required: 'Sim', isUnique: 'Não', description: 'BUY ou SELL' },
            { id: 'a4', attributeName: 'amount', dataType: 'Float', required: 'Sim', isUnique: 'Não', description: 'Quantidade' }
          ]
        }
      ],
      planningDataArchitecture: {
        dbType: 'PostgreSQL',
        growthEstimate: '40',
        dbJustification: 'PostgreSQL com TimescaleDB para lidar com milhões de registros de série temporal com integridade ACID e performance de query analítica.',
        frontendState: 'Zustand com Persistência em IndexedDB para cache de ordens locais.',
        cacheStrategy: 'Redis Cluster - Cache-Aside para Order Book e sessões de trading ativas.',
        asyncProcessing: 'Filas Kafka para processamento de liquidação (Clearing House) e mensageria distribuída entre serviços.',
        microserviceComms: 'gRPC para comunicação interna de baixa latência e Event Sourcing via Kafka para auditoria.',
        architectureStyle: 'Microsserviços Event-Driven',
        scalabilityReq: 'Alto (Crescimento Horizontal Dinâmico)',
        externalApis: 'B3 (FIX Protocol), Stripe (Payments), Bloomberg Data Feed',
        criticalDocs: 'Faturas, Notas de Corretagem (PDF), Termos de Risco, Comprovantes de Operação',
        fileStorageStrategy: 'Blob Storage (S3 com Object Lock para imutabilidade)',
        retentionPolicy: 'Registros de transações mantidos por 5 anos conforme CVM 358.',
        complianceReqs: 'LGPD, PCI-DSS, SOX, CVM 358, Resolução CMN 4.893',
        versioningReqs: 'Audit Log deve ser versionado e assinado digitalmente para garantir imutabilidade.'
      }
    },
    data_modeling: {
      step8: {
        entities: [
          {
            id: 'ent-order-tech',
            name: 'Ordem',
            physicalName: 'orders_ledger',
            description: 'Tabela principal de ordens com particionamento por tempo.',
            fields: [
              { id: 'f1', name: 'id', type: 'UUID', required: true, unique: true, indexed: true },
              { id: 'f2', name: 'ticker', type: 'String', required: true, unique: false, indexed: true },
              { id: 'f3', name: 'price', type: 'Float', required: true, unique: false },
              { id: 'f4', name: 'status', type: 'String', required: true, unique: false, indexed: true }
            ],
            timestamps: true,
            softDeletes: false,
            dataStructure: {
              type: 'Tabela Hash',
              logicalOrganization: 'Linear',
              physicalOrganization: 'Indexada',
              timeComplexity: 'O(1)',
              classificationNature: 'Dinâmica',
              classificationAllocation: 'Dinâmica (Heap)',
              keyOperations: ['Search O(1)', 'Insert O(1)']
            }
          }
        ]
      },
      step10: { relationships: [] },
      step13: {
        endpoints: [
          { id: 'ep1', method: 'POST', path: '/api/v1/trading/orders', description: 'Envia uma nova ordem para o matching engine', authRequired: true },
          { id: 'ep2', method: 'GET', path: '/api/v1/portfolio/positions', description: 'Retorna as posições atuais do investidor', authRequired: true }
        ]
      }
    },
    interface_ux: {
      step15: {
        screens: [
          { id: 'sc1', path: '/trading', description: 'Painel principal de negociação com gráficos e boletas', layout: 'Standard (Sidebar + Header)' },
          { id: 'sc2', path: '/ledger', description: 'Histórico imutável de transações', layout: 'Standard (Sidebar + Header)' }
        ]
      },
      step18: { primaryColor: '#00D1FF', fontFamily: 'JetBrains Mono', baseSpacing: '4', borderRadius: '0.25rem' }
    }
  }
};
