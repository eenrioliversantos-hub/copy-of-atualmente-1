

import { Entity } from '../../components/modeling/steps/Step8Entities';

const snakeCase = (str: string): string => str ? str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_+/, '') : '';
const pascalCase = (str: string): string => str.replace(/(?:^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, g => g.toUpperCase().charAt(g.length - 1)).replace(/[^a-zA-Z0-9]/g, '');

export function generateFullBackend(wizardData: any): any {
    const entities: Entity[] = wizardData.data_modeling?.step8?.entities || [];
    const functionalities = wizardData.functionalities || {};

    const files: Record<string, string> = {};

    // --- README.md ---
    files['README.md'] = `
# Backend para ${wizardData.planning?.step1?.systemName}

Este backend foi gerado automaticamente pela Plataforma Nexus.

## Estrutura
- \`/src/controllers\`: Controladores de rota.
- \`/src/services\`: Lógica de negócio.
- \`/src/index.ts\`: Arquivo principal do servidor.
    `.trim();

    // --- src/index.ts (Main server file) ---
    files['src/index.ts'] = `
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// TODO: Importar e usar rotas dos controllers

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
    `.trim();

    // --- Services and Controllers based on functionalities ---
    if (functionalities.step19?.events?.length > 0) {
        files['src/services/notificationService.ts'] = `
// Lógica para enviar notificações
// Canais configurados: ${(functionalities.step19.channels || []).join(', ')}

export const notificationService = {
  sendNotification: async (recipient: string, template: string) => {
    console.log(\`Enviando notificação para \${recipient}: \${template}\`);
    // TODO: Implementar lógica de envio para os canais.
    return { success: true };
  }
};
        `.trim();
    }

    if (functionalities.step21?.reports?.length > 0) {
        const reportNames = functionalities.step21.reports.map((r: any) => r.name).join(', ');
        files['src/controllers/reportController.ts'] = `
import { Request, Response } from 'express';

// TODO: Implementar a lógica de geração para os seguintes relatórios:
// ${reportNames}

export const reportController = {
  generateReport: async (req: Request, res: Response) => {
    const { reportName } = req.params;
    
    try {
      // TODO: Lógica para buscar dados e gerar o relatório \`reportName\`
      res.status(200).json({ message: \`Relatório \${reportName} gerado com sucesso.\`, data: [] });
    } catch (error) {
      res.status(500).json({ error: 'Falha ao gerar relatório.' });
    }
  }
};
        `.trim();
    }

    // --- Generic CRUD for each entity ---
    entities.forEach(entity => {
        const entityNamePascal = pascalCase(entity.name);
        const entityNameSnake = snakeCase(entity.name);

        files[`src/services/${entityNameSnake}Service.ts`] = `
// Service para a entidade ${entityNamePascal}
// TODO: Implementar lógica de banco de dados (Prisma, etc.)

export const ${entityNameSnake}Service = {
  findAll: async () => { /* ... */ },
  findById: async (id: string) => { /* ... */ },
  create: async (data: any) => { /* ... */ },
  update: async (id: string, data: any) => { /* ... */ },
  delete: async (id: string) => { /* ... */ },
};
        `.trim();

        files[`src/controllers/${entityNameSnake}Controller.ts`] = `
// Controller para a entidade ${entityNamePascal}

// TODO: Implementar rotas e chamar o service
        `.trim();
    });

    // --- Diagram Generation ---
    const firstEntity = entities[0];
    if (firstEntity) {
        const resourceName = snakeCase(firstEntity.name) + 's';
        
        const sequenceDiagram = `
\`\`\`mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant Database

    Client->>+Controller: POST /api/${resourceName}
    Controller->>+Service: create(data)
    Service->>+Database: INSERT into ${resourceName}
    Database-->>-Service: created record
    Service-->>-Controller: createdEntity
    Controller-->>-Client: 201 Created
\`\`\`
        `.trim();
        files['diagrams/diagrama_de_sequencia.md'] = sequenceDiagram;
    }

    let componentDiagram = '```mermaid\ngraph TD\n    subgraph "Backend Application"\n';
    Object.keys(files).forEach(path => {
        if (path.startsWith('src/')) {
            const fileName = path.split('/').pop() || '';
            const nodeName = fileName.replace('.ts', '');
            componentDiagram += `        ${nodeName}["${fileName}"]\n`;
        }
    });
    entities.forEach(entity => {
        const entityNameSnake = snakeCase(entity.name);
        componentDiagram += `        ${entityNameSnake}Controller --> ${entityNameSnake}Service\n`;
    });
    if (files['src/services/notificationService.ts']) {
        entities.forEach(entity => {
            const entityNameSnake = snakeCase(entity.name);
            componentDiagram += `        ${entityNameSnake}Service --> notificationService\n`;
        });
    }
    componentDiagram += '    end\n```';
    files['diagrams/diagrama_de_componentes.md'] = componentDiagram;


    return {
        files,
        analysis: {
            totalFiles: Object.keys(files).length,
            mainFeatures: Object.keys(functionalities).filter(key => Object.keys(functionalities[key]).length > 0),
        }
    };
}