export const dataTypes = ['BIGINT', 'VARCHAR', 'TEXT', 'BOOLEAN', 'DATE', 'TIMESTAMP', 'DECIMAL', 'ENUM', 'JSONB', 'UUID'];
export const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
export const authLevels = ['PUBLIC', 'AUTHENTICATED', 'ADMIN', 'OWNER', 'INTERNAL'];
export const policyTypes = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
export const validationRules = ['MIN_LENGTH', 'MAX_LENGTH', 'REGEX', 'MUST_BE_GREATER_THAN', 'MUST_BE_LESS_THAN'];
export const channelTypes = ['Lista UI Principal', 'Tela Detalhe UI', 'Formulário de Criação', 'Relatório/BI Externo', 'API de Terceiros'];

// Opções para o Modal de Estruturas de Dados
export const structureTypes = ['Array (Vetor)', 'Lista Ligada', 'Pilha (Stack)', 'Fila (Queue)', 'Tabela Hash', 'Árvore (Tree)', 'Grafo (Graph)'];
export const logicalOptions = ['Sequencial', 'Hierárquico', 'Rede', 'Linear', 'Não-ordenada'];
export const physicalOptions = ['Contígua (Array-based)', 'Dispersa (Pointer-based)', 'Contígua', 'Enlaçada', 'Indexada'];
export const complexityOptions = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'];
export const natureOptions = ['Estática', 'Dinâmica', 'Homogênea', 'Heterogênea'];
export const allocationOptions = ['Estática (Stack)', 'Dinâmica (Heap)', 'Híbrida', 'Estática', 'Dinâmica'];
