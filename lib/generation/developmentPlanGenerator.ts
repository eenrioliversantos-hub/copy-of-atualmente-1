
import { GoogleGenAI, Type } from "@google/genai";
import { DevelopmentPlan, DevTask, TaskDetails } from "../../types";

// Schema for the expected JSON output from the AI for task details
const taskDetailsSchema = {
    type: Type.OBJECT,
    properties: {
        errosComuns: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    erro: { type: Type.STRING },
                    solucao: { type: Type.STRING },
                    prevencao: { type: Type.STRING },
                },
                required: ['erro', 'solucao', 'prevencao'],
            },
        },
        faq: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    pergunta: { type: Type.STRING },
                    resposta: { type: Type.STRING },
                },
                required: ['pergunta', 'resposta'],
            },
        },
    },
};


async function enrichTaskWithDetails(taskTitle: string): Promise<TaskDetails> {
    if (!process.env.API_KEY) {
        console.warn("API_KEY not found. Skipping AI enrichment.");
        return {
            errosComuns: [{ erro: 'API Key não configurada', solucao: 'Configure a API_KEY para habilitar a IA.', prevencao: 'Verifique as variáveis de ambiente.' }],
            faq: [{ pergunta: 'Por que a IA não está funcionando?', resposta: 'A chave da API do Gemini não foi encontrada no ambiente.' }]
        };
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `Para a tarefa de desenvolvimento de software "${taskTitle}", gere o seguinte conteúdo em português do Brasil:
        1.  **errosComuns**: Uma lista de 2 a 3 erros comuns que desenvolvedores cometem ao implementar esta tarefa, com campos "erro", "solucao" e "prevencao".
        2.  **faq**: Uma lista de 2 a 3 perguntas frequentes sobre esta tarefa, com campos "pergunta" e "resposta".

        Retorne a resposta estritamente como um objeto JSON que corresponda ao schema fornecido.`;

        // Corrected model name to gemini-3-flash-preview
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: taskDetailsSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as TaskDetails;

    } catch (error) {
        console.error(`Error enriching task "${taskTitle}":`, error);
        // Return an empty object or minimal details on error so the process can continue
        return {
            errosComuns: [{ erro: 'Falha ao gerar conteúdo', solucao: 'Tente novamente', prevencao: 'Verifique a conexão com a API' }],
            faq: [{ pergunta: 'Por que o conteúdo não foi gerado?', resposta: 'Houve um erro na comunicação com a API do Gemini.' }]
        };
    }
}


export async function enrichPlanWithDetails(basePlan: DevelopmentPlan, onProgress: (taskTitle: string) => void): Promise<DevelopmentPlan> {
    const keyTasksToEnrich = new Set([
        'Inicialização do Projeto',
        'Configuração de Ferramentas de Desenvolvimento',
        'Configuração do Banco de Dados (Prisma & PostgreSQL)',
        'Estrutura Principal do Backend (Express)',
        'Módulo de Autenticação (`auth`)',
        'Configuração Inicial do Frontend (React + Vite)',
        'Lógica e UI de Autenticação',
    ]);

    const findAndEnrichTasks = async (tasks: DevTask[]): Promise<DevTask[]> => {
        const enrichedTasks: DevTask[] = [];
        for (const task of tasks) {
            if (keyTasksToEnrich.has(task.title)) {
                onProgress(task.title);
                const details = await enrichTaskWithDetails(task.title);
                enrichedTasks.push({ ...task, details });
            } else {
                enrichedTasks.push(task);
            }
        }
        return enrichedTasks;
    };
    
    basePlan.setupAndDevOps = await findAndEnrichTasks(basePlan.setupAndDevOps);

    for (const sprint of basePlan.sprints) {
        sprint.backendTasks = await findAndEnrichTasks(sprint.backendTasks);
        sprint.frontendTasks = await findAndEnrichTasks(sprint.frontendTasks);
    }
    
    return basePlan;
}
