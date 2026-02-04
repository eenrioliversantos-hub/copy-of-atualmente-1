
export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent'
}

export enum NotificationType {
  PROPOSAL_SENT = 'PROPOSAL_SENT',
  PROPOSAL_APPROVED = 'PROPOSAL_APPROVED',
  VALIDATION_REQUESTED = 'VALIDATION_REQUESTED',
  VALIDATION_APPROVED = 'VALIDATION_APPROVED',
  ASSET_SUBMITTED = 'ASSET_SUBMITTED',
  ASSET_REQUESTED = 'ASSET_REQUESTED',
  CONTRACT_SIGNED = 'CONTRACT_SIGNED',
  INVOICE_GENERATED = 'INVOICE_GENERATED',
  DELIVERY_READY_FOR_APPROVAL = 'DELIVERY_READY_FOR_APPROVAL',
  DELIVERY_CHANGES_REQUESTED = 'DELIVERY_CHANGES_REQUESTED'
}

export type TaskStatus = 'pending' | 'inProgress' | 'completed';

export type ToolTarget = 
  | 'modeling_hub' 
  | 'database_design_system' 
  | 'backend_design_system' 
  | 'laboratory' 
  | 'playground' 
  | 'design_system' 
  | 'ide' 
  | 'workflow'
  | 'alquimista_web'
  | 'development_cockpit';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

// Added Client interface to fix "Module '"./types"' has no exported member 'Client'" errors
export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'prospect' | 'inactive';
  projects: number;
  totalValue: string;
  satisfaction: number;
  lastContact: string;
  avatar: string;
  tags: string[];
}

export interface ProjectTask {
  id: string;
  title: string;
  projectId: string;
  priority: TaskPriority;
  assignee: User;
}

export interface KanbanColumn {
  id: string;
  title: string;
  taskIds: string[];
}

export interface KanbanBoardData {
  tasks: Record<string, ProjectTask>;
  columns: Record<string, KanbanColumn>;
  columnOrder: string[];
}

export interface Storytelling {
  context: string;
  problem: string;
  solution: string;
  benefits: string;
}

