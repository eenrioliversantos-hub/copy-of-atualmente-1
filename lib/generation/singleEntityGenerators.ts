import { Entity } from '../../components/modeling/steps/Step8Entities';

const typeMappingSql: Record<string, string> = {
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

const typeMappingPrisma: Record<string, string> = {
    String: 'String',
    Text: 'String',
    Integer: 'Int',
    Float: 'Float',
    Boolean: 'Boolean',
    Date: 'DateTime',
    DateTime: 'DateTime',
    JSON: 'Json',
    UUID: 'String @db.Uuid',
};


function snakeCase(str: string): string {
    if (!str) return '';
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_+/, '');
}

function pascalCase(str: string): string {
    if (!str) return '';
    return str.replace(/(?:^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, g => g.toUpperCase().charAt(g.length - 1)).replace(/[^a-zA-Z0-9]/g, '');
}

function camelCase(str: string): string {
    if(!str) return '';
    const pc = pascalCase(str);
    return pc.charAt(0).toLowerCase() + pc.slice(1);
}

export function generateSingleEntitySql(entity: Entity): string {
    if (!entity) return '-- No entity provided.';
    const tableName = snakeCase(entity.name) + 's';
    let sql = `CREATE TABLE "${tableName}" (\n`;
    sql += `    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n`;
    
    entity.fields.forEach(field => {
        const fieldName = snakeCase(field.name);
        const fieldType = typeMappingSql[field.type] || 'TEXT';
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
    sql += '\n);\n';

    // Add indexes
    entity.fields.forEach(field => {
        if (field.indexed) {
            const fieldName = snakeCase(field.name);
            sql += `\nCREATE INDEX "idx_${tableName}_${fieldName}" ON "${tableName}" ("${fieldName}");`;
        }
    });

    return sql;
}


export function generateSingleEntityPrisma(entity: Entity): string {
    if (!entity) return '// No entity provided.';
    const modelName = pascalCase(entity.name);
    let schema = `model ${modelName} {\n`;
    schema += `  id String @id @default(uuid()) @db.Uuid\n`;

    entity.fields.forEach(field => {
        const fieldName = camelCase(field.name);
        const fieldType = typeMappingPrisma[field.type] || 'String';
        const optional = field.required ? '' : '?';
        
        schema += `  ${fieldName} ${fieldType}${optional}`;

        if (field.unique) schema += ' @unique';
        // Note: simplified default value handling for Prisma
        if (field.defaultValue) {
             if (field.type === 'Integer' || field.type === 'Float' || field.type === 'Boolean') {
                 schema += ` @default(${field.defaultValue})`;
             } else {
                 schema += ` @default("${field.defaultValue}")`;
             }
        }
        
        schema += '\n';
    });

    if (entity.timestamps) {
        schema += `  createdAt DateTime @default(now())\n`;
        schema += `  updatedAt DateTime @updatedAt\n`;
    }
    if (entity.softDeletes) {
        schema += `  deletedAt DateTime?\n`;
    }
    
    const indexedFields = entity.fields.filter(f => f.indexed).map(f => camelCase(f.name));
    if (indexedFields.length > 0) {
        schema += '\n';
        indexedFields.forEach(fieldName => {
            schema += `  @@index([${fieldName}])\n`;
        });
    }
    
    // Note: Relationships are not included in this single-entity generator for simplicity.
    
    schema += '}';
    return schema;
}