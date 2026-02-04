
import { SystemTemplate } from '../../types';

export const logiCoreBlueprint: SystemTemplate = {
  id: 'logistics-logicore',
  name: '🚚 LogiCore (Logística)',
  category: 'Logistics',
  description: 'Uma plataforma de gerenciamento de cadeia de suprimentos (SCM) para otimização de rotas e rastreamento em tempo real.',
  icon: '🚚',
  complexity: 'high',
  estimatedDuration: '18-26 semanas',
  tags: ['Logística', 'SCM', 'Rastreamento', 'PostGIS', 'Tempo Real'],
  storytelling: {
    context: 'Empresas de transporte de última milha em grandes centros.',
    problem: 'Falta de visibilidade da frota e custos elevados com rotas ineficientes.',
    solution: 'Motor de roteirização geográfico com rastreio GPS via PWA offline-first.',
    benefits: 'Redução de 20% no consumo de combustível e 98% de pontualidade.'
  },
  userProfiles: [],
  systemOverview: {
    name: "LogiCore Fleet",
    teamSize: 8,
    objective: "Otimizar 100% da logística de entrega urbana.",
    targetUsers: "Operadores, Motoristas, Gerentes de Frota",
    systemType: "web",
    mainFeatures: ["Route Optimization", "Live Tracking", "Electronic Proof of Delivery"],
    nonFunctionalRequirements: ["Geolocalização Precisa", "Resiliência Offline"],
    projectScope: "large"
  },
  entities: [],
  useCases: [],
  technologyStack: { frontend: [], backend: [], database: [], devops: [] },
  
  wizardData: {
    planning: {
      step1: {
        systemName: 'LogiCore Fleet',
        description: 'TMS (Transport Management System) focado em visibilidade total.',
        mainObjective: 'Minimizar custos operacionais via algoritmos de otimização de rota.',
        targetAudience: ['Administradores', 'Operadores', 'Fornecedores'],
        hasCompetitors: 'yes',
        competitors: 'Loggi, CargoX',
        businessObjectives: [
          { id: 'l1', text: 'Reduzir KM rodado em 15%', priority: 'Alta' },
          { id: 'l2', text: 'Integração via Mapbox', priority: 'Alta' }
        ],
        successMetrics: ['CAC', 'Volume de Transações', 'Pontualidade']
      },
      step2: { systemType: 'Hybrid', nativeMobile: 'yes_both', mobileFeatures: ['Geolocalização', 'Câmera', 'Offline'] },
      step3: { style: 'Microservices' },
      step4: { frontend: ['React', 'Mapbox GL'], backend: ['Python', 'FastAPI'], database: ['PostgreSQL (PostGIS)', 'Elasticsearch'] },
      step5: { providers: ['E-mail e senha', 'Magic Link'], sessionManagement: 'JWT', recovery: 'sms' },
      step6: {
        userTypes: [{
          id: 'drv',
          name: 'Motorista',
          importanceLevel: '4',
          description: 'Executa a entrega e coleta provas (fotos/assinaturas).',
          userStories: [{ id: 's1', asA: 'Motorista', iWantTo: 'Ver minha rota offline', soThat: 'Eu entregue em áreas sem sinal' }],
          authMethod: 'Magic Link',
          keyPermissions: 'location.update, shipment.complete',
          criticalFlowName: 'Entrega',
          workflowSteps: '1. Chegada -> 2. Foto -> 3. Sync',
          dataFlow: 'Leitura: Rota. Escrita: GPS',
          notificationTriggers: 'Alerta Desvio'
        }]
      },
      step7: { model: 'RBAC', permissions: { 'Motorista': ['location.update', 'shipment.complete'] } }
    },
    architecture_design: {
      conference: {
        cloudProvider: 'Azure',
        containerStrategy: 'Kubernetes (GKE)',
        dbStrategy: 'Banco de dados por serviço',
        ciCdTool: 'GitLab CI'
      }
    },
    data_modeling: {
      step8: {
        entities: [{
          id: 'ent-ship',
          name: 'Remessa',
          physicalName: 'shipments',
          description: 'Pacote logístico em trânsito.',
          dataStructure: {
            type: 'Grafo (Graph)',
            logicalOrganization: 'Rede',
            physicalOrganization: 'Indexada',
            timeComplexity: 'O(log n)',
            classificationNature: 'Dinâmica',
            classificationAllocation: 'Dinâmica',
            keyOperations: ['GeoQuery', 'Shortest Path']
          },
          fields: [
            { id: 'f1', name: 'id', type: 'UUID', required: true, unique: true, indexed: true },
            { id: 'f2', name: 'tracking_code', type: 'string', required: true, unique: true, indexed: true },
            { id: 'f3', name: 'status', type: 'string', required: true, indexed: true }
          ],
          lifecycle: {
            statusField: 'status',
            defaultStatus: 'COLETADO',
            transitions: [
              { from: 'COLETADO', to: 'EM_TRANSITO', event: 'departure' },
              { from: 'EM_TRANSITO', to: 'ENTREGUE', event: 'pod_confirmed' }
            ]
          },
          security: {
            policies: [{ id: 1, type: 'UPDATE', condition: 'auth.uid() = driver_id', roles: ['DRIVER'], description: 'Apenas motorista da rota atualiza' }],
            hasAudit: true,
            isVersioned: false
          },
          integration: {
            exposureChannels: [{ id: 1, channel: 'Web App Operador', description: 'Painel Rastreio', dataFields: ['*'] }],
            frontendRoutes: [{ id: 1, name: 'Mapa', path: '/fleet/map', component: 'FleetMap.tsx', roles: ['OPERATOR'] }]
          },
          dataGovernance: {
            retentionPolicy: { type: 'SOFT_DELETE', afterDays: 1095, notes: '3 anos histórico' },
            archivalPolicy: { enabled: true, afterYears: 1, targetStorage: 'S3 Glacier' },
            dataOwner: 'Gerente Logístico'
          },
          indexing: {
            customIndexes: [{ id: 1, name: 'idx_ship_geo', fields: ['last_location'], type: 'GIST' }]
          }
        }]
      },
      step10: { relationships: [] },
      step13: {
        endpoints: [{ id: 'ep1', method: 'POST', path: '/api/v1/location', description: 'Sync GPS', authRequired: true }]
      }
    }
  }
};