export interface UserProfile {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  features: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface EntityField {
    id: string;
    name: string;
    // Updated type to include "Decimal", "BigInt", "JSONB" and "TIMESTAMP" to fix compatibility with the entity-modeler converter.
    type: "string" | "number" | "boolean" | "date" | "text" | "foreign_key" | "enum" | "json" | "String" | "Text" | "Integer" | "Float" | "Decimal" | "Boolean" | "Date" | "DateTime" | "JSON" | "JSONB" | "UUID" | "BigInt" | "TIMESTAMP";
    required: boolean;
    description?: string;
    unique?: boolean;
    indexed?: boolean;
}

// Renamed from EntityRelationship to Relationship to fix missing export errors in converter and editor
export interface Relationship {
    type: "1:1" | "1:N" | "N:N" | "N:1" | "Um-para-Muitos (1:N)";
    targetEntity: string;
    description: string;
    foreignKey?: string;
}

export interface Entity {
    id: string;
    name: string;
    description: string;
    fields: EntityField[];
    // Updated to use the renamed Relationship interface
    relationships: Relationship[];
    businessRules?: any[];
    timestamps?: boolean;
    softDeletes?: boolean;
}

export interface SystemTemplate {
  id: string
  name: string
  category: string
  description: string
  icon: string
  complexity: 'low' | 'medium' | 'high'
  estimatedDuration: string
  tags: string[]
  storytelling: Storytelling
  userProfiles: UserProfile[]
  systemOverview: {
    name: string
    teamSize: number
    objective: string
    targetUsers: string
    systemType: "web" | "mobile" | "api" | "desktop" | "internal"
    mainFeatures: string[]
    nonFunctionalRequirements: string[]
    projectScope: "small" | "medium" | "large"
  }
  entities: Entity[];
  useCases: Array<{
    userType: string
    actions: string[]
  }>
  technologyStack: {
    frontend: string[]
    backend: string[]
    database: string[]
    devops: string[]
  }
  wizardData?: any; 
}

export interface Project {
  id: string;
  name: string;
  description: string;
  client?: string;
  projectScope: 'client' | 'internal';
  type: string;
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  endDate: string;
  budget: string;
  estimatedHours?: string;
  milestones: any[];
  teamMembers: string[];
  technologies: string[];
  features: any[];
  status: string;
  validations: ProjectValidation[];
  assets: ProjectAsset[];
  hourlyRate?: number;
}

export interface Proposal {
  id: string;
  quoteId?: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  projectName: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  budget: number;
  deadline: string;
  scopeDetails?: {
    complexity?: string;
    estimatedHours?: number;
    timeline?: string;
    valueProposition?: string;
    team?: string;
  };
  projectId?: string;
}

export interface QuoteRequest {
  id: string;
  clientName: string;
  projectName: string;
  projectDescription: string;
  status: 'pending' | 'converted';
  createdAt: string;
  projectType?: string;
  coreFeatures?: string[];
  mainGoals?: string;
  targetAudience?: string;
  descriptionPreferences?: string;
  budgetRange?: string;
  desiredTimeline?: string;
}

export interface Contract {
  id: string;
  proposalId: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  amount: number;
  title: string;
  terms: string;
  status: 'pending' | 'signed' | 'expired';
  signedAt?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface ProjectAsset {
  id: string;
  label: string;
  type: 'file' | 'text' | 'credentials';
  status: 'pending' | 'submitted';
  value?: string;
  fileName?: string;
  sender?: 'client' | 'operator';
  submittedBy?: string;
  submittedAt?: string;
  size?: number;
}

export interface ProjectValidation {
  id: string;
  type: 'phase_validation';
  targetId: string;
  targetName: string;
  status: 'pending' | 'approved' | 'changes_requested';
  requestedAt: string;
  respondedAt?: string;
  data: {
    summary?: string;
    [key: string]: any;
  };
  feedback?: string;
}

export interface DevelopmentPlan {
  id: string;
  title: string;
  systemOverview: any;
  requirementsGathering: any;
  systemArchitecture: any;
  entities: any[];
  useCases: any[];
  umlDiagrams: any[];
  folderStructure: any;
  componentSuggestions: any[];
  developmentTasks: any[];
  phases: any[];
  milestones: any[];
  versioningStrategy: any;
  timeline: any;
  systemEvents: any[];
  automations: any[];
  backgroundJobs: any[];
  notificationSystems: any[];
  cacheStrategies: any[];
  queueSystems: any[];
  loggingSystems: any[];
  monitoringSystems: any[];
  webhookConfigurations: any[];
  createdAt: Date;
  updatedAt: Date;
  setupAndDevOps: DevTask[];
  sprints: Sprint[];
  postDeploy: DevTask[];
  checklist: DevTask[];
}

export interface Sprint {
  id: string;
  title: string;
  backendTasks: DevTask[];
  frontendTasks: DevTask[];
  version?: string;
  duration?: string;
  estimate?: string;
  deliverables?: string[];
}

export interface DevTask {
  id: string;
  title: string;
  status: 'todo' | 'done';
  subTasks: SubTask[];
  toolTarget?: ToolTarget;
  details?: TaskDetails;
  description?: string;
  category?: 'backend' | 'frontend' | 'devops';
  priority?: 'low' | 'medium' | 'high';
}

export interface SubTask {
  id: string;
  text: string;
  status: 'todo' | 'done';
}

export interface TaskDetails {
  errosComuns?: { erro: string; solucao: string; prevencao: string }[];
  faq?: { pergunta: string; resposta: string }[];
  description?: string;
}

export interface ProjectArtifacts {
  developmentPlan?: DevelopmentPlan;
  wizardData?: any;
  billOfMaterials?: string;
  commitHistory?: any[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  participants: string[];
  project: string;
  avatarUrl?: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTimestamp: string;
}

export interface Appointment {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  with: string[];
  notes: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  description: string;
  status: 'Aberto' | 'Em Andamento' | 'Resolvido';
  lastUpdate: string;
  createdAt: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  icon: string;
  timestamp: Date;
  read: boolean;
  cta: {
    label: string;
    view: string;
    context: any;
  };
}

export type CascadeAction = 'NO ACTION' | 'RESTRICT' | 'CASCADE' | 'SET NULL' | 'SET DEFAULT';

export interface ValidationRules {
  isUnique?: boolean;
  minValue?: number;
  maxValue?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface Column {
  id: string;
  name: string;
  dataType: string;
  description?: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isNullable: boolean;
  isIndexed: boolean;
  isAutoIncrement: boolean;
  foreignKeyTable?: string;
  foreignKeyColumn?: string;
  onDeleteAction?: CascadeAction;
  onUpdateAction?: CascadeAction;
  validations?: ValidationRules;
}

export interface Table {
  id: string;
  name: string;
  description?: string;
  columns: Column[];
  checkConstraints?: string;
}

export interface Schema {
  id: string;
  name: string;
  tables: Table[];
}

export interface Concept {
  id: string;
  title: string;
  icon: string;
  description: string;
  status: TaskStatus;
  content?: string;
  toolTarget?: ToolTarget;
  children?: Concept[];
}

export interface SoftwareFactoryPhase {
  id: string;
  title: string;
  icon: string;
  description: string;
  children: Concept[];
  status?: string;
  toolTarget?: ToolTarget;
}

export interface SubStep {
  id: string;
  title: string;
  details?: string;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  subSteps: SubStep[];
}

export interface ProductionPhase {
  id: string;
  title: string;
  icon: string;
  description: string;
  steps: Step[];
}

export interface UserStory {
  id: string;
  asA: string;
  iWantTo: string;
  soThat: string;
}

export interface GeneratedFile {
    path: string;
    content: string;
    language?: string;
}
