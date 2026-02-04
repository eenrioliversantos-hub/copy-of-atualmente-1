
import { Entity as OldEntity, Relationship as OldRelationship, EntityField as OldEntityField } from '../../types';
import { Entity as NewEntity, Attribute, Relationship as NewRelationship, DataType } from './types';

const snakeCase = (str: string): string => {
    if (!str) return '';
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_+/, '');
}

export function convertOldToNewFormat(oldEntities: OldEntity[], oldRelationships: OldRelationship[]): NewEntity[] {
    if (!oldEntities) return [];

    return oldEntities.map(oldEntity => {
        const attributes: Attribute[] = (oldEntity.fields || []).map((field: OldEntityField, index: number) => ({
            id: index + 1,
            name: field.name,
            type: mapOldTypeToNew(field.type),
            isPK: (field as any).isPK || field.name.toLowerCase() === 'id',
            isNN: field.required,
            isUnique: field.unique || false,
            isSearchable: field.indexed || false,
        }));
        
        const relationships: NewRelationship[] = (oldEntity.relationships || []).map((rel, index) => ({
            id: index + 1,
            name: `${rel.targetEntity.toLowerCase()}_rel`,
            targetEntity: rel.targetEntity,
            type: rel.type as NewRelationship['type'],
            fkField: rel.foreignKey || `${snakeCase(rel.targetEntity)}_id`,
            onDelete: (rel as any).onDelete || 'RESTRICT',
            onUpdate: 'CASCADE',
        }));

        const extendedData = oldEntity as any;

        return {
            id: oldEntity.id,
            name: oldEntity.name,
            physicalName: extendedData.physicalName || snakeCase(oldEntity.name) + 's',
            description: oldEntity.description || '',
            dataStructure: extendedData.dataStructure || {
                type: 'Tabela Hash',
                logicalOrganization: 'Linear',
                physicalOrganization: 'Indexada',
                timeComplexity: 'O(1)',
                classificationNature: 'Dinâmica',
                classificationAllocation: 'Dinâmica (Heap)',
                keyOperations: ['Search O(1)', 'Insert O(1)']
            },
            attributes,
            relationships: relationships.length > 0 ? relationships : (extendedData.relationships || []),
            endpoints: extendedData.endpoints || [],
            actions: extendedData.actions || [],
            lifecycle: extendedData.lifecycle || {
                statusField: 'status',
                defaultStatus: 'PENDING',
                transitions: []
            },
            security: extendedData.security || {
                policies: [],
                validationRules: [],
                hasAudit: true,
                isVersioned: false
            },
            integration: extendedData.integration || {
                exposureChannels: [],
                frontendRoutes: []
            },
            indexing: extendedData.indexing || {
                customIndexes: []
            },
            dataGovernance: extendedData.dataGovernance || {
                retentionPolicy: { type: 'SOFT_DELETE', afterDays: 365, notes: '' },
                archivalPolicy: { enabled: false, afterYears: 0, targetStorage: '', notes: '' },
                dataOwner: ''
            }
        } as NewEntity;
    });
}

// Updated mapOldTypeToNew to include more types from the updated types.ts union.
const mapOldTypeToNew = (type: OldEntityField['type']): DataType => {
    switch (type) {
        case 'string': return 'VARCHAR';
        case 'String': return 'VARCHAR';
        case 'text': return 'TEXT';
        case 'Text': return 'TEXT';
        case 'number': return 'INTEGER';
        case 'Integer': return 'INTEGER';
        case 'Float': return 'DECIMAL';
        case 'Decimal': return 'DECIMAL';
        case 'boolean': return 'BOOLEAN';
        case 'Boolean': return 'BOOLEAN';
        case 'date': return 'DATETIME';
        case 'Date': return 'DATETIME';
        case 'DateTime': return 'DATETIME';
        case 'foreign_key': return 'UUID';
        case 'UUID': return 'UUID';
        case 'json': return 'JSONB';
        case 'JSON': return 'JSONB';
        case 'JSONB': return 'JSONB';
        case 'BigInt': return 'BIGINT';
        // FIX: TIMESTAMP is now correctly included in DataType union
        case 'TIMESTAMP': return 'TIMESTAMP';
        default: return 'VARCHAR';
    }
};

// Updated mapNewTypeToOld to return appropriate strings that now exist in types.ts.
const mapNewTypeToOld = (type: DataType): OldEntityField['type'] => {
    switch (type) {
        case 'VARCHAR': return 'string';
        case 'TEXT': return 'text';
        case 'INTEGER': return 'number';
        case 'BOOLEAN': return 'boolean';
        case 'DATETIME': return 'date';
        case 'UUID': return 'foreign_key';
        case 'JSONB': return 'JSONB';
        case 'DECIMAL': return 'Decimal';
        case 'FLOAT': return 'Float';
        case 'BIGINT': return 'BigInt';
        case 'DATE': return 'date';
        // FIX: TIMESTAMP is now correctly compared against DataType union
        case 'TIMESTAMP': return 'TIMESTAMP';
        default: return 'string';
    }
};

export function convertNewToOldFormat(newEntities: NewEntity[]): OldEntity[] {
    if (!newEntities) return [];
    return newEntities.map(newEntity => {
        const fields: OldEntityField[] = newEntity.attributes.map(attr => ({
            id: String(attr.id),
            name: attr.name,
            type: mapNewTypeToOld(attr.type),
            required: attr.isNN || false,
            unique: attr.isUnique,
            indexed: attr.isSearchable,
            description: '',
        }));
        const relationships: OldRelationship[] = newEntity.relationships.map(rel => ({
            type: rel.type as OldRelationship['type'],
            targetEntity: rel.targetEntity,
            description: rel.name,
            foreignKey: rel.fkField,
        }));
        return {
            ...newEntity,
            id: newEntity.id,
            name: newEntity.name,
            description: newEntity.description,
            fields: fields,
            relationships: relationships,
            businessRules: []
        } as any;
    });
}