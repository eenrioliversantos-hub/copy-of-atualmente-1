import { Entity } from '../../components/modeling/steps/Step8Entities';

const typeMapping: Record<string, string> = {
    String: 'z.string()',
    Text: 'z.string()',
    Integer: 'z.number().int()',
    Float: 'z.number()',
    Boolean: 'z.boolean()',
    Date: 'z.string().date()',
    DateTime: 'z.string().datetime()',
    JSON: 'z.any()', // or z.record(z.any())
    UUID: 'z.string().uuid()',
};

function pascalCase(str: string): string {
    return str.replace(/(?:^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, g => g.toUpperCase().charAt(g.length - 1)).replace(/[^a-zA-Z0-9]/g, '');
}

function camelCase(str: string): string {
    if(!str) return '';
    const pc = pascalCase(str);
    return pc.charAt(0).toLowerCase() + pc.slice(1);
}

export function generateZodSchemas(data: any): string {
    const entities: Entity[] = data.step8?.entities || [];
    let zod = `// Generated Zod Schemas for ${data.step1?.systemName}\n`;
    zod += `// Generated at: ${new Date().toISOString()}\n\n`;
    zod += `import { z } from 'zod';\n\n`;

    if (entities.length === 0) {
        return zod + '// No entities defined.\n';
    }

    entities.forEach(entity => {
        const schemaName = `${camelCase(entity.name)}Schema`;
        zod += `export const ${schemaName} = z.object({\n`;
        
        entity.fields.forEach(field => {
            const fieldName = camelCase(field.name);
            let fieldValidation = typeMapping[field.type] || 'z.string()';

            (field.validations || []).forEach(val => {
                const message = val.message ? `, { message: "${val.message}" }` : '';
                if(val.type === 'minLength') fieldValidation += `.min(${val.value}${message})`;
                if(val.type === 'maxLength') fieldValidation += `.max(${val.value}${message})`;
                if(val.type === 'email') fieldValidation += `.email({ message: "${val.message || 'Invalid email format'}" })`;
                if(val.type === 'url') fieldValidation += `.url({ message: "${val.message || 'Invalid URL format'}" })`;
                if(val.type === 'pattern') fieldValidation += `.regex(/${val.value}/${message})`;
            });

            if (!field.required) {
                fieldValidation += '.optional()';
            }

            zod += `    ${fieldName}: ${fieldValidation},\n`;
        });

        zod += `});\n\n`;
    });

    return zod;
}
