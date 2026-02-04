
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { DevTask } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { ScrollArea } from '../ui/ScrollArea';

interface AIAssistantProps {
    taskContext: DevTask;
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ taskContext }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            if (!process.env.API_KEY) {
                throw new Error("API_KEY do Gemini não configurada.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const fullPrompt = `
                Contexto da Tarefa de Desenvolvimento:
                - Título: "${taskContext.title}"
                - Descrição/Objetivo: "${taskContext.details?.description || 'N/A'}"
                - Checklist: ${taskContext.subTasks.map(st => `"- ${st.text}"`).join('\n')}

                Com base nesse contexto, responda à seguinte pergunta do desenvolvedor de forma clara, concisa e focada em código, se aplicável.
                
                Pergunta do Desenvolvedor: "${input}"
            `;
            
            // Corrected model name to gemini-3-flash-preview
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: fullPrompt,
            });

            const aiMessage: Message = { sender: 'ai', text: response.text };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            const errorMessage: Message = { sender: 'ai', text: `Desculpe, ocorreu um erro. ${error instanceof Error ? error.message : 'Verifique o console para mais detalhes.'}` };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background">
            <header className="p-3 border-b border-card-border flex-shrink-0">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Icon name="sparkles" className="h-4 w-4 text-accent" />
                    Assistente de IA
                </h3>
            </header>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <Icon name="sparkles" className="h-5 w-5 text-accent flex-shrink-0 mt-1" />}
                            <div className={`max-w-xl rounded-lg p-3 ${msg.sender === 'user' ? 'bg-accent text-white' : 'bg-sidebar'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex gap-3">
                            <Icon name="sparkles" className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                            <div className="max-w-xl rounded-lg p-3 bg-sidebar flex items-center gap-2">
                                <Icon name="spinner" className="h-4 w-4 animate-spin" />
                                <span className="text-sm text-text-secondary">Pensando...</span>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <footer className="p-3 border-t border-card-border flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pergunte algo sobre a tarefa..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        <Icon name="arrowRight" className="h-4 w-4" />
                    </Button>
                </form>
            </footer>
        </div>
    );
};

export default AIAssistant;
