
function pascalCase(str: string): string {
    if (!str) return '';
    return str.replace(/(?:^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, g => g.toUpperCase().charAt(g.length - 1)).replace(/[^a-zA-Z0-9]/g, '');
}

export function generateApiRoutes(data: any): string {
    const endpoints = data.step13?.endpoints || [];
    let api = `// Generated API Route Handlers for ${data.step1?.systemName}\n`;
    api += `// Generated at: ${new Date().toISOString()}\n\n`;

    if (endpoints.length === 0) {
        return api + '// No endpoints defined.\n';
    }

    endpoints.forEach((endpoint: any) => {
        const filePath = endpoint.path.replace('/api/', '').replace(/{id}/g, '[id]');
        const functionName = `${endpoint.method.toUpperCase()}`;

        api += `// File: app/api/${filePath}/route.ts\n`;
        api += `// ARQUIVO GERADO - NÃO EDITE ESTE ARQUIVO.\n`;
        api += `// Edite a lógica de negócio no arquivo './logic.ts' ao invés deste.\n\n`;
        
        api += `import { NextRequest, NextResponse } from 'next/server';\n`;
        api += `import { handleBusinessLogic } from './logic'; // <-- ARQUIVO SEGURO PARA EDIÇÃO HUMANA\n\n`;
        
        api += `/**\n * @description ${endpoint.description}\n */\n`;
        api += `export async function ${functionName}(request: NextRequest, { params }: { params: { id: string } }) {\n`;
        api += `    try {\n`;
        if (endpoint.authRequired) {
            api += `        // TODO: Adicionar lógica de autenticação e autorização aqui, se necessário.\n`;
            api += `        // Ex: const session = await getServerSession(); if (!session) return new Response('Unauthorized', { status: 401 });\n`;
        }
        api += `        return await handleBusinessLogic(request, params);\n`;
        api += `    } catch (error) {\n`;
        api += `        console.error("API Error in ${endpoint.path}:", error);\n`;
        api += `        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });\n`;
        api += `    }\n`;
        api += `}\n\n`;

        api += `// --- Conteúdo sugerido para o arquivo 'logic.ts' (crie este arquivo manualmente na mesma pasta) ---\n`;
        api += `/*\n`;
        api += `import { NextRequest, NextResponse } from 'next/server';\n\n`;
        api += `export async function handleBusinessLogic(request: NextRequest, params: { id?: string }) {\n`;
        if (endpoint.method !== 'GET' && endpoint.method !== 'DELETE') {
             api += `    const body = await request.json();\n`;
             api += `    // TODO: Validar 'body' com Zod ou outra biblioteca de validação.\n\n`;
        }
        api += `    // IMPLEMENTE SUA LÓGICA DE NEGÓCIO AQUI\n`;
        api += `    // Ex: buscar dados no banco, chamar outras APIs, etc.\n\n`;
        api += `    const responseData = { \n`;
        api += `        message: "Lógica de negócio para ${endpoint.method} ${endpoint.path} executada", \n`;
        api += `        receivedId: params.id \n`;
        api += `    };\n\n`;
        api += `    return NextResponse.json(responseData);\n`;
        api += `}\n`;
        api += `*/\n`;
        api += `// -------------------------------------------------------------------\n\n`;
    });

    return api;
}
