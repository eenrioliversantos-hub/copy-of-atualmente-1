
import { Entity } from '../../components/modeling/steps/Step8Entities';

const typeMapping: Record<string, string> = {
    String: 'VARCHAR(255)', Text: 'TEXT', Integer: 'INTEGER', Float: 'DECIMAL(10, 2)',
    Boolean: 'BOOLEAN', Date: 'DATE', DateTime: 'TIMESTAMP WITH TIME ZONE', JSON: 'JSONB', UUID: 'UUID',
};

const snakeCase = (str: string): string => str ? str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_+/, '') : '';

export async function generateFullDb(wizardData: any): Promise<any> {
    const entities: Entity[] = wizardData.data_modeling?.step8?.entities || [];
    const relationships = wizardData.data_modeling?.step10?.relationships || [];
    const userProfiles = wizardData.planning?.step6?.userTypes || [];
    const endpoints = wizardData.data_modeling?.step13?.endpoints || [];

    // --- SQL Schema Generation ---
    let schemaSql = `--- Auto-generated SQL schema for ${wizardData.planning?.step1?.systemName}\n\n`;
    entities.forEach(entity => {
        const tableName = snakeCase(entity.name) + 's';
        schemaSql += `CREATE TABLE public."${tableName}" (\n`;
        schemaSql += `    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n`;
        entity.fields.forEach(field => {
            if (field.name) {
                schemaSql += `    "${snakeCase(field.name)}" ${typeMapping[field.type] || 'TEXT'}${field.required ? ' NOT NULL' : ''}${field.unique ? ' UNIQUE' : ''},\n`;
            }
        });
        if (entity.timestamps) {
            schemaSql += `    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,\n`;
            schemaSql += `    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,\n`;
        }
        if (entity.softDeletes) {
            schemaSql += `    deleted_at TIMESTAMP WITH TIME ZONE,\n`;
        }
        schemaSql = schemaSql.slice(0, -2) + '\n);\n\n';
    });
    relationships.forEach((rel: any) => {
        const fromEntity = entities.find(e => e.id === rel.fromEntityId);
        const toEntity = entities.find(e => e.id === rel.toEntityId);
        if(fromEntity && toEntity && rel.type === '1:N') {
            const fromTable = snakeCase(fromEntity.name) + 's';
            const toTable = snakeCase(toEntity.name) + 's';
            const fkColumn = snakeCase(toEntity.name) + '_id';
            schemaSql += `ALTER TABLE public."${fromTable}" ADD COLUMN "${fkColumn}" UUID REFERENCES public."${toTable}"(id) ON DELETE ${(rel.onDelete || 'RESTRICT').toUpperCase()};\n`;
            schemaSql += `CREATE INDEX ON public."${fromTable}" ("${fkColumn}");\n\n`;
        }
    });

    // --- Auth Schema ---
    const authSql = `
CREATE TABLE auth.users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL
);
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
    `.trim();

    // --- RLS Policies ---
    let rlsSql = `--- Row-Level Security Policies\n\n`;
    const userEntity = entities.find(e => e.name.toLowerCase() === 'usuario');
    if (userEntity) {
        const userTableName = snakeCase(userEntity.name) + 's';
        rlsSql += `ALTER TABLE public."${userTableName}" ENABLE ROW LEVEL SECURITY;\n\n`;
        rlsSql += `CREATE POLICY "Allow users to see their own data" ON public."${userTableName}"\n`;
        rlsSql += `FOR SELECT USING (auth.uid() = id);\n\n`;
    }
    userProfiles.forEach((profile: any) => {
        const roleName = snakeCase(profile.name);
        rlsSql += `-- Policies for role: ${roleName}\n`;
        rlsSql += `CREATE POLICY "Allow ${roleName} full access to their projects"\n`;
        rlsSql += `ON public.projects FOR ALL TO ${roleName}\n`;
        rlsSql += `USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);\n\n`;
    });


    // --- Triggers ---
    const triggersSql = `
-- Função genérica para atualizar a coluna 'updated_at'
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicação do Trigger em todas as tabelas com 'updated_at'
${entities.filter(e => e.timestamps).map(entity => {
    const tableName = snakeCase(entity.name) + 's';
    return `CREATE TRIGGER update_${tableName}_updated_at
BEFORE UPDATE ON public."${tableName}"
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();`
}).join('\n\n')}
    `.trim();

    // --- Documentation ---
    let readmeMd = `# Documentação do Banco de Dados: ${wizardData.planning?.step1?.systemName}\n\n`;
    entities.forEach(entity => {
        readmeMd += `## Tabela: ${snakeCase(entity.name)}s\n`;
        readmeMd += `**Descrição:** ${entity.description}\n\n`;
        readmeMd += `| Coluna | Tipo | Restrições |\n`;
        readmeMd += `|---|---|---|\n`;
        entity.fields.forEach(field => {
            if (field.name) {
                readmeMd += `| ${snakeCase(field.name)} | ${typeMapping[field.type]} | ${field.required ? 'NOT NULL' : ''} ${field.unique ? 'UNIQUE' : ''} |\n`;
            }
        });
        readmeMd += '\n';
    });

    // --- API Endpoints ---
    let apiEndpointsMd = `# Sugestão de Endpoints CRUD\n\n`;
    entities.forEach(entity => {
        const resource = snakeCase(entity.name) + 's';
        apiEndpointsMd += `## Recurso: /${resource}\n`;
        apiEndpointsMd += `- \`GET /${resource}\` - Lista todos os itens.\n`;
        apiEndpointsMd += `- \`POST /${resource}\` - Cria um novo item.\n`;
        apiEndpointsMd += `- \`GET /${resource}/{id}\` - Busca um item por ID.\n`;
        apiEndpointsMd += `- \`PUT /${resource}/{id}\` - Atualiza um item.\n`;
        apiEndpointsMd += `- \`DELETE /${resource}/{id}\` - Deleta um item.\n\n`;
    });

    return {
        files: {
            'schema.sql': schemaSql,
            'auth.sql': authSql,
            'politicas_rls.sql': rlsSql,
            'triggers.sql': triggersSql,
            'README.md': readmeMd,
            'api_endpoints.md': apiEndpointsMd,
        },
        analysis: {
            complexity: entities.length > 5 ? 'Alta' : 'Média',
            estimatedTime: `${entities.length * 8}-${entities.length * 12} horas`,
        }
    };
}
