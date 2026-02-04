export function generateBillOfMaterials(wizardData: any): string {
    let bom = `# 📋 Lista de Materiais - ${wizardData.planning?.step1?.systemName}\n\n`;
    bom += `Gerado em: ${new Date().toLocaleDateString()}\n\n`;

    // 1. Stack Tecnológico
    const stack = wizardData.planning?.step4;
    if (stack) {
        bom += `## 1. Stack Tecnológico Principal\n\n`;
        bom += `| Categoria  | Tecnologias Selecionadas |\n`;
        bom += `|------------|--------------------------|\n`;
        if (stack.frontend?.length) bom += `| Frontend   | ${stack.frontend.join(', ')} |\n`;
        if (stack.backend?.length) bom += `| Backend    | ${stack.backend.join(', ')} |\n`;
        if (stack.database?.length) bom += `| Banco de Dados | ${stack.database.join(', ')} |\n`;
        bom += `\n`;
    }

    // 2. Modelo de Dados (Entidades)
    const entities = wizardData.data_modeling?.step8?.entities || [];
    if (entities.length > 0) {
        bom += `## 2. Componentes de Dados (Entidades)\n\n`;
        entities.forEach((entity: any) => {
            bom += `### 🔩 **Entidade: ${entity.name}**\n`;
            bom += `- **Descrição:** ${entity.description}\n`;
            bom += `- **Peças (Campos):**\n`;
            entity.fields.forEach((field: any) => {
                bom += `  - **${field.name}**: \`${field.type}\` ${field.required ? '(Obrigatório)' : ''}\n`;
            });
            bom += `\n`;
        });
    }

    // 3. APIs / Endpoints
    const endpoints = wizardData.data_modeling?.step13?.endpoints || [];
    if (endpoints.length > 0) {
        bom += `## 3. Componentes de Comunicação (APIs/Endpoints)\n\n`;
        bom += `| Método | Caminho (Path) | Descrição | Autenticação |\n`;
        bom += `|--------|----------------|-------------|--------------|\n`;
        endpoints.forEach((ep: any) => {
            bom += `| \`${ep.method}\` | \`${ep.path}\` | ${ep.description} | ${ep.authRequired ? '✅ Sim' : '❌ Não'} |\n`;
        });
        bom += `\n`;
    }

    // 4. Interface do Usuário (Telas e Componentes)
    const screens = wizardData.interface_ux?.step15?.screens || [];
    const uiComponents = wizardData.interface_ux?.step16?.components || {};
    if (screens.length > 0) {
        bom += `## 4. Componentes de Interface (UI)\n\n`;
        screens.forEach((screen: any) => {
            bom += `### 🖥️ **Tela: ${screen.path}**\n`;
            bom += `- **Descrição:** ${screen.description}\n`;
            bom += `- **Layout:** ${screen.layout}\n`;
            const componentsOnScreen = uiComponents[screen.id] || [];
            if (componentsOnScreen.length > 0) {
                bom += `- **Peças (Componentes Principais):**\n`;
                componentsOnScreen.forEach((comp: any) => {
                    bom += `  - **${comp.type}:** ${comp.description}\n`;
                });
            }
            bom += `\n`;
        });
    }

    // 5. Integrações
    const integrations = wizardData.data_modeling?.step14?.integrations || [];
    if (integrations.length > 0) {
        bom += `## 5. Componentes Externos (Integrações)\n\n`;
        integrations.forEach((integration: any) => {
            bom += `- **Serviço:** ${integration.service} (${integration.type})\n`;
            bom += `  - **Propósito:** ${integration.purpose}\n`;
            bom += `  - **Compatibilidade/Direção:** ${integration.direction}\n\n`;
        });
    }

    // 6. Funcionalidades
    const reports = wizardData.functionalities?.step21?.reports || [];
    if (reports.length > 0) {
        bom += `## 6. Componentes Funcionais (Relatórios)\n\n`;
        reports.forEach((report: any) => {
            bom += `- **Relatório:** ${report.name}\n`;
            bom += `  - **Baseado em:** ${entities.find((e:any) => e.id === report.entityId)?.name || 'N/A'}\n`;
            bom += `  - **Visualização:** ${report.visualization}\n\n`;
        });
    }

    return bom;
}
