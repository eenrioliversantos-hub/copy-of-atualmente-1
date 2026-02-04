
import { SystemTemplate } from '../../types';

export const nexusHealthBlueprint: SystemTemplate = {
  id: 'healthtech-nexus-health',
  name: '❤️ NexusHealth (Healthtech)',
  category: 'Healthtech',
  description: 'Plataforma de telemedicina segura e compatível com LGPD/HIPAA.',
  icon: '❤️',
  complexity: 'high',
  estimatedDuration: '20-30 semanas',
  tags: ['Healthtech', 'Telemedicina', 'LGPD', 'HIPAA', 'WebRTC'],
  storytelling: {
    context: 'Grandes redes hospitalares e clínicas de especialidade.',
    problem: 'Vazamento de dados sensíveis e prontuários médicos fragmentados em papel.',
    solution: 'Ecossistema Digital de Saúde com criptografia ponta-a-ponta e PEP interoperável.',
    benefits: 'Conformidade 100% legal, redução de glosas em 15% e aumento na satisfação do paciente.'
  },
  systemOverview: {
    name: "NexusHealth Connect",
    teamSize: 10,
    objective: "Digitalizar a jornada do paciente com total privacidade.",
    targetUsers: "Médicos, Pacientes, Gestores de Clínica",
    systemType: "web",
    mainFeatures: ["Videochamada HIPAA-compliant", "Prontuário Eletrônico (PEP)", "Prescrição Digital Assinada"],
    nonFunctionalRequirements: ["Encryption at Rest (AES-256)", "Zero-Knowledge Architecture", "Disponibilidade 99.95%"],
    projectScope: "large"
  },
  userProfiles: [],
  entities: [],
  useCases: [],
  technologyStack: { frontend: [], backend: [], database: [], devops: [] },

  wizardData: {
    planning: {
      step1: {
        systemName: 'NexusHealth Connect',
        description: 'Plataforma para hospitais digitais e teleatendimento.',
        mainObjective: 'Prover consultas remotas seguras e gestão de prontuários.',
        problemSolved: 'Insegurança na transmissão de dados médicos e falta de histórico unificado.',
        targetAudience: ['Pacientes', 'Médicos Especialistas', 'Administradores Hospitalares'],
        hasCompetitors: 'yes',
        competitors: 'Teladoc, Einstein Connect, Conexa Saúde',
        businessObjectives: [
          { id: 'h1', text: 'Conformidade 100% HIPAA e LGPD', priority: 'Alta' },
          { id: 'h2', text: 'Interoperabilidade via HL7/FHIR', priority: 'Média' }
        ],
        successMetrics: ['NPS dos Médicos', 'Tempo Médio de Espera', 'Índice de Segurança de Dados']
      },
      step2: { systemType: 'Web Application', nativeMobile: 'no_pwa', mobileFeatures: ['Câmera', 'Biometria para Login', 'Acesso a Microfone'] },
      step3: { architecture: 'Clean Architecture (Hexagonal)' },
      step4: { frontend: ['React', 'Next.js', 'Tailwind'], backend: ['Node.js (NestJS)', 'WebRTC'], database: ['PostgreSQL', 'MongoDB (para logs)'] },
      step5: { providers: ['E-mail/Senha', 'Biometria', 'Certificado Digital (ICP-Brasil)'], sessionManagement: 'Cookies HttpOnly + Session Store', passwordRecovery: 'email' },
      step6: { 
        userTypes: [{ 
          id: 'doc-1', 
          name: 'Médico', 
          roleName: 'Profissional de Saúde',
          importanceLevel: '5',
          roleDescription: 'Atende pacientes, prescreve medicamentos e gerencia o prontuário eletrônico.',
          authMethod: 'Biometria + Certificado Digital',
          passwordPolicy: '10+ caracteres, MFA obrigatório',
          keyPermissions: 'ehr.write, call.start, prescription.sign, patients.view',
          criticalFlowName: 'Consulta de Telemedicina',
          workflowSteps: '1. Login -> 2. Visualizar Fila de Espera -> 3. Iniciar Chamada de Vídeo -> 4. Registrar Anamnese -> 5. Emitir Receita Assinada',
          dataFlow: 'Leitura: Histórico do Paciente. Escrita: Registro de Evolução e Prescrição',
          notificationTriggers: 'Socket: Paciente entrou na sala; Email: Relatório Diário',
          userStories: [
            { id: 's1', asA: 'Médico', iWantTo: 'Assinar receitas digitalmente', soThat: 'O paciente possa comprar o remédio sem precisar vir à clínica' }
          ]
        }] 
      },
      planningEntities: [
        {
          id: 'ent-patient',
          singularName: 'Paciente',
          pluralName: 'Pacientes',
          owner: 'Core Patient Service',
          purpose: 'Representar o titular dos dados e histórico clínico.',
          statusField: 'patient_status',
          initialStatus: 'ACTIVE',
          possibleStates: 'ACTIVE, INACTIVE, ARCHIVED',
          stateTransitions: 'ACTIVE -> INACTIVE (on request); ACTIVE -> ARCHIVED (on death/legal)',
          transitionTriggers: 'Ação administrativa ou expiração de contrato de serviço.',
          attributes: [
            { id: 'p1', attributeName: 'id', dataType: 'UUID', required: 'Sim', isUnique: 'Sim', description: 'ID do Paciente' },
            { id: 'p2', attributeName: 'cpf', dataType: 'String', required: 'Sim', isUnique: 'Sim', description: 'Documento legal' },
            { id: 'p3', attributeName: 'insurance_id', dataType: 'String', required: 'Não', isUnique: 'Não', description: 'ID do Convênio' }
          ]
        }
      ],
      planningDataArchitecture: {
        dbType: 'PostgreSQL',
        growthEstimate: '25',
        dbJustification: 'PostgreSQL garante integridade relacional absoluta para dados sensíveis e suporta criptografia a nível de coluna (pgcrypto).',
        frontendState: 'React Context para sessões e Zustand para estado efêmero da videochamada.',
        cacheStrategy: 'Redis - Cache de disponibilidade médica em tempo real.',
        asyncProcessing: 'Jobs em background para geração e envio de receitas via PDF assinado.',
        microserviceComms: 'Eventos via RabbitMQ para sincronização entre faturamento e prontuário.',
        architectureStyle: 'Monolítico Modular (Evolução para Microsserviços)',
        scalabilityReq: 'Médio (Foco em segurança > escalabilidade extrema)',
        externalApis: 'Memed (Receituário), ICP-Brasil (Assinatura), Twilio (Vídeo)',
        criticalDocs: 'Prontuários Médicos, Receitas, Termos de Consentimento (LGPD), Laudos de Exame',
        fileStorageStrategy: 'Blob Storage com criptografia na camada de aplicação (Client-Side Encryption)',
        retentionPolicy: 'Prontuários devem ser mantidos por 20 anos conforme resolução do CFM.',
        complianceReqs: 'HIPAA (EUA), LGPD (Brasil), Resolução CFM nº 2.217',
        versioningReqs: 'O PEP deve manter histórico total de alterações (Audit Trail) com hash de integridade.'
      }
    },
    data_modeling: {
      step8: {
        entities: [
          {
            id: 'ent-ehr-tech',
            name: 'Prontuario',
            physicalName: 'medical_records',
            description: 'Tabela de prontuários eletrônicos com campos criptografados.',
            fields: [
              { id: 'f1', name: 'id', type: 'UUID', required: true, unique: true, indexed: true },
              { id: 'f2', name: 'patient_id', type: 'UUID', required: true, unique: false, indexed: true },
              { id: 'f3', name: 'clinical_notes_encrypted', type: 'Text', required: true, unique: false }
            ],
            timestamps: true,
            softDeletes: false,
            dataStructure: {
              type: 'Árvore (Tree)',
              logicalOrganization: 'Hierárquico',
              physicalOrganization: 'Enlaçada',
              timeComplexity: 'O(log n)',
              classificationNature: 'Dinâmica',
              classificationAllocation: 'Dinâmica (Heap)',
              keyOperations: ['Timeline Fetch', 'Snapshot Creation']
            }
          }
        ]
      },
      step10: { relationships: [] },
      step13: {
        endpoints: [
          { id: 'ep1', method: 'GET', path: '/api/v1/patients/:id/history', description: 'Busca o histórico clínico completo do paciente', authRequired: true }
        ]
      }
    }
  }
};
