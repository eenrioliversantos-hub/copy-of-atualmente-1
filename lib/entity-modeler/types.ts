// lib/entity-modeler/types.ts

// FIX: Added 'JSONB' and 'TIMESTAMP' to DataType to align with usage in constants and converters.
export type DataType = 'VARCHAR' | 'TEXT' | 'INTEGER' | 'FLOAT' | 'BOOLEAN' | 'DATE' | 'DATETIME' | 'JSON' | 'JSONB' | 'UUID' | 'BIGINT' | 'ENUM' | 'DECIMAL' | 'TIMESTAMP';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type AuthLevel = 'PUBLIC' | 'AUTHENTICATED' | 'ADMIN' | 'OWNER' | 'INTERNAL';
// Added 'ALL' to PolicyType
export type PolicyType = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';

// FIX: Added missing ValidationRuleName type definition
export type ValidationRuleName = 'MIN_LENGTH' | 'MAX_LENGTH' | 'REGEX' | 'MUST_BE_GREATER_THAN' | 'MUST_BE_LESS_THAN';

export interface Attribute {
    id: number;
    name: string;
    type: DataType;
    isPK?: boolean;
    isNN?: boolean;
    isUnique?: boolean;
    isSearchable?: boolean;
    length?: string;
    defaultValue?: string;
}

export interface Relationship {
    id: number;
    name: string;
    targetEntity: string;
    type: '1:1' | '1:N' | 'N:1' | 'N:N' | 'Um-para-Muitos (1:N)';
    fkField: string;
    onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT';
    onUpdate: 'CASCADE' | 'RESTRICT';
}

export interface Endpoint {
    id: number;
    operation: string;
    method: HttpMethod;
    path: string;
    auth: AuthLevel;
}

export interface Action {
    id: number;
    name: string;
    description: string;
    method: HttpMethod;
    route: string;
    requiredFields: string[];
}

export interface Transition {
    from: string;
    to: string;
    event: string;
}

export interface Policy {
    id: number;
    type: PolicyType;
    condition: string;
    roles: string[];
    description: string;
}

export interface ValidationRule {
    id: number;
    field: string;
    rule: ValidationRuleName;
    value: string | number;
    message: string;
}

export interface ExposureChannel {
    id: number;
    channel: string;
    description: string;
    dataFields: string[];
}

export interface FrontendRoute {
    id: number;
    name: string;
    path: string;
    component: string;
    roles: string[];
}

export interface CustomIndex {
    id: number;
    name: string;
    fields: string[];
    type: string;
    notes: string;
}

export interface DataSystem {
    id: number;
    name: string;
    integrationType: string;
    frequency: string;
}

export interface DomainEvent {
    id: number;
    name: string;
    payloadFields: string[];
}

export interface Entity {
    id: string; // Keep ID as string for compatibility
    name: string;
    physicalName: string;
    description: string;

    dataStructure: {
        type: string;
        logicalOrganization: string;
        physicalOrganization: string;
        timeComplexity: string;
        spaceComplexity?: string;
        classificationRelation?: string;
        classificationNature: string;
        classificationAllocation: string;
        keyOperations: string[];
    };
    
    attributes: Attribute[];
    relationships: Relationship[];
    endpoints: Endpoint[];
    actions: Action[];
    
    lifecycle: {
        statusField: string;
        defaultStatus: string;
        transitions: Transition[];
    };
    
    security: {
        policies: Policy[];
        validationRules: ValidationRule[];
        hasAudit: boolean;
        isVersioned: boolean;
    };
    
    integration: {
        exposureChannels: ExposureChannel[];
        frontendRoutes: FrontendRoute[];
    };
    
    indexing: {
        customIndexes: CustomIndex[];
    };
    
    dataGovernance: {
        retentionPolicy: { type: string; afterDays: number; notes: string; };
        archivalPolicy: { enabled: boolean; afterYears: number; targetStorage: string; notes: string; };
        dataOwner: string;
    };
    
    dataFlow: {
        upstreamSystems: DataSystem[];
        downstreamSystems: DataSystem[];
        domainEvents: DomainEvent[];
    };
}