
import { generateSingleEntitySql, generateSingleEntityPrisma } from './generation/singleEntityGenerators';
import { generateBillOfMaterials } from './generation/billOfMaterialsGenerator';
import { generateMasterReport } from './generation/masterReportGenerator';
import { Entity } from '../components/modeling/steps/Step8Entities';
import { FileTreeItem } from '../components/shared/FileExplorer';

const pascalCase = (str: string) => str ? str.replace(/(?:^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, g => g.toUpperCase().charAt(g.length - 1)).replace(/[^a-zA-Z0-9]/g, '') : '';
const camelCase = (str: string) => {
    const pc = pascalCase(str);
    return pc.charAt(0).toLowerCase() + pc.slice(1);
};

const createFile = (name: string, content: string, language: string, path: string): FileTreeItem & { fullPath: string } => ({
    name,
    type: 'file',
    content,
    language,
    fullPath: path
});

const createFolder = (name: string, children: FileTreeItem[]): FileTreeItem => ({
    name,
    type: 'folder',
    children
});

export function compileProjectArtifacts(wizardData: any): FileTreeItem[] {
    if (!wizardData) return [];

    const tree: FileTreeItem[] = [];
    const entities: Entity[] = wizardData.data_modeling?.step8?.entities || [];
    const planning = wizardData.planning || {};
    const prototype = wizardData.interface_ux?.prototype || { pages: [] };
    const apiArtifacts = wizardData.artifacts?.api_design || {};
    const systemName = planning.step1?.systemName || 'nexus-project';
    const slug = systemName.toLowerCase().replace(/\s+/g, '-');
    
    // --- 1. ROOT CONFIG FILES ---
    tree.push(createFile('.env.example', `DATABASE_URL="postgresql://user:pass@localhost:5432/${slug}?schema=public"\nJWT_SECRET="super-secret-key-change-me"\nPORT=3000`, 'plaintext', '.env.example'));
    
    tree.push(createFile('docker-compose.yml', `
version: '3.8'
services:
  db:
    image: postgres:15-alphine
    restart: always
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=${slug}
    ports:
      - '5432:5432'
    volumes: 
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
    `.trim(), 'yaml', 'docker-compose.yml'));

    tree.push(createFile('tsconfig.json', JSON.stringify({
        compilerOptions: {
            target: "ES2022",
            module: "NodeNext",
            moduleResolution: "NodeNext",
            baseUrl: "./",
            paths: { "@/*": ["src/*"] },
            strict: true,
            skipLibCheck: true
        }
    }, null, 2), 'json', 'tsconfig.json'));

    // --- 2. DOCUMENTAÇÃO ---
    const docs = [
        createFile('README.md', `# ${systemName}\n\n${planning.step1?.description || ''}\n\n## Como Rodar\n1. \`docker-compose up -d\`\n2. \`npm install\`\n3. \`npx prisma migrate dev\`\n4. \`npm run dev\``, 'markdown', 'docs/README.md'),
        createFile('MASTER_ANALYSIS.md', generateMasterReport(wizardData), 'markdown', 'docs/MASTER_ANALYSIS.md'),
        createFile('BUSINESS_RULES.md', `# Regras de Negócio\n\n${(wizardData.data_modeling?.step12?.rules || []).map((r: any) => `### ${r.description}\n- **Dado:** ${r.given}\n- **Quando:** ${r.when}\n- **Então:** ${r.then}`).join('\n\n')}`, 'markdown', 'docs/BUSINESS_RULES.md'),
        createFile('BILL_OF_MATERIALS.md', generateBillOfMaterials(wizardData), 'markdown', 'docs/BILL_OF_MATERIALS.md')
    ];
    tree.push(createFolder('docs', docs));

    // --- 3. DATABASE LAYER (Prisma & SQL) ---
    const dbFiles = [];
    if (entities.length > 0) {
        const prismaModels = entities.map(e => generateSingleEntityPrisma(e)).join('\n\n');
        const prismaContent = `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\ngenerator client {\n  provider = "prisma-client-js"\n}\n\n${prismaModels}`;
        dbFiles.push(createFile('schema.prisma', prismaContent, 'prisma', 'prisma/schema.prisma'));
        
        const fullSql = entities.map(e => generateSingleEntitySql(e)).join('\n\n');
        dbFiles.push(createFile('init.sql', fullSql, 'sql', 'prisma/init.sql'));
    }
    tree.push(createFolder('prisma', dbFiles));

    // --- 4. BACKEND (API & SERVICES) ---
    const serverFiles: FileTreeItem[] = [];
    if (apiArtifacts) {
        Object.entries(apiArtifacts).forEach(([path, content]) => {
            if (typeof content === 'string') {
                const parts = path.split('/');
                const fileName = parts.pop() || '';
                serverFiles.push(createFile(fileName, content, 'typescript', `server/${path}`));
            }
        });
    }
    if (serverFiles.length === 0) {
        entities.forEach(entity => {
            const name = camelCase(entity.name);
            const serviceContent = `import { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient();\n\nexport const ${name}Service = {\n  async findMany() { return prisma.${name}.findMany(); },\n  async create(data: any) { return prisma.${name}.create({ data }); }\n};`;
            serverFiles.push(createFile(`${name}.service.ts`, serviceContent, 'typescript', `server/services/${name}.service.ts`));
        });
    }
    tree.push(createFolder('server', serverFiles));

    // --- 5. FRONTEND (WEB APP) ---
    const appDir: FileTreeItem[] = [];
    const componentsDir: FileTreeItem[] = [];

    prototype.pages.forEach((page: any) => {
        const pageCode = page.tsxCode || `import React from 'react';\n\nexport default function ${pascalCase(page.name)}() {\n  return <div className="p-8"><h1>${page.name}</h1><p>${page.description}</p></div>;\n}`;
        const pathParts = page.path.split('/').filter(Boolean);
        
        if (pathParts.length === 0) {
            appDir.push(createFile('page.tsx', pageCode, 'typescript', 'client/src/app/page.tsx'));
        } else {
            appDir.push(createFolder(pathParts[0], [createFile('page.tsx', pageCode, 'typescript', `client/src/app/${pathParts[0]}/page.tsx`)]));
        }

        if (page.components) {
            page.components.forEach((comp: any) => {
                const compName = pascalCase(comp.name);
                const compCode = `import React from 'react';\n\nexport const ${compName} = () => (\n  <div className="p-4 border rounded-lg shadow-sm bg-white">\n    <h3 className="font-bold">${comp.name}</h3>\n    <p className="text-gray-600 text-sm">${comp.description}</p>\n  </div>\n);`;
                componentsDir.push(createFile(`${compName}.tsx`, compCode, 'typescript', `client/src/components/${compName}.tsx`));
            });
        }
    });

    const srcDir = [
        createFolder('app', appDir),
        createFolder('components', componentsDir),
        createFile('layout.tsx', `import React from 'react';\nimport './globals.css';\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (<html><body className="bg-slate-50 min-h-screen">{children}</body></html>);\n}`, 'typescript', 'client/src/app/layout.tsx'),
        createFile('globals.css', `@tailwind base;\n@tailwind components;\n@tailwind utilities;`, 'css', 'client/src/app/globals.css')
    ];
    
    tree.push(createFolder('client', [
        createFolder('src', srcDir),
        createFile('package.json', JSON.stringify({ 
            name: `${slug}-web`, 
            dependencies: { "next": "14.2.0", "react": "18.3.0", "react-dom": "18.3.0", "lucide-react": "^0.300.0", "tailwind-merge": "^2.0.0" },
            devDependencies: { "typescript": "^5.0.0", "tailwindcss": "^3.0.0", "postcss": "^8.0.0" }
        }, null, 2), 'json', 'client/package.json'),
        createFile('tailwind.config.js', `module.exports = { content: ["./src/**/*.{ts,tsx}"], theme: { extend: {} }, plugins: [] }`, 'javascript', 'client/tailwind.config.js')
    ]));

    return tree;
}

export function flattenFileTree(items: FileTreeItem[], prefix = ''): Record<string, string> {
    const manifest: Record<string, string> = {};
    items.forEach(item => {
        const currentPath = prefix ? `${prefix}/${item.name}` : item.name;
        if (item.type === 'file' && item.content) {
            manifest[currentPath] = item.content;
        } else if (item.type === 'folder' && item.children) {
            Object.assign(manifest, flattenFileTree(item.children, currentPath));
        }
    });
    return manifest;
}
