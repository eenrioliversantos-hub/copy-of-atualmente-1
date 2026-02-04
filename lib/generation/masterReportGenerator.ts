
export function generateMasterReport(wizardData: any): string {
    const planning = wizardData?.planning || {};
    const vision = planning.step1 || {};
    const entities = wizardData?.data_modeling?.step8?.entities || [];
    const stack = planning.step4 || {};
    const devops = wizardData?.devops || {};
    const security = wizardData?.tech_reqs?.step25 || {};

    const systemName = vision.systemName || "Projeto Nexus";
    
    return `
# Relatório de Análise Mestra: ${systemName}

Este documento detalha o plano de engenharia do **${systemName}**, uma solução de arquitetura desenvolvida na plataforma Nexus. Esta análise foi gerada automaticamente pelo motor de inteligência da plataforma para servir como o Documento de Requisitos de Negócio (BRD) e Especificação Técnica Central.

### 1. Visão Estratégica e de Negócio
O sistema foi concebido para resolver os seguintes problemas: 
> *"${vision.problemSolved || 'Não especificado'}"*

*   **Objetivo Principal:** ${vision.mainObjective || 'N/A'}
*   **Público-Alvo:** ${(vision.targetAudience || []).join(', ')}
*   **Posicionamento:** O projeto foca em métricas de ${(vision.successMetrics || []).join(', ')}, indicando um modelo de alta performance.

### 2. Arquitetura Técnica e Stack
A arquitetura é baseada em padrões modernos para garantir escalabilidade e manutenibilidade:

*   **Padrão Arquitetural:** ${planning.step3?.architecture || 'Microsserviços'}
*   **Persistência:** Utiliza ${stack.database?.join(', ') || 'PostgreSQL'} para garantir integridade transacional.
*   **Comunicação:** Estratégia de backend baseada em ${stack.backend?.join(', ')}.
*   **Interface:** Aplicação construída em ${stack.frontend?.join(', ')} com foco em UX reativa.

### 3. Modelagem de Dados e Engenharia de Domínio
O ecossistema conta com ${entities.length} entidades principais, estruturadas para suportar fluxos complexos:

${entities.map((e: any) => `*   **${e.name}:** ${e.description || 'Entidade de domínio'}.`).join('\n')}

### 4. Segurança e Compliance
*   **Nível de Acesso:** Implementação de ${(wizardData?.planning?.step5?.providers || []).join(', ')}.
*   **Criptografia e Proteção:** ${security.https ? 'HTTPS Forçado, ' : ''}Proteções contra ${ (security.vulnerabilities || []).join(', ')}.
*   **Compliance:** O projeto segue diretrizes de ${(security.compliance || ['LGPD']).join(', ')}.

### 5. DevOps e Ciclo de Vida
*   **Infraestrutura:** Hospedagem via ${devops.hostingProvider || 'Provedor Cloud'}.
*   **CI/CD:** Pipeline automatizado com etapas de ${(devops.ciCdSteps || []).join(' -> ')}.
*   **Governança:** Estratégia de retenção de dados definida como ${wizardData?.data_modeling?.step8?.entities?.[0]?.dataGovernance?.retentionPolicy?.type || 'Standard'}.

---
*Análise gerada pelo Master Engine da Plataforma Nexus em ${new Date().toLocaleDateString('pt-BR')}*
    `.trim();
}
