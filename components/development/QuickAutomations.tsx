
import React from 'react';
import Icon from '../shared/Icon';
import { DevTask } from '../../types';
import { Card, CardContent } from '../ui/Card';

interface QuickAutomationsProps {
    taskContext: DevTask;
    onGenerate: (prompt: string) => void;
    projectId: string;
}

const QuickAutomations: React.FC<QuickAutomationsProps> = ({ taskContext, onGenerate }) => {
    const automationOptions = [
        {
            id: 'tests',
            label: 'Gerar Testes Unitários',
            icon: 'clipboardCheck',
            prompt: 'Gere testes unitários para esta tarefa usando Jest/Vitest. Cubra casos de sucesso e erro.',
            description: 'Cria suíte de testes para a funcionalidade.'
        },
        {
            id: 'docs',
            label: 'Gerar Documentação',
            icon: 'file-text',
            prompt: 'Adicione comentários JSDoc explicativos para as funções e classes principais criadas nesta tarefa.',
            description: 'Documenta o código com padrões JSDoc.'
        },
        {
            id: 'refactor',
            label: 'Sugerir Refatoração',
            icon: 'shuffle',
            prompt: 'Analise o código desta tarefa e sugira melhorias de legibilidade e performance.',
            description: 'Analisa e melhora a qualidade do código.'
        },
        {
            id: 'security',
            label: 'Análise de Segurança',
            icon: 'shield',
            prompt: 'Analise o código em busca de vulnerabilidades de segurança comuns (XSS, Injection, etc).',
            description: 'Verifica brechas de segurança.'
        }
    ];

    return (
        <div className="space-y-4 animate-in fade-in-50">
            <div className="flex items-center gap-2 mb-2">
                <Icon name="zap" className="h-4 w-4 text-accent" />
                <h3 className="font-bold text-sm uppercase text-text-secondary">Automações Rápidas</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
                {automationOptions.map(option => (
                    <button
                        key={option.id}
                        onClick={() => onGenerate(option.prompt)}
                        className="flex items-start gap-3 p-3 rounded-lg bg-[#1e293b] border border-[#334155] hover:border-accent hover:bg-[#334155]/80 transition-all group text-left w-full"
                    >
                        <div className="p-2 bg-background rounded-md group-hover:bg-accent/10 transition-colors">
                            <Icon name={option.icon} className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <div className="font-semibold text-sm text-slate-200 group-hover:text-accent transition-colors">{option.label}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{option.description}</div>
                        </div>
                    </button>
                ))}
            </div>
             <Card className="bg-[#1e293b] border-[#334155] mt-4">
                <CardContent className="p-4">
                    <div className="flex gap-2">
                        <Icon name="info" className="h-4 w-4 text-sky-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-400">
                            Selecionar uma automação envia um prompt contextualizado para o Assistente de IA.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default QuickAutomations;
