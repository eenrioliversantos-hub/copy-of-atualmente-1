
import { Entity, Field } from '../../components/modeling/steps/Step8Entities';

const typeMapping: Record<string, string> = {
    String: 'VARCHAR(255)',
    Text: 'TEXT',
    Integer: 'INTEGER',
    Float: 'DECIMAL(10, 2)',
    Boolean: 'BOOLEAN',
    Date: 'DATE',
    DateTime: 'TIMESTAMP WITH TIME ZONE',
    JSON: 'JSONB',
    UUID: 'UUID',
};

function snakeCase(str: string): string {
    if (!str) return '';
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_+/, '');
}

export function generateSqlSchema(data: any): string {
    const entities: Entity[] = data.step8?.entities || [];
    const relationships = data.step10?.relationships || [];
    let sql = `--- Generated SQL Schema for ${data.step1?.systemName}\n`;
    sql += `--- Generated at: ${new Date().toISOString()}\n\n`;

    if (entities.length === 0) {
        return sql + '--- No entities defined.\n';
    }
    
    // Create tables
    entities.forEach(entity => {
        const tableName = snakeCase(entity.name) + 's';
        sql += `CREATE TABLE "${tableName}" (\n`;
        sql += `    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n`;
        
        entity.fields.forEach(field => {
            const fieldName = snakeCase(field.name);
            const fieldType = typeMapping[field.type] || 'TEXT';
            sql += `    "${fieldName}" ${fieldType}`;
            if (field.required) sql += ' NOT NULL';
            if (field.unique) sql += ' UNIQUE';
            if (field.defaultValue) sql += ` DEFAULT '${field.defaultValue}'`;
            sql += ',\n';
        });

        if (entity.timestamps) {
            sql += `    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,\n`;
            sql += `    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,\n`;
        }
        if (entity.softDeletes) {
            sql += `    "deleted_at" TIMESTAMP WITH TIME ZONE,\n`;
        }

        sql = sql.trim().slice(0, -1); // Remove trailing comma
        sql += '\n);\n\n';
    });

    // Create relationships (foreign keys)
    if(relationships.length > 0) {
        sql += `--- Foreign Key Constraints\n\n`;
        relationships.forEach(rel => {
            const fromEntity = entities.find(e => e.id === rel.fromEntityId);
            const toEntity = entities.find(e => e.id === rel.toEntityId);

            if (fromEntity && toEntity) {
                if (rel.type === '1:N') {
                    const fromTable = snakeCase(fromEntity.name) + 's';
                    const toTable = snakeCase(toEntity.name) + 's';
                    const fkColumn = snakeCase(toEntity.name) + '_id';

                    sql += `ALTER TABLE "${fromTable}" ADD COLUMN "${fkColumn}" UUID;\n`;
                    sql += `ALTER TABLE "${fromTable}" ADD CONSTRAINT "fk_${fromTable}_${fkColumn}" FOREIGN KEY ("${fkColumn}") REFERENCES "${toTable}"("id") ON DELETE ${(rel.onDelete || 'RESTRICT').toUpperCase()};\n\n`;
                }
                // Note: 1:1 and N:N relationships are more complex and may require junction tables or unique constraints. This is a simplified generator.
            }
        });
    }


    return sql;
}
