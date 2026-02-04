import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/Tabs';
import { Entity } from '../../../../lib/entity-modeler/types';
import Icon from './Icon';

interface CodeGeneratorProps {
    entity: Entity;
}

const generateSql = (entity: Entity): string => {
    const tableName = entity.physicalName || `${entity.name.toLowerCase()}s`;
    let columns = `  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n`;
    
    (entity.attributes || []).forEach(attr => {
        columns += `  "${attr.name}" ${attr.type}${attr.isNN ? ' NOT NULL' : ''}${attr.isUnique ? ' UNIQUE' : ''},\n`;
    });

    if (entity.security.hasAudit) {
        columns += `  created_at TIMESTAMPTZ DEFAULT now(),\n`;
        columns += `  updated_at TIMESTAMPTZ DEFAULT now(),\n`;
    }

    return `CREATE TABLE "${tableName}" (\n${columns.slice(0, -2)}\n);`;
};

const generateTsInterface = (entity: Entity): string => {
    const typeMap: Record<string, string> = {
        'VARCHAR': 'string',
        'TEXT': 'string',
        'INTEGER': 'number',
        'BOOLEAN': 'boolean',
        'DATE': 'string', // Or Date
        'DATETIME': 'string', // or Date
        'JSON': 'any',
        'UUID': 'string',
    };
    let properties = `  id: string;\n`;
    (entity.attributes || []).forEach(attr => {
        properties += `  ${attr.name}${attr.isNN ? '' : '?'}: ${typeMap[attr.type] || 'any'};\n`;
    });
    return `interface ${entity.name} {\n${properties}}`;
};

const CodeBlock: React.FC<{ code: string, language: string }> = ({ code, language }) => (
    <pre className="bg-background p-4 rounded-lg text-sm text-text-primary overflow-x-auto border border-card-border">
        <code className={`language-${language}`}>{code}</code>
    </pre>
);

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ entity }) => {
    const sqlCode = useMemo(() => generateSql(entity), [entity]);
    const tsCode = useMemo(() => generateTsInterface(entity), [entity]);

    return (
        <div className="mt-8">
             <h3 className="text-xl font-bold mb-4 text-text-primary flex items-center">
                <Icon name="code" className="w-5 h-5 mr-2 text-accent" />
                Gerador de Código
            </h3>
            <Tabs defaultValue="sql" className="w-full">
                <TabsList>
                    <TabsTrigger value="sql">SQL (Postgres)</TabsTrigger>
                    <TabsTrigger value="typescript">TypeScript</TabsTrigger>
                    <TabsTrigger value="zod">Zod Schema</TabsTrigger>
                </TabsList>
                <TabsContent value="sql" className="mt-4">
                    <CodeBlock code={sqlCode} language="sql" />
                </TabsContent>
                <TabsContent value="typescript" className="mt-4">
                     <CodeBlock code={tsCode} language="typescript" />
                </TabsContent>
                 <TabsContent value="zod" className="mt-4">
                     <CodeBlock code={"// Zod schema generation is a work in progress."} language="typescript" />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CodeGenerator;
