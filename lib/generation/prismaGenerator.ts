
import { Entity, Field } from '../../components/modeling/steps/Step8Entities';

const typeMapping: Record<string, string> = {
    String: 'String',
    Text: 'String',
    Integer: 'Int',
    Float: 'Float',
    Boolean: 'Boolean',
    Date: 'DateTime',
    DateTime: 'DateTime',
    JSON: 'Json',
    UUID: 'String',
};

function pascalCase(str: string): string {
    if (!str) return '';
    return str.replace(/(?:^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, g => g.toUpperCase().charAt(g.length - 1)).replace(/[^a-zA-Z0-9]/g, '');
}

function camelCase(str: string): string {
    const pc = pascalCase(str);
    return pc.charAt(0).toLowerCase() + pc.slice(1);
}

export function generatePrismaSchema(data: any): string {
    const entities: Entity[] = data.step8?.entities || [];
    const relationships = data.step10?.relationships || [];
    let schema = `// Generated Prisma Schema for ${data.step1?.systemName}\n`;
    schema += `// Generated at: ${new Date().toISOString()}\n\n`;

    schema += `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n`;
    schema += `generator client {\n  provider = "prisma-client-js"\n}\n\n`;

    if (entities.length === 0) {
        return schema + '// No entities defined.\n';
    }

    entities.forEach(entity => {
        const modelName = pascalCase(entity.name);
        schema += `model ${modelName} {\n`;
        schema += `  id String @id @default(uuid())\n`;

        entity.fields.forEach(field => {
            const fieldName = camelCase(field.name);
            const fieldType = typeMapping[field.type] || 'String';
            const optional = field.required ? '' : '?';
            
            schema += `  ${fieldName} ${fieldType}${optional}`;

            if (field.unique) schema += ' @unique';
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

        schema += '}\n\n';
    });
    
    // A full implementation would parse relationships and add relation fields to the models.
    // This is a complex task and is simplified here.
    if(relationships.length > 0) {
        schema += `// Relationships need to be added manually based on the model above.\n`;
    }

    return schema;
}
